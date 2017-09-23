import typescriptPlugin from "rollup-plugin-typescript2";
import diPlugin from "@wessberg/rollup-plugin-di";
import packageJSON from "./package.json";
import {Config} from "@wessberg/environment";

export default {
	input: "src/index.ts",
	output: [
		{
			file: packageJSON.main,
			format: "umd",
			name: "CodeAnalyzer",
			sourcemap: true
		},
		{
			file: packageJSON.module,
			format: "es",
			sourcemap: true
		},
	],
	treeshake: true,
	plugins: [
		diPlugin({
			shimGlobalObject: false
		}),
		typescriptPlugin({
			tsconfig: Config.PRODUCTION ? "tsconfig.dist.json" : "tsconfig.json",
			include: ["*.ts+(|x)", "**/*.ts+(|x)"],
			exclude: ["*.d.ts", "**/*.d.ts"],
			cacheRoot: "./.cache",
			clean: true
		})
	],
	external: [
		...Object.keys(packageJSON.dependencies),
		...Object.keys(packageJSON.devDependencies)
	]
};