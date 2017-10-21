import {LiteralExpression} from "typescript";

export interface ILiteralService<T extends LiteralExpression, U> {
	getText (literal: T): string;
	getNormalizedText (literal: T): U;
}