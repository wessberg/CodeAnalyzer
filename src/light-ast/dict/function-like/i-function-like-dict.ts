import {IFunctionLikeCtor} from "../../ctor/function-like/i-function-like-ctor";
import {IDecoratorDict} from "../decorator/i-decorator-dict";

export interface IFunctionLikeDict extends IFunctionLikeCtor {
	decorators: IDecoratorDict[]|null;
}