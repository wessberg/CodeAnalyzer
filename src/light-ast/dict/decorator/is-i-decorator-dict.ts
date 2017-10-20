import {PredicateArgument} from "../node/i-node-dict";
import {IDecoratorDict} from "./i-decorator-dict";
import {isIDecoratorCtor} from "../../ctor/decorator/is-i-decorator-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an IDecoratorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIDecoratorDict (item: PredicateArgument): item is IDecoratorDict {
	return isIDecoratorCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.DECORATOR;
}