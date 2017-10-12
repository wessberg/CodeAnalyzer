class A {
	constructor () {
		console.log(true);
	}
}

function foo<T> (bar: T): void {
	console.log(bar);
}

foo<string>("");