import {Decorator, Node} from "typescript";
import {DecoratorDict} from "../../dict/decorator/decorator-dict";

export interface IDecoratorService {
	createIdentifierDecorator (name: string): Decorator;
	createExpressionDecorator (expression: string): Decorator;
	createDecorator (decorator: DecoratorDict): Decorator;

	takeDecoratorName (decorator: Decorator): string|undefined;
	takeDecoratorExpression (node: Decorator): string;
	hasDecoratorWithName (name: string|DecoratorDict|RegExp, node: Node): boolean;
	hasDecoratorWithExpression (expression: string|DecoratorDict|RegExp, node: Node): boolean;
	getDecoratorWithName (name: string|DecoratorDict|RegExp, node: Node): Decorator|undefined;
	getDecoratorWithExpression (expression: string|DecoratorDict|RegExp, node: Node): Decorator|undefined;
}