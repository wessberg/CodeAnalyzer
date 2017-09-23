import {IParseService} from "./i-parse-service";
import {Block, createNodeArray, createSourceFile, isExpressionStatement, isFunctionDeclaration, Node, NodeArray, ScriptTarget, Statement, TypeNode, TypeParameterDeclaration} from "typescript";

export class ParseService implements IParseService {
	/**
	 * The filename to use when generating a SourceFile from an expression
	 * @type {string}
	 */
	private static readonly FILENAME = "file.ts";
	/**
	 * The ScriptTarget to use when generating a SourceFile from an expression
	 * @type {ScriptTarget.ES2017}
	 */
	private static readonly SCRIPT_TARGET = ScriptTarget.ES2017;

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
		// Create a source file to allow the type expression to be parsed from a string
		const sourceFile = createSourceFile(ParseService.FILENAME, expression, ParseService.SCRIPT_TARGET);
		return <NodeArray<T>></*tslint:disable*/any/*tslint:enable*/> createNodeArray(sourceFile.statements.map(statement => isExpressionStatement(statement) ? statement.expression : statement));
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
}