import { chmod, symlink } from "node:fs/promises";
import { dirname, join } from "node:path";
import { addPath, setFailed } from "@actions/core";
import { downloadTool } from "@actions/tool-cache";
import { RequestError } from "@octokit/request-error";
import { Octokit } from "@octokit/rest";

/**
 * SOPS Setup Options
 */
export interface SetupOptions {
	/**
	 * Version of SOPS to download
	 */
	version: string;

	/**
	 * Operating system to download the CLI for
	 */
	platform: "linux" | "darwin" | "win32";

	/**
	 * Architecture
	 */
	arch?: "x64" | "arm64";

	/**
	 * Octokit instance to use for API calls
	 */
	octokit: Octokit;
}

const defaultOptions: SetupOptions = {
	version: "latest",
	platform: process.platform as "linux" | "darwin" | "win32",
	arch: process.arch as "x64" | "arm64",
	octokit: new Octokit(),
};

export const setup = async (config: Partial<SetupOptions>) => {
	const options: SetupOptions = { ...defaultOptions, ...config };

	try {
		// Download SOPS
		const executablePath = await download(options);

		// Install SOPS
		await install(executablePath);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(error.message);
			setFailed(error.message);
		}
	}
};

/**
 * Downloads SOPS
 */
const download = async (options: SetupOptions): Promise<string> => {
	try {
		const releaseId = await findRelease(options);
		const assetURL = await findAsset(releaseId, options);
		return await downloadTool(assetURL);
	} catch (error) {
		if (error instanceof RequestError) {
			const requestError = error as RequestError;
			if (requestError.status === 403 && requestError.response?.headers["x-ratelimit-remaining"] === "0") {
				throw new Error(`
                    You have exceeded the GitHub API rate limit.
                    Please try again in ${requestError.response?.headers["x-ratelimit-reset"]} seconds.
                    If you have not already done so, you can try authenticating calls to the GitHub API
                    by setting the \`GITHUB_TOKEN\` environment variable.
                `);
			}
		}
		throw error;
	}
};

/**
 * Finds the release for the given version
 */
const findRelease = async (options: SetupOptions) => {
	try {
		if (options.version === "latest") {
			return (
				await options.octokit.repos.getLatestRelease({
					owner: "getsops",
					repo: "sops",
				})
			).data.id;
		}

		return (
			await options.octokit.repos.getReleaseByTag({
				owner: "getsops",
				repo: "sops",
				tag: `v${options.version}`,
			})
		).data.id;
	} catch (error) {
		if (error instanceof RequestError) {
			const requestError = error as RequestError;
			if (requestError.status === 404) {
				throw new Error(`Version ${options.version} of SOPS does not exist.`);
			}
			throw error;
		}
		throw error;
	}
};

/**
 * Finds the asset for the given release ID and options
 */
const findAsset = async (releaseId: number, options: SetupOptions) => {
	const assets = await options.octokit.repos.listReleaseAssets({
		owner: "getsops",
		repo: "sops",
		release_id: releaseId,
	});

	const patterns: Map<string, string> = new Map([
		["linux.x64", ".linux.amd64"],
		["linux.arm64", ".linux.arm64"],
		["darwin.x64", ".darwin.amd64"],
		["darwin.arm64", ".darwin.arm64"],
		["win32.x64", ".amd64.exe"],
		["win32.arm64", ".arm64.exe"],
	]);

	const asset = assets.data.find((asset) =>
		asset.name.endsWith(patterns.get(`${options.platform}.${options.arch}`) as string),
	);

	if (!asset) {
		throw new Error(`Could not find a SOPS release for ${options.platform}.${options.arch} for the given version.`);
	}

	return asset.browser_download_url;
};

/**
 * Installs the downloaded SOPS binary
 */
const install = async (executablePath: string) => {
	// Symlink the binary to sops
	await symlink(executablePath, join(dirname(executablePath), "sops"));

	// Make binary executable
	await chmod(executablePath, 0o755);
	await chmod(join(dirname(executablePath), "sops"), 0o755);

	// Add the CLI binary to the PATH
	addPath(dirname(executablePath));
};
