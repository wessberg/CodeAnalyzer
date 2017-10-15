import {IDecoratorService} from "./i-decorator-service";
import {Decorator, isCallExpression, Node} from "typescript";
import {DecoratorKind} from "../../dict/decorator/decorator-kind";
import {DecoratorDict} from "../../dict/decorator/decorator-dict";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IPrinter} from "@wessberg/typescript-ast-util";
import {isIExpressionDecoratorDict} from "../../dict/decorator/is-i-expression-decorator-dict";

/**
 * A service for working with Decorators
 */
export class DecoratorService implements IDecoratorService {
	constructor (private formatter: IFormatter,
							 private printer: IPrinter) {
	}

	/**
	 * Creates a decorator from the provided options
	 * @param {DecoratorDict} decorator
	 * @returns {Decorator}
	 */
	public createDecorator (decorator: DecoratorDict): Decorator {
		return this.formatter.formatDecorator(decorator);
	}

	/**
	 * Returns true if the provided Node is decorated with an expression that matches the provided one
	 * @param {string | DecoratorDict | RegExp} expression
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public hasDecoratorWithExpression (expression: string|DecoratorDict|RegExp, node: Node): boolean {
		return this.getDecoratorWithExpression(expression, node) != null;
	}

	/**
	 * Returns true if the provided Node has at least one decorator matching the provided name
	 * @param {string} name
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public hasDecoratorWithName (name: string|DecoratorDict|RegExp, node: Node): boolean {
		return this.getDecoratorWithName(name, node) != null;
	}


	/**
	 * Returns the decorator that matches the provided expression on the provided Node
	 * @param {string | DecoratorDict | RegExp} expression
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public getDecoratorWithExpression (expression: string|DecoratorDict|RegExp, node: Node): Decorator|undefined {
		if (node.decorators == null) return undefined;
		return node.decorators.find(decorator => {
			const decoratorExpression = this.takeDecoratorExpression(decorator);
			if (typeof expression === "string") {
				return decoratorExpression === expression;
			}

			else if (expression instanceof RegExp) {
				return expression.test(decoratorExpression);
			}

			else {
				return isIExpressionDecoratorDict(expression)
					? decoratorExpression === expression.expression
					: decoratorExpression === expression.name;
			}
		});
	}

	/**
	 * Returns the decorator that matches the provided name on the provided Node
	 * @param {string | DecoratorDict | RegExp} name
	 * @param {Node} node
	 * @returns {Decorator}
	 */
	public getDecoratorWithName (name: string|DecoratorDict|RegExp, node: Node): Decorator|undefined {
		if (node.decorators == null) return undefined;

		return node.decorators.find(decorator => {
			const decoratorName = this.takeDecoratorName(decorator);
			if (typeof name === "string") {
				return decoratorName === name;
			}

			else if (name instanceof RegExp) {
				return name.test(decoratorName);
			}

			else {
				return isIExpressionDecoratorDict(name)
					? decoratorName === name.expression
					: decoratorName === name.name;
			}
		});
	}

	/**
	 * Creates a decorator with an identifier matching the provided name.
	 * For example, '@foo' would be an identifier decorator
	 * @param {string} name
	 * @returns {Decorator}
	 */
	public createIdentifierDecorator (name: string): Decorator {
		return this.formatter.formatDecorator({
			kind: DecoratorKind.IDENTIFIER,
			name
		});
	}

	/**
	 * Creates a decorator with an identifier matching the provided expression.
	 * For example, '@foo({bar: "baz"})' would be an expression decorator
	 * @param {string} expression
	 * @returns {Decorator}
	 */
	public createExpressionDecorator (expression: string): Decorator {
		return this.formatter.formatDecorator({
			kind: DecoratorKind.EXPRESSION,
			expression
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