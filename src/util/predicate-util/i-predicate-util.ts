import {AmdDependency, ArrayBindingElement, Symbol, BindingPattern, DeclarationName, FileReference, ImportExpression, JSDocNamespaceBody, JSDocNamespaceDeclaration, KeywordTypeNode, ModuleBody, NamespaceBody, NamespaceDeclaration, Node, NullLiteral, PartiallyEmittedExpression, PostfixUnaryExpression, PrefixUnaryExpression, SuperExpression, ThisExpression, BooleanLiteral} from "typescript";
import {NodeMatcherItem} from "../node-matcher-util/node-matcher-item";

export interface IPredicateUtil {
	/*tslint:disable:no-any*/
	isObject (item: any): item is {[key: string]: any};
	isNode (item: any): item is Node;
	/*tslint:enable:no-any*/
	isIterable<T> (item: T|Iterable<T>|undefined|null|{}): item is Iterable<T>;
	isAmdDependency (node: NodeMatcherItem): node is AmdDependency;
	isFileReference (node: NodeMatcherItem): node is FileReference;
	isKeywordTypeNode (node: Node): node is KeywordTypeNode;
	isNullLiteral (node: Node): node is NullLiteral;
	isBooleanLiteral (node: Node): node is BooleanLiteral;
	isThisExpression (node: Node): node is ThisExpression;
	isSuperExpression (node: Node): node is SuperExpression;
	isImportExpression (node: Node): node is ImportExpression;
	isPartiallyEmittedExpression (node: Node): node is PartiallyEmittedExpression;
	isPrefixUnaryExpression (node: Node): node is PrefixUnaryExpression;
	isPostfixUnaryExpression (node: Node): node is PostfixUnaryExpression;
	isArrayBindingElement (node: Node): node is ArrayBindingElement;
	isBindingPattern (node: Node): node is BindingPattern;
	isDeclarationName (node: Node): node is DeclarationName;
	isNamespaceDeclaration (node: Node): node is NamespaceDeclaration;
	isJSDocNamespaceDeclaration (node: Node): node is JSDocNamespaceDeclaration;
	isNamespaceBody (node: Node): node is NamespaceBody;
	isJSDocNamespaceBody (node: Node): node is JSDocNamespaceBody;
	isModuleBody (node: Node): node is ModuleBody;
	hasSymbol<T> (item: T): item is T & {symbol: Symbol};
	hasClassifiableNames<T> (item: T): item is T & {classifiableNames: Map<string, boolean>};
	hasIdentifiers<T> (item: T): item is T & {identifiers: Map<string, string>};
	hasSymbolCount<T> (item: T): item is T & {symbolCount: number};
	hasNodeCount<T> (item: T): item is T & {nodeCount: number};
	hasIdentifierCount<T> (item: T): item is T & {identifierCount: number};
	hasLineMap<T> (item: T): item is T & {lineMap: number[]};
	hasNextContainer<T> (item: T): item is T & {nextContainer: Node};
	hasLocals<T> (item: T): item is T & {locals: Map<string, Symbol>};
}