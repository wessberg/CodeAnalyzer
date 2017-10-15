import {INodeService} from "./i-node-service";
import {Decorator, Node, NodeArray, SourceFile, SyntaxKind} from "typescript";
import {DecoratorDict} from "../../dict/decorator/decorator-dict";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {IRemover} from "../../remover/i-remover-base";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";

/**
 * An abstract Service for working with Nodes
 */
export abstract class NodeService <T extends Node> implements INodeService<T> {
	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected abstract readonly ALLOWED_KINDS: Iterable<SyntaxKind>;

	constructor (protected decoratorService: IDecoratorService,
							 protected remover: IRemover,
							 protected astUtil: ITypescriptASTUtil) {}

	/**
	 * Gets all ClassDeclarations and ClassExpressions for the provided SourceFile
	 * @template T
	 * @param {SourceFile} sourceFile
	 * @param {boolean} [deep]
	 * @returns {NodeArray<T>}
	 */
	public getAll (sourceFile: SourceFile, deep?: boolean): NodeArray<T> {
		return this.astUtil.getFilteredStatements(sourceFile.statements, this.ALLOWED_KINDS, deep);
	}

	/**
	 * Returns true if the node has a decorator matching the provided one
	 * @template T
	 * @param {string | DecoratorDict | RegExp} decorator
	 * @param {T} node
	 * @returns {boolean}
	 */
	public hasDecorator (decorator: string|DecoratorDict|RegExp, node: T): boolean {
		return this.decoratorService.hasDecoratorWithExpression(decorator, node);
	}

	/**
	 * Removes all matching decorators from the node. If a second argument isn't provided, all decorators will be removed.
	 * @template T
	 * @param {T} node
	 * @param {(string | DecoratorDict | RegExp)[]} decorators
	 * @returns {boolean}
	 */
	public removeDecorators (node: T, decorators?: (string|DecoratorDict|RegExp)[]): boolean {

		return this.remover.removeDecorators(
			node,
			decorators == null
				// Remove all decorators if none are provided
				? undefined
				// Otherwise, take all matching Decorator Nodes and filter out undefined values
				: <Decorator[]> decorators
					.map(decorator => this.decoratorService.getDecoratorWithExpression(decorator, node))
					.filter(decorator => decorator != null)
		);
	}

	/**
	 * Removes the provided decorator from the MethodDeclaration, if it has it
	 * @template T
	 * @param {string | DecoratorDict | RegExp} decorator
	 * @param {T} node
	 * @returns {boolean}
	 */
	public removeDecorator (decorator: string|DecoratorDict|RegExp, node: T): boolean {
		return this.removeDecorators(node, [decorator]);
	}
}