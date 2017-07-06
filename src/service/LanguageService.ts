import * as typescript from "typescript";
import {CompilerOptions, IScriptSnapshot, ModuleKind, NodeArray, ScriptTarget, Statement} from "typescript";
import {fileLoader, importFormatter} from "../services";
import {ILanguageService} from "./interface/ILanguageService";

/**
 * A service that parses and reflects on the AST generated by Typescript's language service.
 * With it, we can extract metadata such as initialization values and types, arguments and import
 * declarations.
 * @author Frederik Wessberg
 */
export class LanguageService implements ILanguageService {
	private files: Map<string, { version: number, content: string }> = new Map();
	private languageService: typescript.LanguageService = typescript.createLanguageService(this, typescript.createDocumentRegistry());

	/**
	 * Adds a new file to the LanguageService.
	 * @param {string} fileName
	 * @param {string} content
	 * @returns {NodeArray<Statement>}
	 */
	public addFile (fileName: string, content: string): NodeArray<Statement> {

		const filePath = importFormatter.resolvePath(fileName);
		const normalizedPath = importFormatter.normalizeExtension(filePath);
		const version = this.getFileVersion(normalizedPath) + 1;
		this.files.set(normalizedPath, {version, content});
		return <NodeArray<Statement>>this.getFile(fileName);
	}

	/**
	 * Removes a file from the LanguageService.
	 * @param {string} fileName
	 * @returns {void}
	 */
	public removeFile (fileName: string): void {
		this.files.delete(fileName);
	}

	/**
	 * Parses the given code and returns an array of statements.
	 * @param {string} code
	 * @returns {NodeArray<Statement>}
	 */
	public toAST (code: string): NodeArray<Statement> {
		const temporaryName = `${Math.random() * 100000}.ts`;
		const statements = this.addFile(temporaryName, code);
		this.removeFile(temporaryName);
		return statements;
	}

	/**
	 * Gets the Statements associated with the given filename.
	 * @param {string} fileName
	 * @returns {NodeArray<Statement>}
	 */
	public getFile (fileName: string): NodeArray<Statement>|null {
		const filePath = importFormatter.resolvePath(fileName);
		const normalizedPath = importFormatter.normalizeExtension(filePath);
		let file = this.languageService.getProgram().getSourceFile(normalizedPath);
		if (file == null) {
			if (fileLoader.existsSync(filePath)) {
				try {
					const content = fileLoader.loadSync(filePath).toString();
					return this.addFile(normalizedPath, content);
				} catch (ex) {
					// Most likely, the file was a directory and couldn't be loaded.
					return null;
				}
			}
			return null;
		}
		return file.statements;
	}

	/**
	 * Gets the settings that Typescript will generate an AST from. There isn't much reason to make
	 * anything but the libs developer-facing since we only support ES2015 modules.
	 * @returns {CompilerOptions}
	 */
	public getCompilationSettings (): CompilerOptions {
		return {
			target: ScriptTarget.ES2017,
			module: ModuleKind.ES2015,
			lib: ["es2015.promise", "dom", "es6", "scripthost", "es7", "es2017.object", "es2015.proxy"]
		};
	}

	/**
	 * Gets the names of each file that has been added to the "program".
	 * @returns {string[]}
	 */
	public getScriptFileNames (): string[] {
		return [...this.files.keys()];
	}

	/**
	 * Gets the last version of the given fileName. Each time a file changes, the version number will be updated,
	 * so this can be useful to figure out if the file has changed since the program was run initially.
	 * @param {string} fileName
	 * @returns {string}
	 */
	public getScriptVersion (fileName: string): string {
		const script = this.files.get(fileName);
		if (script == null) return "-1";
		return script.version.toString();
	}

	public getFileVersion (filePath: string): number {
		const version = this.getScriptVersion(filePath);
		return parseInt(version);
	}

	/**
	 * Gets the last registered IScriptSnapshot, if any, otherwise undefined.
	 * @param {string} fileName
	 * @returns {IScriptSnapshot?}
	 */
	public getScriptSnapshot (fileName: string): IScriptSnapshot|undefined {
		const file = this.files.get(fileName);
		if (file == null) return undefined;
		return typescript.ScriptSnapshot.fromString(file.content);
	}

	/**
	 * Gets the current directory.
	 * @returns {string}
	 */
	public getCurrentDirectory (): string {
		return process.cwd();
	}

	/**
	 * Gets the default filepath for Typescript's lib-files.
	 * @param {CompilerOptions} options
	 * @returns {string}
	 */
	public getDefaultLibFileName (options: CompilerOptions): string {
		return typescript.getDefaultLibFilePath(options);
	}
}