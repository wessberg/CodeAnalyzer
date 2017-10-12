import {DecoratorDict} from "../decorator/decorator-dict";

export interface IFunctionLikeDict {
	isAsync: boolean;
	decorators: Iterable<DecoratorDict>|null;
	type: string;
	body: string|null;
}