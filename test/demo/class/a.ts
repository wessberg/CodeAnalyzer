/*tslint:disable*/
import {B, C, D} from "./b";

/**
 * A comment
 */
@aDecorator
class A extends D {
	constructor (foo: string, bar: number = 2, baz: Promise<void>) {
		super();
		console.log(true);
	}

	/**
	 * Foobarbaz
	 * @type {string}
	 */
	@aDecorator
	public aMethod (): void {

	}
}

/**
 * A function
 * @param {{}} target
 * @param {string} property
 */
function aDecorator(target: {}, property: string) {
}

function foo<T, U, J> (bar: T, baz: U, lolz?: J): void {
	console.log(bar, baz, lolz);
}

foo<string, number, C>("", 2);

interface IFoo {
	a?: string;
	b: number;
}
/*tslint:enable*/