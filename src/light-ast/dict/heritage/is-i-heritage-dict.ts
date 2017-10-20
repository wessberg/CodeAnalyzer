import {PredicateArgument} from "../node/i-node-dict";
import {IHeritageDict} from "./i-heritage-dict";
import {isIHeritageCtor} from "../../ctor/heritage/is-i-heritage-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an IHeritageDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIHeritageDict (item: PredicateArgument): item is IHeritageDict {
	return isIHeritageCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.HERITAGE;
}