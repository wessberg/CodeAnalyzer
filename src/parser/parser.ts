import {IParser} from "./i-parser";
import {Block, createNodeArray, createSourceFile, Expression, isExpressionStatement, isFunctionDeclaration, Node, NodeArray, ReturnStatement, ScriptTarget, Statement, TypeNode, TypeParameterDeclaration} from "typescript";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";

/**
 * A class that helps with parsing string expressions into proper Nodes
 */
export class Parser implements IParser {
	/**
	 * The filename to use when generating a SourceFile from an expression
	 * @type {string}
	 */
	private static readonly FILENAME = "file.ts";
	/**
	 * The ScriptTarget to use when generating a SourceFile from an expression
	 * @type {ScriptTarget.ES2017}
	 */
	private static readonly SCRIPT_TARGET = ScriptTarget.Latest;

	constructor (private readonly astUtil: ITypescriptASTUtil) {
	}

	/**
	 * Parses the provided expression string into an Expression
	 * @param {string} expression
	 * @returns {Expression}
	 */
	public parseExpression (expression: string): Expression {
		// Create a source file to allow the type expression to be parsed from a string
		const firstStatement = this.parseOne(this.getTestExpressionFunction(expression));

		if (!isFunctionDeclaration(firstStatement)) {
			throw new TypeError(`${this.constructor.name} had an internal error`);
		}

		// Take the type of the generated source file (which will be equal to the given type expression)
		const returnStatement = <ReturnStatement> firstStatement.body!.statements[0];
		return returnStatement.expression!;
	}

	/**
	 * Parses a Statement
	 * @param {string} statement
	 * @returns {Statement}
	 */
	public parseStatement (statement: string): Statement {
		return this.parseOne(statement);
	}

	/**
	 * Parses the provided string into a Block
	 * @param {string} block
	 * @returns {Block}
	 */
	public parseBlock (block: string): Block {
		// Create a source file to allow the type expression to be parsed from a string
		const firstStatement = this.parseOne(this.getTestBlockFunction(block));

		if (!isFunctionDeclaration(firstStatement)) {
			throw new TypeError(`${this.constructor.name} had an internal error`);
		}

		// Take the type of the generated source file (which will be equal to the given type expression)
		return firstStatement.body!;
	}

	/**
	 * Parses the provided expression statement into a Node
	 * @param {string} expression
	 * @returns {T}
	 */
	public parseOne<T extends Node = Node> (expression: string): T {
		const [firstStatement] = this.parse<T>(expression);
		return firstStatement;
	}

	/**
	 * Parses the provided expression into a NodeArray of Statements
	 * @template T
	 * @param {string} expression
	 * @returns {NodeArray<T>}
	 */
	public parse<T extends Node = Statement> (expression: string): NodeArray<T> {
		/*tslint:disable:no-any*/
		// Create a source file to allow the type expression to be parsed from a string
		const sourceFile = createSourceFile(Parser.FILENAME, expression, Parser.SCRIPT_TARGET);
		return <NodeArray<T>><any> createNodeArray(sourceFile.statements.map(statement => this.astUtil.clearPositions(isExpressionStatement(statement) ? statement.expression : statement)));
		/*tslint:enable:no-any*/
	}

	/**
	 * Parses a type into a TypeNode
	 * @param {string} type
	 * @returns {ts.TypeNode}
	 */
	public parseType (type: string): TypeNode {
		// Create a source file to allow the type expression to be parsed from a string
		const firstStatement = this.parseOne(this.getTestTypeFunctionSignature(type));

		if (!isFunctionDeclaration(firstStatement)) {
			throw new TypeError(`${this.constructor.name} had an internal error`);
		}

		// Take the type of the generated source file (which will be equal to the given type expression)
		return firstStatement.type!;
	}

	/**
	 * Parses a TypeParameterDe
	 * @param {string} type
	 * @returns {TypeParameterDeclaration}
	 */
	public parseTypeParameterDeclaration (type: string): TypeParameterDeclaration {
		// Create a source file to allow the type expression to be parsed from a string
		const firstStatement = this.parseOne(this.getTestTypeParameterDeclarationFunctionSignature(type));

		if (!isFunctionDeclaration(firstStatement)) {
			throw new TypeError(`${this.constructor.name} had an internal error`);
		}

		// Take the type of the generated source file (which will be equal to the given type expression)
		const [typeParameter] = firstStatement.typeParameters!;

		// Return a copy of the TypeParameterDeclaration
		return typeParameter;
	}

	/**
	 * Gets a test function signature. Needed to make Typescripts parser generate Type-specific nodes
	 * @param {string} type
	 * @returns {string}
	 */
	private getTestTypeFunctionSignature (type: string): string {
		return `function foo (): ${type} {}`;
	}

	/**
	 * Gets a test function signature for type parameters. Needed to make Typescripts parser generate Type-specific nodes
	 * @param {string} typeParameter
	 * @returns {string}
	 */
	private getTestTypeParameterDeclarationFunctionSignature (typeParameter: string): string {
		return `function<${typeParameter}> foo (): void {}`;
	}

	/**
	 * Gets a test function with a function body equal to the provided block
	 * @param {string} block
	 * @returns {string}
	 */
	private getTestBlockFunction (block: string): string {
		return `function foo () {${block}}`;
	}

	/**
	 * Gets a test function which can return an expression block
	 * @param {string} expression
	 * @returns {string}
	 */
	private getTestExpressionFunction (expression: string): string {
		return `function bar () {return ${expression}}`;
	}
}