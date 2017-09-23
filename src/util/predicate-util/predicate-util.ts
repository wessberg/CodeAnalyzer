import {IPredicateUtil} from "./i-predicate-util";
import {Node} from "typescript";

/**
 * A class that helps with predicating values
 */
export class PredicateUtil implements IPredicateUtil {

	/*tslint:disable:no-any*/

	/**
	 * Returns true if the provided item is an object
	 * @param item
	 * @returns {boolean}
	 */
	public isObject (item: any): item is {[key: string]: any} {
		if (item === null) {
			return false;
		}
		return ((typeof item === "function") || (typeof item === "object"));
	}

	/**
	 * Returns true if the provided item is a Node
	 * @param item
	 * @returns {boolean}
	 */
	public isNode (item: any): item is Node {
		return this.isObject(item);
	}
	/*tslint:enable:no-any*/

}