import {IFileLoader} from "@wessberg/fileloader";
import {dirname, join} from "path";
import {IModuleDeclaration, NamespacedModuleMap} from "../service/interface/ISimpleLanguageService";
import {Config} from "../static/Config";
import {IStringUtil} from "../util/interface/IStringUtil";
import {IModuleFormatter} from "./interface/IModuleFormatter";

export abstract class ModuleFormatter implements IModuleFormatter {

	constructor (protected stringUtil: IStringUtil, private fileLoader: IFileLoader) {}

	public addExtensionToPath (filePath: string): string {
		// If the path already ends with an extension, do nothing.
		if (Config.supportedFileExtensions.some(ext => filePath.endsWith(ext))) return filePath;
		const [, path] = this.fileLoader.existsWithFirstMatchedExtensionSync(filePath, Config.supportedFileExtensions);
		return path == null ? `${filePath}${Config.defaultExtension}` : path;
	}

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
		return this.addExtensionToPath(this.stripStartDotFromPath(
			join(dirname(filePath), relativePathStripped.toString())));
	}

	private stripStartDotFromPath (filePath: string): string {
		return filePath.startsWith("./")
			? filePath.slice("./".length)
			: filePath;
	}
}