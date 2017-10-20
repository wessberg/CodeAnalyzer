import {IDecoratorCtor} from "./i-decorator-ctor";
import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IDecoratorCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIDecoratorCtor (item: PredicateArgument): item is IDecoratorCtor {
	return !isTypescriptNode(item) && item != null && "expression" in item;
}