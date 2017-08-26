import {isTypeElement, isTypeNode, TypeElement, TypeNode} from "typescript";
import {AstNode} from "../../../type/ast-node";

export declare type InterfaceProperty = TypeElement&{ type: TypeNode };

/**
 * Returns true if the given item is an InterfaceProperty
 * @param {AstNode} item
 * @returns {boolean}
 */
export function isInterfaceProperty (item: AstNode): item is InterfaceProperty {
	return isTypeElement(item) && isTypeNode((<InterfaceProperty>item).type);
}