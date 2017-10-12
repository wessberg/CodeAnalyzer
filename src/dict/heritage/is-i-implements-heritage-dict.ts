import {PredicateArgument} from "../node/i-node-dict";
import {IImplementsHeritageDict} from "./i-heritage-clause-dict";
import {isIHeritageDict} from "./is-i-heritage-dict";
import {isINameWithTypeArguments} from "../name-with-type-arguments/is-i-name-with-type-arguments";

/**
 * Checks if the provided item is an IImplementsHeritageDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIImplementsHeritageDict (item: PredicateArgument): item is IImplementsHeritageDict {
	return isIHeritageDict(item) && "elements" in (item) && (<IImplementsHeritageDict> item).elements.every(element => isINameWithTypeArguments(element));
}