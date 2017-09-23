import {PredicateArgument} from "../node/i-node-dict";
import {IParameterDict} from "./parameter-dict";
import {isTypescriptNode} from "../typescript-node/is-typescript-node";

/**
 * Checks if the provided item is an IParameterDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIParameterDict (item: PredicateArgument): item is IParameterDict {
	return !isTypescriptNode(item) && item != null && (
		"kind" in item &&
		"type" in item &&
		"initializer" in item &&
		"isRestSpread" in item &&
		"isOptional" in item &&
		"decorators" in item &&
		"name" in item
	);
}