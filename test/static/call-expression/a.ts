import {A} from "../class/re-export-b";

/**
 * Foo bar
 * @param {T} t
 * @returns {T}
 */
function foo<T> (t: T): T {
	return t;
}

foo<A>(new A());