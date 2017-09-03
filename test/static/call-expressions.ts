/*tslint:disable*/
class Bar {
	constructor (bar: string) {
		console.log(bar);
	}

	baz (): void {
	}
}

class Foo extends Bar {
	private foo: string;

	constructor (private elem: string = "hello") {
		super(elem);
		this.foo = this.elem + " world!";
	}
}

/*tslint:enable*/