import {PredicateArgument} from "../node/i-node-dict";
import {IObjectBindingParameterDict} from "./parameter-dict";
import {ParameterKind} from "./parameter-kind";
import {isIParameterDict} from "./is-i-parameter-dict";
import {isIObjectBindingNameDict} from "../binding-name/is-i-object-binding-name-dict";

/**
 * Checks if the provided item is an IObjectBindingParameterDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIObjectBindingParameterDict (item: PredicateArgument): item is IObjectBindingParameterDict {
	return isIParameterDict(item) && (
		item.kind === ParameterKind.OBJECT_BINDING &&
		"name" in item &&
		isIObjectBindingNameDict(item.kind)
	);
}