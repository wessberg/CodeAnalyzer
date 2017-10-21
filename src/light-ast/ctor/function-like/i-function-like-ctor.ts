import {IDecoratorCtor} from "../decorator/i-decorator-ctor";

export interface IFunctionLikeCtor {
	decorators: Iterable<IDecoratorCtor>|null;
	type: string;
	body: string|null;
}