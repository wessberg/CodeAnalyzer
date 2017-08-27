import {ThisExpression} from "typescript";
import {IThisExpressionFormatter} from "./i-this-expression-formatter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionKind, IFormattedThisExpression} from "@wessberg/type";

/**
 * A class that can format this expressions
 */
export class ThisExpressionFormatter extends FormattedExpressionFormatter implements IThisExpressionFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the given Decorator into an IFormattedThisExpression
	 * @param {ThisExpression} expression
	 * @returns {IFormattedThisExpression}
	 */
	public format (expression: ThisExpression): IFormattedThisExpression {

		const result: IFormattedThisExpression = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.THIS_EXPRESSION
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify();
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedDecorator
	 * @returns {string}
	 */
	private stringify (): string {
		return `this`;
	}

}