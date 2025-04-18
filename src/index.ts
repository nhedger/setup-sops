import { getInput } from "@actions/core";
import { createActionAuth } from "@octokit/auth-action";
import { Octokit } from "@octokit/rest";
import { setup } from "./setup";

(async () => {
	await setup({
		version: getInput("version"),
		platform: process.platform as "linux" | "darwin" | "win32",
		arch: process.arch as "x64" | "arm64",
		octokit: new Octokit({
			auth: (await createActionAuth()()).token,
		}),
	});
})();
