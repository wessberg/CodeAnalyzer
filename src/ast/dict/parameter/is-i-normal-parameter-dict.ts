import {PredicateArgument} from "../node/i-node-dict";
import {INormalParameterDict} from "./parameter-dict";
import {ParameterKind} from "./parameter-kind";
import {isIParameterDict} from "./is-i-parameter-dict";

/**
 * Checks if the provided item is an INormalParameterDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINormalParameterDict (item: PredicateArgument): item is INormalParameterDict {
	return isIParameterDict(item) && (
		item.kind === ParameterKind.NORMAL &&
		"name" in item
	);
}