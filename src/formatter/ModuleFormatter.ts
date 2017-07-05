import {IFileLoader} from "@wessberg/fileloader";
import {dirname, extname, join} from "path";
import {IdentifierMapKind, IModuleDeclaration, NAMESPACE_NAME, NamespacedModuleMap} from "../service/interface/ICodeAnalyzer";
import {Config} from "../static/Config";
import {IStringUtil} from "../util/interface/IStringUtil";
import {IModuleFormatter} from "./interface/IModuleFormatter";
import "querystring";
import {BindingIdentifier} from "../model/BindingIdentifier";
import {isIImportExportBinding, isILiteralValue, isNamespacedModuleMap} from "../predicate/PredicateFunctions";

export abstract class ModuleFormatter implements IModuleFormatter {
	private static readonly RESOLVED_PATHS: Map<string, string> = new Map();
	private static readonly DEFAULT_MODULE_FILEPATH: string = "index.js";
	private static readonly ALLOWED_EXTENSIONS: string[] = [...new Set([...Config.supportedFileExtensions, ".json"])];

	constructor (protected stringUtil: IStringUtil,
							 private fileLoader: IFileLoader) {
	}

	public resolvePath (filePath: string): string {
		const cached = ModuleFormatter.RESOLVED_PATHS.get(filePath);
		if (cached != null) return cached;

		// If the path already ends with an extension, do nothing.
		if (Config.supportedFileExtensions.some(ext => filePath.endsWith(ext) && !filePath.endsWith(".d.ts"))) return filePath;
		const [, path] = this.fileLoader.existsWithFirstMatchedExtensionSync(filePath, Config.supportedFileExtensions);
		const traced = this.traceFullPath(path == null ? `${filePath}${Config.defaultExtension}` : path);
		ModuleFormatter.RESOLVED_PATHS.set(filePath, traced);
		return traced;
	}

	public normalizeExtension (filePath: string): string {
		const extension = extname(filePath);
		return extension === "" ? `${filePath}${Config.defaultExtension}` : `${filePath.slice(0, filePath.lastIndexOf(extension))}${Config.defaultExtension}`;
	}

	protected moduleToNamespacedObjectLiteral (modules: (IModuleDeclaration)[]): NamespacedModuleMap {
		const indexer: NamespacedModuleMap = {
			___kind: IdentifierMapKind.NAMESPACED_MODULE_INDEXER,
			startsAt: Infinity,
			endsAt: Infinity
		};

		modules.forEach(moduleDeclaration => {
			Object.keys(moduleDeclaration.bindings).forEach(key => {
				const binding = moduleDeclaration.bindings[key];

				const isNamespace = binding.name === NAMESPACE_NAME;
				// If it isn't a namespace, just add the key to the object.

				if (!isNamespace) {
					let payload = binding.payload();
					while (isIImportExportBinding(payload)) payload = payload.payload();
					indexer[key] = payload;
				}
				else {
					if (!(moduleDeclaration.source instanceof BindingIdentifier)) {
						const path = moduleDeclaration.source.fullPath();
						// Don't proceed if the namespace refers to this module.
						if (path === moduleDeclaration.filePath) {
							return;
						}
					}
					// Merge the two.
					let payload = binding.payload();
					while (isIImportExportBinding(payload)) payload = payload.payload();
					if (isILiteralValue(payload)) {
						const [value] = payload.value();
						if (isNamespacedModuleMap(value)) {
							Object.keys(value).forEach(key => indexer[key] = (<any>value)[key]);
						}
						;
					}
				}
			});
		});

		Object.defineProperty(indexer, "___kind", {
			value: IdentifierMapKind.NAMESPACED_MODULE_INDEXER,
			enumerable: false
		});

		Object.defineProperty(indexer, "startsAt", {
			value: Infinity,
			enumerable: false
		});

		Object.defineProperty(indexer, "endsAt", {
			value: Infinity,
			enumerable: false
		});
		return indexer;
	}

	protected formatFullPathFromRelative (filePath: string, relativePath: string): string {
		const relativePathStripped = <string>this.stringUtil.stripQuotesIfNecessary(relativePath);
		if (Config.builtIns.has(relativePathStripped)) {
			return relativePathStripped;
		}

		const joined = relativePathStripped.toString() === filePath ? filePath : join(dirname(filePath), relativePathStripped.toString());
		return this.resolvePath(this.stripStartDotFromPath(joined));
	}

	private traceFullPath (filePath: string): string {
		if (this.fileLoader.existsSync(filePath)) return filePath;
		if (this.fileLoader.existsSync(join(__dirname, filePath))) return filePath;

		const nodeModules = this.traceDown("node_modules", filePath);

		// Give up and return the path given as an argument.
		if (nodeModules == null) return filePath;
		const moduleDirectory = this.traceUp(filePath, nodeModules);

		// Give up and return the path given as an argument.
		if (moduleDirectory == null) return filePath;
		const packageJSON = this.traceUp("package.json", moduleDirectory);
		if (packageJSON == null) {
			// The import is to a file, not a module.
			return moduleDirectory;
		}
		const libPath = this.takeLibPathFromPackageJSON(packageJSON) || ModuleFormatter.DEFAULT_MODULE_FILEPATH;

		// Give up and return the path given as an argument.
		if (libPath == null) return filePath;
		return libPath;
	}

	private traceUp (target: string, from: string): string|null {
		let splitted = target.split("/").filter(part => part.length > 0);
		while (true) {
			if (splitted.length === 0) return null;
			const reconstructed = splitted.join("/");
			const joined = join(from, reconstructed);
			const extension = extname(joined);
			const joinedWithoutExtension = extension === "" ? joined : joined.slice(0, joined.lastIndexOf(extension));
			let [matchWithExt, matchedPath] = this.fileLoader.existsWithFirstMatchedExtensionSync(joined, ModuleFormatter.ALLOWED_EXTENSIONS);
			if (matchWithExt) return matchedPath;
			[matchWithExt, matchedPath] = this.fileLoader.existsWithFirstMatchedExtensionSync(joinedWithoutExtension, ModuleFormatter.ALLOWED_EXTENSIONS);
			if (matchWithExt) return matchedPath;

			// It may simply be a directory.
			const matchWithoutExt = this.fileLoader.existsSync(joinedWithoutExtension);
			if (matchWithoutExt) return joinedWithoutExtension;
			splitted.splice(0, 1);
		}
	}

	private traceDown (target: string, current: string = __dirname): string|null {
		let _current = current;
		let targetPath: string|null = null;
		while (_current !== "/") {
			targetPath = join(_current, target);
			const hasTarget = this.fileLoader.existsSync(targetPath);
			if (hasTarget) break;
			_current = join(_current, "../");
			if (_current.includes(("../"))) return null;
		}
		return targetPath;
	}

	private takeLibPathFromPackageJSON (packageJSONPath: string): string|null {
		const json = JSON.parse(this.fileLoader.loadSync(packageJSONPath).toString());
		const fields: string[] = ["browser", "module", "main"];

		for (const field of fields) {
			const value = json[field];
			// The "browser" field may be an object of nested paths. Skip if that is the case.
			if (value != null && typeof value === "string") return join(packageJSONPath, "../", value);
		}

		return null;
	}

	private stripStartDotFromPath (filePath: string): string {
		return filePath.startsWith("./")
			? filePath.slice("./".length)
			: filePath;
	}
}