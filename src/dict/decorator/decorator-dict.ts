import {DecoratorKind} from "./decorator-kind";

export interface IDecoratorDict {
	kind: DecoratorKind;
}

export interface IIdentifierDecoratorDict extends IDecoratorDict {
	kind: DecoratorKind.IDENTIFIER;
	name: string;
}

export interface IExpressionDecoratorDict extends IDecoratorDict {
	kind: DecoratorKind.EXPRESSION;
	expression: string;
}

export declare type DecoratorDict = IIdentifierDecoratorDict|IExpressionDecoratorDict;