import {IGetAccessorCtor} from "./accessor-ctor";
import {isIAccessorCtor} from "./is-i-accessor-ctor";
import {isIFunctionLikeCtor} from "../function-like/is-i-function-like-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";
import {AccessorKind} from "../../dict/accessor/accessor-kind";

/**
 * Checks if the provided item is an IGetAccessorCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIGetAccessorCtor (item: PredicateArgument): item is IGetAccessorCtor {
	return isIAccessorCtor(item) && isIFunctionLikeCtor(item) && (
		item.kind === AccessorKind.GET
	);
}