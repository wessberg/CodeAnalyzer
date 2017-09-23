import {IDiffUtil} from "./i-diff-util";
import {IPredicateUtil} from "../predicate-util/i-predicate-util";

/*tslint:disable:no-any*/

/**
 * A class that helps with computing the difference between objects
 * The difference is an accumulated value. The greater it is, the greater the difference
 */
export class DiffUtil implements IDiffUtil {
	/**
	 * The maximum diff amount before assuming that an entry exceeds the bounds of a provided array
	 * @type {number}
	 */
	private static readonly DIFF_LIMIT = 1;

	constructor (private predicateUtil: IPredicateUtil) {
	}

	public takeDiff (a: any, b: any, seenNodes: Set<any> = new Set()): number {

		// If the types is not equal, return 1
		if (typeof a !== typeof b) return 1;

		const type = typeof a;
		const isPrimitive = a == null || type === "string" || type === "number" || type === "symbol" || type === "boolean";

		// If it is a primitive value, return 1 if they aren't strictly equal to each other.
		if (isPrimitive) {
			return a === b ? 0 : 1;
		}

		// If the prototypes of a and b are different, return 1
		if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
			return 1;
		}

		// If the items are Regular Expressions or functions, return 1 if the string representations are different
		if (a instanceof RegExp || typeof a === "function") {
			return a.toString() === b.toString() ? 0 : 1;
		}

		if (a instanceof Map || a instanceof Set) {
			// Check if it has already been calculated (to escape circular dependencies)
			if (seenNodes.has(a)) return 0;

			let result: number = 0;

			// Return 1 if the sizes are of different length
			if (a.size !== b.size) result = 1;
			else {
				const aKeys = Array.from(a.keys());
				const bKeys = Array.from(b.keys());
				seenNodes.add(a);
				result = this.takeDiff(aKeys, bKeys, seenNodes);
			}
			return result;
		}

		// If they are WeakMaps or WeakSets, assume they are identical
		if (a instanceof WeakMap || a instanceof WeakSet) {
			return 0;
		}

		if (Array.isArray(a)) {
			// Check if it has already been calculated (to escape circular dependencies)
			if (seenNodes.has(a)) return 0;

			let result: number = 0;
			// Return 1 if the arrays are of different length
			if (a.length !== b.length) result = 1;
			else {
				seenNodes.add(a);
				a.forEach((part, index) => result += this.takeDiff(part, b[index], seenNodes));
			}
			return result;
		}

		if (this.predicateUtil.isObject(a)) {
			// Check if it has already been calculated (to escape circular dependencies)
			if (seenNodes.has(a)) return 0;

			let result: number = 0;
			const aKeys = Object.keys(a);
			// Return 1 if the amount of keys are different
			if (aKeys.length !== Object.keys(b).length) result = 1;
			else {
				seenNodes.add(a);
				aKeys.forEach(key => result += this.takeDiff(a[key], b[key], seenNodes));
			}
			return result;
		}

		// Fallback to referential equality
		return a === b ? 0 : 1;
	}

	/**
	 * Finds the array index that is closest to the given part
	 * @param {*} part
	 * @param {number} existingLength
	 * @param {*[]} b
	 * @returns {number}
	 */
	public findClosestMatchingIndexInArray (part: any, existingLength: number, b: any[]): number {
		let candidateIndex = -1;
		let candidateDiff = Infinity;
		for (let i = 0; i < b.length; i++) {
			const item = b[i];
			// Skip if only one of them is a Node
			if (this.predicateUtil.isNode(part) && !this.predicateUtil.isNode(item)) continue;

			// Skip if the kinds are not the same
			if (this.predicateUtil.isNode(part) && this.predicateUtil.isNode(item) && part.kind !== item.kind) continue;
			const diff = this.takeDiff(part, item);
			if (diff < candidateDiff) {
				candidateDiff = diff;
				candidateIndex = i;
			}
		}
		const isSameLength = existingLength === b.length;
		if (isSameLength) return candidateIndex;
		return candidateDiff <= DiffUtil.DIFF_LIMIT ? candidateIndex : -1;
	}
}

/*tslint:enable:no-any*/