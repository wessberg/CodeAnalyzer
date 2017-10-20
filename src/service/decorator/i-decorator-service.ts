import {Decorator, Node} from "typescript";
import {IDecoratorCtor} from "../../light-ast/ctor/decorator/i-decorator-ctor";

export interface IDecoratorService {
	createDecorator (decorator: IDecoratorCtor): Decorator;

	takeDecoratorName (decorator: Decorator): string|undefined;
	takeDecoratorExpression (node: Decorator): string;
	hasDecoratorWithExpression (expression: string|IDecoratorCtor|RegExp, node: Node): boolean;
	getDecoratorWithExpression (expression: string|IDecoratorCtor|RegExp, node: Node): Decorator|undefined;
}