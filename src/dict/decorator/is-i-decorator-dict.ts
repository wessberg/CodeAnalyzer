import {PredicateArgument} from "../node/i-node-dict";
import {IDecoratorDict} from "./decorator-dict";
import {isTypescriptNode} from "@wessberg/typescript-ast-util";

/**
 * Checks if the provided item is an IDecoratorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIDecoratorDict (item: PredicateArgument): item is IDecoratorDict {
	return !isTypescriptNode(item) && item != null && "kind" in item;
}