import {dirname, extname, join} from "path";
import {config} from "../static/Config";
import {IModuleFormatter} from "./interface/IModuleFormatter";
import "querystring";
import {BindingIdentifier} from "../model/BindingIdentifier";
import {isIImportExportBinding, isILiteralValue, isNamespacedModuleMap} from "../predicate/PredicateFunctions";
import {fileLoader, identifierUtil, stringUtil} from "../services";
import {IdentifierMapKind, IModuleDeclaration, INamespacedModuleMap, NAMESPACE_NAME} from "../identifier/interface/IIdentifier";

/**
 * An abstract class that helps with formatting and resolving modules.
 */
export abstract class ModuleFormatter implements IModuleFormatter {
	/**
	 * A Map between paths as they are defined in the source code and actual file paths on disk.
	 * For example, oftentimes file extensions are implicit and left out of import statements. This map holds the actual full file paths for any of those paths.
	 * @type {Map<string, string>}
	 */
	private static readonly RESOLVED_PATHS: Map<string, string> = new Map();

	/**
	 * The default (relative) library path in a module (if the main field is left out)
	 * @type {string}
	 */
	private static readonly DEFAULT_MODULE_FILEPATH: string = "index.js";

	/**
	 * The allowed file extensions when resolving files.
	 * @type {Set<string>}
	 */
	private static readonly ALLOWED_EXTENSIONS: string[] = [...new Set([...config.supportedFileExtensions, ".json"])];

	/**
	 * Resolves the full file path for the given path. It may need an extension and it may be a relative path.
	 * @param {string} filePath
	 * @returns {string}
	 */
	public resolvePath (filePath: string): string {
		const cached = ModuleFormatter.RESOLVED_PATHS.get(filePath);
		if (cached != null) return cached;

		// If the path already ends with an extension, do nothing.
		if (config.supportedFileExtensions.some(ext => filePath.endsWith(ext) && !filePath.endsWith(".d.ts"))) return filePath;
		const [, path] = fileLoader.existsWithFirstMatchedExtensionSync(filePath, config.supportedFileExtensions);
		const traced = this.traceFullPath(path == null ? `${filePath}${config.defaultExtension}` : path);
		ModuleFormatter.RESOLVED_PATHS.set(filePath, traced);
		return traced;
	}

	/**
	 * Either adds an extension to the filepath (if it needs one) or replaces the extension with the default.
	 * @param {string} filePath
	 * @returns {string}
	 */
	public normalizeExtension (filePath: string): string {
		const extension = extname(filePath);
		return extension === "" ? `${filePath}${config.defaultExtension}` : `${filePath.slice(0, filePath.lastIndexOf(extension))}${config.defaultExtension}`;
	}

	/**
	 * Returns an INamespacedModuleMap from the given array of IModuleDeclarations
	 * @param {IModuleDeclaration[]} modules
	 * @returns {INamespacedModuleMap}
	 */
	protected moduleToNamespacedObjectLiteral (modules: (IModuleDeclaration)[]): INamespacedModuleMap {
		const indexer: INamespacedModuleMap = identifierUtil.setKind({
			___kind: IdentifierMapKind.NAMESPACED_MODULE_INDEXER,
			startsAt: Infinity,
			endsAt: Infinity
		}, IdentifierMapKind.NAMESPACED_MODULE_INDEXER);

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
							Object.keys(value).forEach(payloadValueKey => indexer[payloadValueKey] = (</*tslint:disable*/any/*tslint:enable*/>value)[payloadValueKey]);
						}
					}
				}
			});
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

	/**
	 * Formats a full path from a relative path (local to the filePath given as the first argument).
	 * @param {string} filePath
	 * @param {string} relativePath
	 * @returns {string}
	 */
	protected formatFullPathFromRelative (filePath: string, relativePath: string): string {
		const relativePathStripped = <string>stringUtil.stripQuotesIfNecessary(relativePath);
		if (config.builtIns.has(relativePathStripped)) {
			return relativePathStripped;
		}

		const joined = relativePathStripped.toString() === filePath ? filePath : join(dirname(filePath), relativePathStripped.toString());
		return this.resolvePath(this.stripStartDotFromPath(joined));
	}

	/**
	 * Traces a full path from the given path. It may be so already, but it may also be relative to the wrong directory and need to be resolved.
	 * @param {string} filePath
	 * @returns {string}
	 */
	private traceFullPath (filePath: string): string {
		if (fileLoader.existsSync(filePath)) return filePath;
		if (fileLoader.existsSync(join(__dirname, filePath))) return filePath;

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
		const packageJSONLibPath = this.takeLibPathFromPackageJSON(packageJSON);
		const libPath = packageJSONLibPath == null ? join(moduleDirectory, ModuleFormatter.DEFAULT_MODULE_FILEPATH) : packageJSONLibPath;

		// Give up and return the path given as an argument.
		if (libPath == null) return filePath;
		return libPath;
	}

	/**
	 * Goes "up" the chain of folders and attempts to reach the target file.
	 * @param {string} target
	 * @param {string} from
	 * @returns {string}
	 */
	private traceUp (target: string, from: string): string|null {
		const splitted = target.split("/").filter(part => part.length > 0);
		while (true) {
			if (splitted.length === 0) return null;
			const reconstructed = splitted.join("/");
			const joined = join(from, reconstructed);
			const extension = extname(joined);
			const joinedWithoutExtension = extension === "" ? joined : joined.slice(0, joined.lastIndexOf(extension));
			let [matchWithExt, matchedPath] = fileLoader.existsWithFirstMatchedExtensionSync(joined, ModuleFormatter.ALLOWED_EXTENSIONS);
			if (matchWithExt) return matchedPath;
			[matchWithExt, matchedPath] = fileLoader.existsWithFirstMatchedExtensionSync(joinedWithoutExtension, ModuleFormatter.ALLOWED_EXTENSIONS);
			if (matchWithExt) return matchedPath;

			// It may simply be a directory.
			const matchWithoutExt = fileLoader.existsSync(joinedWithoutExtension);
			if (matchWithoutExt) return joinedWithoutExtension;
			splitted.splice(0, 1);
		}
	}

	/**
	 * Goes "down" the folder tree and attempts to reach the provided target file.
	 * @param {string} target
	 * @param {string} current
	 * @returns {string}
	 */
	private traceDown (target: string, current: string = __dirname): string|null {
		let _current = current;
		let targetPath: string|null = null;
		while (_current !== "/") {
			targetPath = join(_current, target);
			const hasTarget = fileLoader.existsSync(targetPath);
			if (hasTarget) break;
			_current = join(_current, "../");
			if (_current.includes(("../"))) return null;
		}
		return targetPath;
	}

	/**
	 * Takes the most useful main file path from the provided package.json.
	 * It will always prefer something that uses ES-modules over something that don't.
	 * @param {string} packageJSONPath
	 * @returns {string}
	 */
	private takeLibPathFromPackageJSON (packageJSONPath: string): string|null {
		const json = JSON.parse(fileLoader.loadSync(packageJSONPath).toString());
		const fields: string[] = ["es2015", "module", "js:next", "browser", "main"];

		for (const field of fields) {
			const value = json[field];
			// The "browser" field may be an object of nested paths. Skip if that is the case.
			if (value != null && typeof value === "string") return join(packageJSONPath, "../", value);
		}

		return null;
	}

	/**
	 * Removes the '.' in front of a path (if such one exists in the path)
	 * @param {string} filePath
	 * @returns {string}
	 */
	private stripStartDotFromPath (filePath: string): string {
		return filePath.startsWith("./")
			? filePath.slice("./".length)
			: filePath;
	}
}