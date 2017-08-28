/*tslint:disable*/
class Bar {
	baz (): void {}
	constructor (bar: string) {
		console.log(bar);
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