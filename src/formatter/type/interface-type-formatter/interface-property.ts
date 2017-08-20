import {Expression, Statement, TypeElement, TypeNode, Node, isTypeElement, isTypeNode} from "typescript";

export declare type InterfaceProperty = TypeElement & { type: TypeNode };

/**
 * Returns true if the given item is an InterfaceProperty
 * @param {ts.Statement | ts.Expression | Node} item
 * @returns {boolean}
 */
export function isInterfaceProperty (item: Statement|Expression|Node): item is InterfaceProperty {
	return isTypeElement(item) && isTypeNode((<InterfaceProperty>item).type);
}