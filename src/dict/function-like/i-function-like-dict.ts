import {DecoratorDict} from "../decorator/decorator-dict";
import {Decorator} from "typescript";

export interface IFunctionLikeDict {
	isAsync: boolean;
	decorators: Iterable<DecoratorDict|Decorator>|null;
	type: string;
	body: string|null;
}