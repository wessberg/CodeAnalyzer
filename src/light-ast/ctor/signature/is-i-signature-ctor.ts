import {ISignatureCtor} from "./i-signature-ctor";
import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an ISignatureCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isISignatureCtor (item: PredicateArgument): item is ISignatureCtor {
	return !isTypescriptNode(item) && item != null && (
		"name" in item &&
		"type" in item &&
		"parameters" in item &&
		"typeParameters" in item
	);
}