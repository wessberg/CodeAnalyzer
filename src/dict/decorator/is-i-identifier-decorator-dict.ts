import {PredicateArgument} from "../node/i-node-dict";
import {IIdentifierDecoratorDict} from "./decorator-dict";
import {isIDecoratorDict} from "./is-i-decorator-dict";
import {DecoratorKind} from "./decorator-kind";

/**
 * Checks if the provided item is an IIdentifierDecoratorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIIdentifierDecoratorDict (item: PredicateArgument): item is IIdentifierDecoratorDict {
	return isIDecoratorDict(item) && (
		item.kind === DecoratorKind.IDENTIFIER &&
		"name" in item
	);
}