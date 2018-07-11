import {IDecoratorService} from "./i-decorator-service";
import {Decorator, isCallExpression, Node} from "typescript";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IPrinter} from "@wessberg/typescript-ast-util";
import {IDecoratorCtor} from "../../light-ast/ctor/decorator/i-decorator-ctor";

/**
 * A service for working with Decorators
 */
export class DecoratorService implements IDecoratorService {
	constructor (private readonly formatter: IFormatter,
							 private readonly printer: IPrinter) {
	}

	/**
	 * Creates a decorator from the provided options
	 * @param {IDecoratorCtor} decorator
	 * @returns {Decorator}
	 */
	public createDecorator (decorator: IDecoratorCtor): Decorator {
		return this.formatter.formatDecorator(decorator);
	}

	/**
	 * Returns true if the provided Node is decorated with an expression that matches the provided one
	 * @param {string | IDecoratorCtor | RegExp} expression
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public hasDecoratorWithExpression (expression: string|IDecoratorCtor|RegExp, node: Node): boolean {
		return this.getDecoratorWithExpression(expression, node) != null;
	}

	/**
	 * Returns the decorator that matches the provided expression on the provided Node
	 * @param {string | IDecoratorCtor | RegExp} expression
	 * @param {Node} node
	 * @returns {Decorator?}
	 */
	public getDecoratorWithExpression (expression: string|IDecoratorCtor|RegExp, node: Node): Decorator|undefined {
		return this.getDecoratorsWithExpression(expression, node)[0];
	}

	/**
	 * Returns all the decorators that matches the provided expression on the provided Node
	 * @param {string | IDecoratorCtor | RegExp} expression
	 * @param {Node} node
	 * @returns {Decorator[]}
	 */
	public getDecoratorsWithExpression (expression: string|IDecoratorCtor|RegExp, node: Node): Decorator[] {
		if (node.decorators == null) return [];
		return node.decorators.filter(decorator => {
			const decoratorExpression = this.takeDecoratorExpression(decorator);

			if (typeof expression === "string") {
				return decoratorExpression === expression;
			}

			else if (expression instanceof RegExp) {
				return expression.test(decoratorExpression);
			}

			else {
				return decoratorExpression === expression.expression;
			}
		});
	}

	/**
	 * Takes the stringified expression of the provided decorator
	 * @param {Node} node
	 * @returns {string}
	 */
	public takeDecoratorExpression (node: Decorator): string {
		return this.printer.print(node.expression);
	}

	/**
	 * Takes the name of the provided decorator
	 * @param {Node} node
	 * @returns {string}
	 */
	public takeDecoratorName (node: Decorator): string {
		// If it is a CallExpression, take anything up to the left parenthesis
		if (isCallExpression(node.expression)) {
			return this.printer.print(node.expression.expression);
		}

		// Otherwise, return the full expression of the node as the name of the decorator
		else {
			return this.printer.print(node.expression);
		}
	}

}