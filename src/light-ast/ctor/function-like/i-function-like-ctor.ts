import {IDecoratorCtor} from "../decorator/i-decorator-ctor";

export interface IFunctionLikeCtor {
	decorators: IDecoratorCtor[]|null;
	type: string|null;
	body: string|null;
}