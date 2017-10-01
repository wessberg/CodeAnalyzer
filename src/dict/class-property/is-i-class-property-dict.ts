import {PredicateArgument} from "../node/i-node-dict";
import {IClassPropertyDict} from "./i-class-property-dict";
import {isTypescriptNode} from "../typescript-node/is-typescript-node";

/**
 * Checks if the provided item is an IClassPropertyDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassPropertyDict (item: PredicateArgument): item is IClassPropertyDict {
	return !isTypescriptNode(item) && item != null && (
		"name" in item &&
		"decorators" in item &&
		"type" in item &&
		"initializer" in item &&
		"isAbstract" in item &&
		"isReadonly" in item &&
		"isOptional" in item &&
		"isAsync" in item &&
		"isStatic" in item &&
		"visibility" in item
	);
}