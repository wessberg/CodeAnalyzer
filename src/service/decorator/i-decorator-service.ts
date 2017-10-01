import {Decorator, Node} from "typescript";
import {DecoratorDict} from "../../dict/decorator/decorator-dict";

export interface IDecoratorService {
	createIdentifierDecorator (name: string): Decorator;
	createExpressionDecorator (expression: string): Decorator;
	createDecorator (decorator: DecoratorDict): Decorator;

	takeDecoratorName (name: string, decorator: Decorator): string|undefined;
	hasDecoratorWithName (name: string, expression: Node): boolean;
}