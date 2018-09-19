import {Decorator, Node} from "typescript";
import {IDecoratorCtor} from "../../light-ast/ctor/decorator/i-decorator-ctor";

export type DecoratorExpression = string|IDecoratorCtor|RegExp;

export interface IDecoratorService {
	createDecorator (decorator: IDecoratorCtor): Decorator;

	takeDecoratorName (decorator: Decorator): string|undefined;
	takeDecoratorExpression (node: Decorator): string;
	hasDecoratorWithExpression (expression: DecoratorExpression, node: Node): boolean;
	getDecoratorWithExpression (expression: DecoratorExpression, node: Node): Decorator|undefined;
	getDecoratorsWithExpression (expression: DecoratorExpression, node: Node): Decorator[];
}