import {PredicateArgument} from "../node/i-node-dict";
import {IClassPropertyDict} from "./i-class-property-dict";
import {isIClassPropertyCtor} from "../../ctor/class-property/is-i-class-property-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an IClassPropertyDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassPropertyDict (item: PredicateArgument): item is IClassPropertyDict {
	return isIClassPropertyCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.CLASS_PROPERTY;
}