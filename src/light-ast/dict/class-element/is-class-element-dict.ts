import {PredicateArgument} from "../node/i-node-dict";
import {ClassElementDict} from "./class-element-dict";
import {isClassAccessorDict} from "../class-accessor/is-class-accessor-dict";
import {isIClassPropertyDict} from "../class-property/is-i-class-property-dict";
import {isIClassMethodDict} from "../class-method/is-i-class-method-dict";
import {isIConstructorDict} from "../constructor/is-i-constructor-dict";

/**
 * Checks if the provided item is an IConstructorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isClassElementDict (item: PredicateArgument): item is ClassElementDict {
	return isClassAccessorDict(item) || isIClassPropertyDict(item) || isIClassMethodDict(item) || isIConstructorDict(item);
}