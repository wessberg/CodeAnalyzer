import typescriptPlugin from "rollup-plugin-typescript2";
import diPlugin from "@wessberg/rollup-plugin-di";
import packageJSON from "./package.json";
import {Config} from "@wessberg/environment";

export default {
	input: "test/code-analyzer/code-analyzer.test.ts",
	output: {
		file: "compiled/code-analyzer.test.js",
		format: "cjs",
		name: "Fovea-compiler",
		sourcemap: true
	},
	treeshake: true,
	plugins: [
		diPlugin({
			shimGlobalObject: false
		}),
		typescriptPlugin({
			tsconfig: Config.PRODUCTION ? "tsconfig.dist.json" : "tsconfig.json",
			include: ["*.ts+(|x)", "**/*.ts+(|x)"],
			exclude: ["*.d.ts", "**/*.d.ts"],
			cacheRoot: "/tmp",
			clean: true
		})
	],
	external: [
		...Object.keys(packageJSON.dependencies),
		...Object.keys(packageJSON.devDependencies)
	]
};