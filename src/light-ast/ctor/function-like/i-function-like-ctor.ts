import {IDecoratorCtor} from "../decorator/i-decorator-ctor";

export interface IFunctionLikeCtor {
	isAsync: boolean;
	decorators: Iterable<IDecoratorCtor>|null;
	type: string;
	body: string|null;
}