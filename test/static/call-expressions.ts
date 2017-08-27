/*tslint:disable*/
function foo(filter: Object) {
	return (target: Object) => {
		console.log(target, filter);
	}
}

class Foo {
	static Bar = class {}
}
export interface IFoo {
}

export interface IBar {

}

function doStuff <T> (elem: T): T {
	return elem;
}

@foo({when: {foo: "bar"}})
class Bar extends doStuff<typeof Foo.Bar>(Foo) implements IFoo, IBar {
	foo<T> (t: T): T {
		return t;
	}
}
const bar = new Bar();
bar.foo<string>(`hello world!`);
/*tslint:enable*/