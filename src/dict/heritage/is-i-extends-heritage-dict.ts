import {PredicateArgument} from "../node/i-node-dict";
import {isIHeritageDict} from "./is-i-heritage-dict";
import {IExtendsHeritageDict} from "./i-heritage-clause-dict";
import {isINameWithTypeArguments} from "../name-with-type-arguments/is-i-name-with-type-arguments";

/**
 * Checks if the provided item is an IExtendsHeritageDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIExtendsHeritageDict (item: PredicateArgument): item is IExtendsHeritageDict {
	return isIHeritageDict(item) && isINameWithTypeArguments(item);
}