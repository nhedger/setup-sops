import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	entries: ["./src/index"],
	outDir: "build",
	rollup: {
		inlineDependencies: true,
	},
});
