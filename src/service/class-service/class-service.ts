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
		const pathInfo = this.languageService.getPathInfo(file);
		const statements = this.languageService.addFile(pathInfo);

		// If classes are currently being analyzed for the file, return an empty array
		if (this.isGettingClassesForFile(pathInfo.normalizedPath)) return [];

		// Refresh the classes if required
		if (this.cacheService().cachedClassesNeedsUpdate(pathInfo.normalizedPath)) {
			// Mark the file as being analyzed
			this.filesBeingAnalyzedForClasses.add(pathInfo.normalizedPath);

			// Get the classes
			const classes = this.getClassesForStatements(statements);

			// Un-mark the file from being analyzed
			this.filesBeingAnalyzedForClasses.delete(pathInfo.normalizedPath);

			// Cache and return the classes
			return this.cacheService().setCachedClassesForFile(pathInfo.normalizedPath, classes);
		}
		// Otherwise, return the cached classes
		else {
			return this.cacheService().getCachedClassesForFile(pathInfo.normalizedPath)!;
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
		const expressions: IFormattedClass[] = [];
		const formatter = this.classFormatter();
		this.astUtil.filterStatements<ClassDeclaration|ClassExpression>(expression => expressions.push(formatter.format(expression)), statements, this.supportedKinds, true);
		return expressions;
	}
}