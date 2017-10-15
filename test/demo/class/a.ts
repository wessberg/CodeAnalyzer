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

function foo<T> (bar: T): void {
	console.log(bar);
}

foo<string>("");

interface IFoo {
	a?: string;
	b: number;
}