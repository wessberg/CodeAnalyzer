import {PredicateArgument} from "../node/i-node-dict";
import {IClassDict} from "./i-class-dict";
import {isIClassCtor} from "../../ctor/class/is-i-class-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an IClassDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassDict (item: PredicateArgument): item is IClassDict {
	return isIClassCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.CLASS;
}