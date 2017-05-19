import {IFileLoader} from "@wessberg/fileloader";
import {dirname, extname, join} from "path";
import {IdentifierMapKind, IModuleDeclaration, NAMESPACE_NAME, NamespacedModuleMap} from "../service/interface/ICodeAnalyzer";
import {Config} from "../static/Config";
import {IStringUtil} from "../util/interface/IStringUtil";
import {IModuleFormatter} from "./interface/IModuleFormatter";
import "querystring";
import {IMarshaller} from "@wessberg/marshaller";
import {BindingIdentifier} from "../model/BindingIdentifier";

export abstract class ModuleFormatter implements IModuleFormatter {
	private static readonly RESOLVED_PATHS: Map<string, string> = new Map();

	constructor (protected stringUtil: IStringUtil,
							 private marshaller: IMarshaller,
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
		const indexer: NamespacedModuleMap = {};

		modules.forEach(moduleDeclaration => {
			Object.keys(moduleDeclaration.bindings).forEach(key => {
				const binding = moduleDeclaration.bindings[key];

				const isNamespace = binding.name === NAMESPACE_NAME;
				// If it isn't a namespace, just add the key to the object.
				if (!isNamespace) indexer[key] = binding.payload();
				else {
					if (!(moduleDeclaration.source instanceof BindingIdentifier)) {
						const path = moduleDeclaration.source.fullPath();
						// Don't proceed if the namespace refers to this module.
						if (path === moduleDeclaration.filePath) {
							return;
						}
					}
					// Merge the two.
					let payload = <NamespacedModuleMap>binding.payload();
					if (typeof payload === "string") payload = <NamespacedModuleMap>this.marshaller.marshal(payload, {});
					Object.keys(payload).forEach(key => indexer[key] = payload[key]);
				}
			});
		});

		Object.defineProperty(indexer, "___kind", {
			value: IdentifierMapKind.NAMESPACED_MODULE_INDEXER,
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
		if (nodeModules == null) throw new ReferenceError(`${this.constructor.name} could not trace a module with path: ${filePath}: No 'node_modules' folder were found!`);
		const moduleDirectory = this.traceUp(filePath, nodeModules);
		if (moduleDirectory == null) throw new ReferenceError(`${this.constructor.name} could not trace a module with path: ${filePath}: The module could not be found inside 'node_modules' and it wasn't a relative path!`);
		const packageJSON = this.traceUp("package.json", moduleDirectory);
		if (packageJSON == null) throw new ReferenceError(`${this.constructor.name} could not trace a package.json file inside package: ${moduleDirectory}!`);
		const libPath = this.takeLibPathFromPackageJSON(packageJSON);
		if (libPath == null) throw new ReferenceError(`${this.constructor.name} could not find a "main", "module" or "browser" field inside package.json at path: ${packageJSON}!`);
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
			const matchWithExt = this.fileLoader.existsSync(joined);
			if (matchWithExt) return joined;
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
			if (value != null) return join(packageJSONPath, "../", value);
		}

		return null;
	}
	private stripStartDotFromPath (filePath: string): string {
		return filePath.startsWith("./")
			? filePath.slice("./".length)
			: filePath;
	}
}