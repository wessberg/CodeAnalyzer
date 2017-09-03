import {A} from "../class/a";

/**
 * Foo bar
 * @param {T} t
 * @returns {T}
 */
function foo<T> (t: T): T {
	return t;
}

foo<A>(new A());