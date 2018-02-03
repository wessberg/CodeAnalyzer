import {IDecoratorCtor} from "../decorator/i-decorator-ctor";

export interface IFunctionLikeCtor {
	decorators: Iterable<IDecoratorCtor>|null;
	type: string|null;
	body: string|null;
}