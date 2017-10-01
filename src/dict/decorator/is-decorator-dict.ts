import {PredicateArgument} from "../node/i-node-dict";
import {DecoratorDict} from "./decorator-dict";
import {isIIdentifierDecoratorDict} from "./is-i-identifier-decorator-dict";
import {isIExpressionDecoratorDict} from "./is-i-expression-decorator-dict";

/**
 * Checks if the provided item is an DecoratorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isDecoratorDict (item: PredicateArgument): item is DecoratorDict {
	return isIIdentifierDecoratorDict(item) || isIExpressionDecoratorDict(item);
}