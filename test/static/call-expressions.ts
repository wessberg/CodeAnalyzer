/*tslint:disable*/
class Bar {
	foo<T> (t: T): T {
		return t;
	}
}
const bar = new Bar();
bar.foo<number>(2);
/*tslint:enable*/