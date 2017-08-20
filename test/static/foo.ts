/*tslint:disable*/
export interface IBar<T extends Node = Node> {
	lol? (): T;
}

export interface IFoo extends IBar<Element> {
	foo: number;
	bar ({lol}: IBar<Node>): void;
}

export interface IBaz {
	[key: string]: {foo?: number};
}
/*tslint:enable*/