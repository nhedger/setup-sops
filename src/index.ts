import { setup } from "./setup";
import { getInput } from "@actions/core";
import { createActionAuth } from "@octokit/auth-action";
import { Octokit } from "@octokit/rest";

(async () => {
	await setup({
		version: getInput("version"),
		platform: process.platform as "linux" | "darwin" | "win32",
		octokit: new Octokit({
			auth: (await createActionAuth()()).token,
		}),
	});
})();
