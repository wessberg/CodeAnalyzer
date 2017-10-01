import {IDecoratorService} from "./i-decorator-service";
import {Decorator, isCallExpression, isDecorator, isIdentifier, isPropertyAccessExpression, Node} from "typescript";
import {DecoratorKind} from "../../dict/decorator/decorator-kind";
import {DecoratorDict} from "../../dict/decorator/decorator-dict";
import {IFormatter} from "../../formatter/i-formatter";

/**
 * A service for working with Decorators
 */
export class DecoratorService implements IDecoratorService {

	constructor (private formatter: IFormatter) {
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
	 * Returns true if the provided Node has at least one decorator matching the provided name
	 * @param {string} name
	 * @param {Node} expression
	 * @returns {boolean}
	 */
	public hasDecoratorWithName (name: string, expression: Node): boolean {
		return expression.decorators != null && expression.decorators.some(decorator => this.takeDecoratorName(name, decorator) != null);
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
	 * Takes the name of the provided decorator
	 * @param {string} name
	 * @param {Node} node
	 * @returns {string}
	 */
	public takeDecoratorName (name: string, node: Node): string|undefined {
		if (isDecorator(node)) {
			return this.takeDecoratorName(name, node.expression);
		}

		// Check if the text matches the name
		if (isIdentifier(node)) {
			return node.text;
		}

		else if (isPropertyAccessExpression(node)) {
			const base = this.takeDecoratorName(name, node.expression);
			const property = this.takeDecoratorName(name, node.name);
			if (base == null || property == null) return undefined;
			return `${base}.${property}`;
		}

		else if (isCallExpression(node)) {
			return this.takeDecoratorName(name, node.expression);
		}

		return undefined;
	}

}