import {PredicateArgument} from "../node/i-node-dict";
import {IExpressionDecoratorDict} from "./decorator-dict";
import {isIDecoratorDict} from "./is-i-decorator-dict";
import {DecoratorKind} from "./decorator-kind";

/**
 * Checks if the provided item is an IExpressionDecoratorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIExpressionDecoratorDict (item: PredicateArgument): item is IExpressionDecoratorDict {
	return isIDecoratorDict(item) && (
		item.kind === DecoratorKind.EXPRESSION &&
		"expression" in item
	);
}