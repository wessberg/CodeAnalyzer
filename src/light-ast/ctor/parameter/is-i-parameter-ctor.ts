import {IParameterCtor} from "./i-parameter-ctor";
import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IParameterCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIParameterCtor (item: PredicateArgument): item is IParameterCtor {
	return !isTypescriptNode(item) && item != null && (
		"type" in item &&
		"initializer" in item &&
		"isRestSpread" in item &&
		"isOptional" in item &&
		"isReadonly" in item &&
		"decorators" in item &&
		"name" in item
	);
}