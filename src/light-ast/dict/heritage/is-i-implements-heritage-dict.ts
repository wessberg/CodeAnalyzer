import {PredicateArgument} from "../node/i-node-dict";
import {IImplementsHeritageDict} from "./i-heritage-dict";
import {isINodeDict} from "../node/is-i-node-dict";
import {isIImplementsHeritageCtor} from "../../ctor/heritage/is-i-implements-heritage-ctor";

/**
 * Checks if the provided item is an IImplementsHeritageDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIImplementsHeritageDict (item: PredicateArgument): item is IImplementsHeritageDict {
	return isIImplementsHeritageCtor(item) && isINodeDict(item) && item.nodeKind === "HERITAGE";
}