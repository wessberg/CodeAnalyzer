import {ClassElementCtor} from "./class-element-ctor";
import {isClassAccessorCtor} from "../class-accessor/is-class-accessor-ctor";
import {isIClassPropertyCtor} from "../class-property/is-i-class-property-ctor";
import {isIClassMethodCtor} from "../class-method/is-i-class-method-ctor";
import {isIConstructorCtor} from "../constructor/is-i-constructor-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IConstructorCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isClassElementCtor (item: PredicateArgument): item is ClassElementCtor {
	return isClassAccessorCtor(item) || isIClassPropertyCtor(item) || isIClassMethodCtor(item) || isIConstructorCtor(item);
}