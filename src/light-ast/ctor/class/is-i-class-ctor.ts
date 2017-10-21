import {IClassCtor} from "./i-class-ctor";
import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IClassCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassCtor (item: PredicateArgument): item is IClassCtor {
	return !isTypescriptNode(item) && item != null && (
		"name" in item &&
		"members" in item &&
		"decorators" in item &&
		"isAbstract" in item &&
		"extendsClass" in item &&
		"implementsInterfaces" in item &&
		"typeParameters" in item
	);
}