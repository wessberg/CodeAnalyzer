import {IClassPropertyCtor} from "./i-class-property-ctor";
import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IClassPropertyCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassPropertyCtor (item: PredicateArgument): item is IClassPropertyCtor {
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