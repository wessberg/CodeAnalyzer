import {PredicateArgument} from "../node/i-node-dict";
import {IClassSetAccessorDict} from "./class-accessor-dict";
import {isIClassAccessorDict} from "./is-i-class-accessor-dict";
import {AccessorKind} from "../accessor/accessor-kind";
import {isIFunctionLikeWithParametersDict} from "../function-like-with-parameters/is-i-function-like-with-parameters-dict";

/**
 * Checks if the provided item is an IClassSetAccessorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassSetAccessorDict (item: PredicateArgument): item is IClassSetAccessorDict {
	return isIClassAccessorDict(item) && isIFunctionLikeWithParametersDict(item) && (
		item.kind === AccessorKind.SET
	);
}