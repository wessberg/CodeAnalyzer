import {PredicateArgument} from "../node/i-node-dict";
import {IClassDict} from "./i-class-dict";
import {isTypescriptNode} from "../typescript-node/is-typescript-node";

/**
 * Checks if the provided item is an IClassDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassDict (item: PredicateArgument): item is IClassDict {
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