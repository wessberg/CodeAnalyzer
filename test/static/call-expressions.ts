/*tslint:disable*/
class Bar {
	foo<T> (t: T): T {
		return t;
	}
}
const bar = new Bar();
bar.foo<string>(`hello world!`);
/*tslint:enable*/