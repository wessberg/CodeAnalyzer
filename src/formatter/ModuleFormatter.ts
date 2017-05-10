import {dirname, join} from "path";
import {IModuleDeclaration, NamespacedModuleMap} from "../service/interface/ISimpleLanguageService";
import {IModuleFormatter} from "./interface/IModuleFormatter";
import {IStringUtil} from "../util/interface/IStringUtil";

export abstract class ModuleFormatter implements IModuleFormatter {

	constructor (protected stringUtil: IStringUtil) {}

	protected moduleToNamespacedObjectLiteral (modules: (IModuleDeclaration)[]): NamespacedModuleMap {
		const indexer: NamespacedModuleMap = {};

		modules.forEach(moduleDeclaration => {
			Object.keys(moduleDeclaration.bindings).forEach(key => {
				const binding = moduleDeclaration.bindings[key];
				indexer[key] = binding.payload;
			});
		});

		return indexer;
	}

	protected formatFullPathFromRelative (filePath: string, relativePath: string): string {
		const relativePathStripped = <string>this.stringUtil.stripQuotesIfNecessary(relativePath);

		// TODO: Check if the relativePath is in fact an absolute path.
		// TODO: Add file-extension, otherwise Typescript won't add the file!
		return this.stripStartDotFromPath(
			join(dirname(filePath), relativePathStripped.toString()));
	}

	private stripStartDotFromPath (filePath: string): string {
		return filePath.startsWith("./")
			? filePath.slice("./".length)
			: filePath;
	}
}