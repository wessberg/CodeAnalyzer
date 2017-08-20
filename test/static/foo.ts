export interface IBar {
	lol: Promise<void>;
}

export interface IFoo {
	foo: number;
	bar ({lol}: IBar): void;
}