import {PredicateArgument} from "../node/i-node-dict";
import {IExtendsHeritageDict} from "./i-heritage-dict";
import {isIExtendsHeritageCtor} from "../../ctor/heritage/is-i-extends-heritage-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an IExtendsHeritageDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIExtendsHeritageDict (item: PredicateArgument): item is IExtendsHeritageDict {
	return isIExtendsHeritageCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.HERITAGE;
}