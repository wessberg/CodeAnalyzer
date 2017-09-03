import {ClassDeclaration, ClassExpression, createNodeArray, NodeArray, SyntaxKind} from "typescript";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IClassService} from "./i-class-service";
import {AstNode} from "../../type/ast-node/ast-node";
import {ClassFormatterGetter} from "../../formatter/expression/class/class-formatter-getter";
import {IFormattedClass} from "@wessberg/type";
import {CacheServiceGetter} from "../cache-service/cache-service-getter";

/**
 * A class that can generate IFormattedClasses
 */
export class ClassService implements IClassService {
	/**
	 * The Set of supported SyntaxKinds
	 * @type {Set<SyntaxKind>}
	 */
	public readonly supportedKinds: Set<SyntaxKind> = new Set([SyntaxKind.ClassExpression, SyntaxKind.ClassDeclaration]);

	/**
	 * A Set of all files that is currently being checked for classes
	 * @type {Set<string>}
	 */
	private readonly filesBeingAnalyzedForClasses: Set<string> = new Set();

	constructor (private astUtil: ITypescriptASTUtil,
							 private languageService: ITypescriptLanguageService,
							 private classFormatter: ClassFormatterGetter,
							 private cacheService: CacheServiceGetter) {
	}

	/**
	 * Returns true if the given file is currently being analyzed for classes
	 * @param {string} file
	 * @returns {boolean}
	 */
	public isGettingClassesForFile (file: string): boolean {
		return this.filesBeingAnalyzedForClasses.has(file);
	}

	/**
	 * Gets all IFormattedClasses for the given file
	 * @param {string} file
	 * @returns {IFormattedClass[]}
	 */
	public getClassesForFile (file: string): IFormattedClass[] {
		// Refresh the classes if required
		if (this.cacheService().cachedClassesNeedsUpdate(file)) {
			// Mark the file as being analyzed
			this.filesBeingAnalyzedForClasses.add(file);

			// Get the classes
			const classes = this.getClassesForStatements(this.languageService.addFile({path: file}));

			// Un-mark the file from being analyzed
			this.filesBeingAnalyzedForClasses.delete(file);

			// Cache and return the classes
			return this.cacheService().setCachedClassesForFile(file, classes);
		}
		// Otherwise, return the cached classes
		else {
			return this.cacheService().getCachedClassesForFile(file)!;
		}
	}

	/**
	 * Gets all IFormattedClass for the given statement
	 * @param {ClassExpression|ClassDeclaration} statement
	 * @returns {IFormattedClass[]}
	 */
	public getClassesForStatement (statement: ClassExpression|ClassDeclaration): IFormattedClass[] {
		return this.getClassesForStatements(createNodeArray([statement]));
	}

	/**
	 * Gets all IFormattedClass for the given Statements
	 * @param {NodeArray<AstNode>} statements
	 * @returns {IFormattedClass[]}
	 */
	public getClassesForStatements (statements: NodeArray<AstNode>): IFormattedClass[] {
		const filtered = this.astUtil.filterStatements<ClassDeclaration|ClassExpression>(statements, this.supportedKinds, true);
		return filtered.map(statement => this.classFormatter().format(statement));
	}
}