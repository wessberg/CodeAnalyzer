import typescriptPlugin from "rollup-plugin-typescript2";
import diPlugin from "@wessberg/rollup-plugin-di";
import packageJSON from "./package.json";

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
	globals: {
		"@wessberg/di": "di",
		"@wessberg/stringutil": "stringUtil",
		"@wessberg/moduleutil": "moduleUtil",
		"@wessberg/fileloader": "fileloader",
		"@wessberg/typescript-language-service": "typescriptLanguageService",
		"@wessberg/typescript-ast-util": "typescriptAstUtil",
		"@wessberg/typescript-package-reassembler": "typescriptPackageReassembler",
		"typescript": "typescript"
	},
	plugins: [
		diPlugin({
			shimGlobalObject: false
		}),
		typescriptPlugin({
			tsconfig: process.env.NODE_ENV === "production" ? "tsconfig.dist.json" : "tsconfig.json",
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