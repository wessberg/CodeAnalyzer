import {IClassGetAccessorCtor} from "./class-accessor-ctor";
import {isIClassAccessorCtor} from "./is-i-class-accessor-ctor";
import {isIFunctionLikeCtor} from "../function-like/is-i-function-like-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IClassGetAccessorCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassGetAccessorCtor (item: PredicateArgument): item is IClassGetAccessorCtor {
	return isIClassAccessorCtor(item) && isIFunctionLikeCtor(item) && (
		item.kind === "GET"
	);
}