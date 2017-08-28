import {ClassDeclaration, ClassExpression, createNodeArray, NodeArray, SyntaxKind} from "typescript";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IClassService} from "./i-class-service";
import {AstNode} from "../../type/ast-node/ast-node";
import {ClassFormatterGetter} from "../../formatter/expression/class/class-formatter-getter";
import {IFormattedClass} from "@wessberg/type";

/**
 * A class that can generate IFormattedClasses
 */
export class ClassService implements IClassService {
	/**
	 * The Set of supported SyntaxKinds
	 * @type {Set<SyntaxKind>}
	 */
	public readonly supportedKinds: Set<SyntaxKind> = new Set([SyntaxKind.ClassExpression, SyntaxKind.ClassDeclaration]);

	constructor (private astUtil: ITypescriptASTUtil,
							 private languageService: ITypescriptLanguageService,
							 private classFormatter: ClassFormatterGetter) {
	}

	/**
	 * Gets all IFormattedClasses for the given file
	 * @param {string} file
	 * @returns {IFormattedClass[]}
	 */
	public getClassesForFile (file: string): IFormattedClass[] {
		return this.getClassesForStatements(this.languageService.addFile({path: file}));
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