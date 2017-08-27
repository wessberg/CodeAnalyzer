import {SuperExpression} from "typescript";
import {ISuperExpressionFormatter} from "./i-super-expression-formatter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionKind, IFormattedSuperExpression} from "@wessberg/type";

/**
 * A class that can format super expressions
 */
export class SuperExpressionFormatter extends FormattedExpressionFormatter implements ISuperExpressionFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the given Decorator into an IFormattedSuperExpression
	 * @param {SuperExpression} expression
	 * @returns {IFormattedSuperExpression}
	 */
	public format (expression: SuperExpression): IFormattedSuperExpression {

		const result: IFormattedSuperExpression = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.SUPER_EXPRESSION
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
		return `super`;
	}

}