import {PredicateArgument} from "../node/i-node-dict";
import {INameWithTypeArguments} from "./i-name-with-type-arguments";
import {isTypescriptNode} from "../typescript-node/is-typescript-node";

/**
 * Checks if the provided item is an INameWithTypeArguments
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINameWithTypeArguments (item: PredicateArgument): item is INameWithTypeArguments {
	return !isTypescriptNode(item) && item != null && "name" in item && "typeArguments" in item;
}