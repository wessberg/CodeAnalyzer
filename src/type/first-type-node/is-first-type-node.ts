import {Statement, Expression, Node, SyntaxKind} from "typescript";
import {FirstTypeNode} from "./first-type-node";

/**
 * Returns true if the given Typescript AST node is a FirstTypeNode
 * @param {ts.Statement | ts.Expression | Node} item
 * @returns {boolean}
 */
export function isFirstTypeNode (item: Statement|Expression|Node): item is FirstTypeNode {
	return item != null && item.kind === SyntaxKind.FirstTypeNode;
}