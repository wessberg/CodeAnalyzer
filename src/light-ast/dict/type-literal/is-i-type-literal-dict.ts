import {PredicateArgument} from "../node/i-node-dict";
import {ITypeLiteralDict} from "./i-type-literal-dict";
import {isITypeLiteralCtor} from "../../ctor/type-literal/is-i-type-literal-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an ITypeLiteralDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isITypeLiteralDict (item: PredicateArgument): item is ITypeLiteralDict {
	return isITypeLiteralCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.TYPE_LITERAL;
}