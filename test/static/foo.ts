/*tslint:disable*/
export interface IBar<T extends Node = Node> {
	lol? (): T;
	baz: boolean;
	whatever: symbol;
	hmm: null;
	hehe: undefined;
	what: string|number;
	a: "hello"|false;
	b: this;
	c: object;
	d: {};
	e: false;
	f: "hello";
	g: 2;
	h: never;
	i: [string, number];
	j: string[];
	k: number & string;
	l: keyof string[];
	m: (string)[];
	n: string | number;
}

export interface IFoo extends IBar<Element>, Node {
	foo: number;
	bar ({lol}: IBar<Node>): void;
}

export interface IBaz {
	[key: string]: {foo?: number, bar: any};
}
/*tslint:enable*/