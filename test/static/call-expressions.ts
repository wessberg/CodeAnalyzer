/*tslint:disable*/
class Foo {
	private foo: string;
	constructor (private elem: string = "hello") {
		this.foo = this.elem + " world!";
	}
}
/*tslint:enable*/