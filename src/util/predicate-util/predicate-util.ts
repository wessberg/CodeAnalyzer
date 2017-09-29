import {IPredicateUtil} from "./i-predicate-util";
import {AmdDependency, ArrayBindingElement, Symbol, BindingPattern, DeclarationName, FileReference, ImportExpression, isArrayBindingPattern, isBindingElement, isComputedPropertyName, isIdentifier, isModuleBlock, isModuleDeclaration, isNumericLiteral, isObjectBindingPattern, isOmittedExpression, isStringLiteral, JSDocNamespaceBody, JSDocNamespaceDeclaration, KeywordTypeNode, ModuleBody, NamespaceBody, NamespaceDeclaration, Node, NullLiteral, PartiallyEmittedExpression, PostfixUnaryExpression, PrefixUnaryExpression, SuperExpression, SyntaxKind, ThisExpression, BooleanLiteral} from "typescript";
import {NodeMatcherItem} from "../node-matcher-util/node-matcher-item";

/**
 * A class that helps with predicating values
 */
export class PredicateUtil implements IPredicateUtil {

	/*tslint:disable:no-any*/

	/**
	 * Checks if something is an Iterable
	 * @param item
	 * @returns {boolean}
	 */
	public isIterable<T> (item: T|Iterable<T>|undefined|null|{}): item is Iterable<T> {
		if (item == null) return false;
		return typeof (<Iterable<T>>item)[Symbol.iterator] === "function";
	}

	/**
	 * Returns true if the provided item is an object
	 * @param item
	 * @returns {boolean}
	 */
	public isObject (item: any): item is {[key: string]: any} {
		if (item === null) {
			return false;
		}
		return ((typeof item === "function") || (typeof item === "object"));
	}

	/**
	 * Returns true if the provided item is a Node
	 * @param item
	 * @returns {boolean}
	 */
	public isNode (item: any): item is Node {
		return this.isObject(item);
	}

	/*tslint:enable:no-any*/

	/**
	 * Returns true if the provided node is an AmdDependency
	 * @param {NodeMatcherItem} node
	 * @returns {boolean}
	 */
	public isAmdDependency (node: NodeMatcherItem): node is AmdDependency {
		return node != null && "path" in node && "name" in node;
	}

	/**
	 * Returns true if the provided node is a FileReference
	 * @param {FileReference} node
	 * @returns {boolean}
	 */
	public isFileReference (node: NodeMatcherItem): node is FileReference {
		return node != null && "pos" in node && "end" in node && "fileName" in node;
	}

	/**
	 * Returns true if a node a KeywordTypeNode
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isKeywordTypeNode (node: Node): node is KeywordTypeNode {
		const {kind} = node;
		switch (kind) {
			case SyntaxKind.AnyKeyword:
			case SyntaxKind.NumberKeyword:
			case SyntaxKind.ObjectKeyword:
			case SyntaxKind.BooleanKeyword:
			case SyntaxKind.StringKeyword:
			case SyntaxKind.SymbolKeyword:
			case SyntaxKind.ThisKeyword:
			case SyntaxKind.VoidKeyword:
			case SyntaxKind.UndefinedKeyword:
			case SyntaxKind.NullKeyword:
			case SyntaxKind.NeverKeyword:
				return true;
			default:
				return false;
		}
	}

	/**
	 * Returns true if the provided Node is a NullLiteral
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isNullLiteral (node: Node): node is NullLiteral {
		return node != null && node.kind === SyntaxKind.NullKeyword;
	}

	/**
	 * Returns true if the provided Node is a BooleanLiteral
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isBooleanLiteral (node: Node): node is BooleanLiteral {
		return node != null && (node.kind === SyntaxKind.TrueKeyword || node.kind === SyntaxKind.FalseKeyword);
	}

	/**
	 * Returns true if the provided Node is a ThisExpression
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isThisExpression (node: Node): node is ThisExpression {
		return node != null && node.kind === SyntaxKind.ThisKeyword;
	}

	/**
	 * Returns true if the provided Node is a SuperExpression
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isSuperExpression (node: Node): node is SuperExpression {
		return node != null && node.kind === SyntaxKind.SuperKeyword;
	}

	/**
	 * Returns true if the provided Node is a ImportExpression
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isImportExpression (node: Node): node is ImportExpression {
		return node != null && node.kind === SyntaxKind.ImportKeyword;
	}

	/**
	 * Returns true if the provided Node is a PartiallyEmittedExpression
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isPartiallyEmittedExpression (node: Node): node is PartiallyEmittedExpression {
		return node != null && node.kind === SyntaxKind.PartiallyEmittedExpression;
	}

	/**
	 * Returns true if the provided Node is a PrefixUnaryExpression
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isPrefixUnaryExpression (node: Node): node is PrefixUnaryExpression {
		return node != null && node.kind === SyntaxKind.PrefixUnaryExpression;
	}

	/**
	 * Returns true if the provided Node is a PostfixUnaryExpression
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isPostfixUnaryExpression (node: Node): node is PostfixUnaryExpression {
		return node != null && node.kind === SyntaxKind.PostfixUnaryExpression;
	}

	/**
	 * Returns true if the provided node is an ArrayBindingElement
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isArrayBindingElement (node: Node): node is ArrayBindingElement {
		return isBindingElement(node) || isOmittedExpression(node);
	}

	/**
	 * Returns true if the provided Node is a BindingPattern
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isBindingPattern (node: Node): node is BindingPattern {
		return isObjectBindingPattern(node) || isArrayBindingPattern(node);
	}

	/**
	 * Returns true if the provided node is a DeclarationName
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isDeclarationName (node: Node): node is DeclarationName {
		return isIdentifier(node) || isStringLiteral(node) || isNumericLiteral(node) || isComputedPropertyName(node) || this.isBindingPattern(node);
	}

	/**
	 * Returns true if the provided Node is a NamespaceDeclaration
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isNamespaceDeclaration (node: Node): node is NamespaceDeclaration {
		return isModuleDeclaration(node);
	}

	/**
	 * Returns true if the provided Node is a JSDocNamespaceDeclaration
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isJSDocNamespaceDeclaration (node: Node): node is JSDocNamespaceDeclaration {
		return isModuleDeclaration(node);
	}

	/**
	 * Returns true if the provided Node is a NamespaceBody
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isNamespaceBody (node: Node): node is NamespaceBody {
		return isModuleBlock(node) || this.isNamespaceDeclaration(node);
	}

	/**
	 * Returns true if the provided Node is a NamespaceBody
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isJSDocNamespaceBody (node: Node): node is JSDocNamespaceBody {
		return isIdentifier(node) || isModuleDeclaration(node);
	}

	/**
	 * Returns true if the provided Node is a ModuleBody
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isModuleBody (node: Node): node is ModuleBody {
		return this.isNamespaceBody(node) || this.isJSDocNamespaceBody(node);
	}

	/**
	 * Returns true if the provided item is an item with a Symbol property
	 * @param item
	 * @returns {boolean}
	 */
	public hasSymbol<T> (item: T): item is T & {symbol: Symbol} {
		return item != null && "symbol" in item;
	}

	/**
	 * Returns true if the provided item is an item with a 'classifiableNames' property
	 * @param item
	 * @returns {boolean}
	 */
	public hasClassifiableNames<T> (item: T): item is T & {classifiableNames: Map<string, boolean>} {
		return item != null && "classifiableNames" in item;
	}

	/**
	 * Returns true if the provided item is an item with a 'identifiers' property
	 * @param item
	 * @returns {boolean}
	 */
	public hasIdentifiers<T> (item: T): item is T & {identifiers: Map<string, string>} {
		return item != null && "identifiers" in item;
	}

	/**
	 * Returns true if the provided item is an item with a 'symbolCount' property
	 * @param item
	 * @returns {boolean}
	 */
	public hasSymbolCount<T> (item: T): item is T & {symbolCount: number} {
		return item != null && "symbolCount" in item;
	}

	/**
	 * Returns true if the provided item is an item with a 'nodeCount' property
	 * @param item
	 * @returns {boolean}
	 */
	public hasNodeCount<T> (item: T): item is T & {nodeCount: number} {
		return item != null && "nodeCount" in item;
	}

	/**
	 * Returns true if the provided item is an item with a 'identifierCount' property
	 * @param item
	 * @returns {boolean}
	 */
	public hasIdentifierCount<T> (item: T): item is T & {identifierCount: number} {
		return item != null && "identifierCount" in item;
	}

	/**
	 * Returns true if the provided item is an item with a 'lineMap' property
	 * @param item
	 * @returns {boolean}
	 */
	public hasLineMap<T> (item: T): item is T & {lineMap: number[]} {
		return item != null && "lineMap" in item;
	}

	/**
	 * Returns true if the provided item is an item with a 'nextContainer' property
	 * @param item
	 * @returns {boolean}
	 */
	public hasNextContainer<T> (item: T): item is T & {nextContainer: Node} {
		return item != null && "nextContainer" in item;
	}

	/**
	 * Returns true if the provided item is an item with a 'locals' property
	 * @param item
	 * @returns {boolean}
	 */
	public hasLocals<T> (item: T): item is T & {locals: Map<string, Symbol>} {
		return item != null && "locals" in item;
	}

}