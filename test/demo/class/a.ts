@aDecorator
class A {
	constructor () {
		console.log(true);
	}

	@aDecorator
	public aMethod (): void {

	}
}


function aDecorator(target: {}, property: string) {
}

function foo<T, U> (bar: T, baz: U): void {
	console.log(bar, baz);
}

foo<string, number>("", 2);

interface IFoo {
	a?: string;
	b: number;
}