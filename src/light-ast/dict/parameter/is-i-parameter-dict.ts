import {PredicateArgument} from "../node/i-node-dict";
import {IParameterDict} from "./i-parameter-dict";
import {isIParameterCtor} from "../../ctor/parameter/is-i-parameter-ctor";
import {isINodeDict} from "../node/is-i-node-dict";

/**
 * Checks if the provided item is an IParameterDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIParameterDict (item: PredicateArgument): item is IParameterDict {
	return isIParameterCtor(item) && isINodeDict(item) && item.nodeKind === "PARAMETER";
}