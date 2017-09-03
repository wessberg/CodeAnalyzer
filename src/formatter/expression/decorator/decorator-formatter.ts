import {Decorator} from "typescript";
import {IDecoratorFormatter} from "./i-decorator-formatter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionKind, IFormattedDecorator} from "@wessberg/type";
import {ExpressionFormatterGetter} from "../expression/expression-formatter-getter";

/**
 * A class that can format decorators
 */
export class DecoratorFormatter extends FormattedExpressionFormatter implements IDecoratorFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private expressionFormatter: ExpressionFormatterGetter) {
		super();
	}

	/**
	 * Formats the given Decorator into an IFormattedDecorator
	 * @param {Decorator} expression
	 * @returns {IFormattedDecorator}
	 */
	public format (expression: Decorator): IFormattedDecorator {

		const result: IFormattedDecorator = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.DECORATOR,
			expression: this.expressionFormatter().format(expression.expression)
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedDecorator
	 * @param {IFormattedDecorator} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IFormattedDecorator): string {
		return `@${formatted.expression.toString()}`;
	}

}