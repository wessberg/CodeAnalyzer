/*tslint:disable*/
import {A} from "./a";

export interface IFoo {
	foo: "bar";
}

export class B extends A {
	bar: number;
	
	public predicate (item: string): item is string {
		return typeof item === "string";
	}

	public baz (): IFoo[keyof IFoo] {
		return "bar";
	}
}
/*tslint:enable*/