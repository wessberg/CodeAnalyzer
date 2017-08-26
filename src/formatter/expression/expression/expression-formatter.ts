import {IExpressionFormatter} from "./i-expression-formatter";
import {FormattedExpression} from "../formatted-expression/i-formatted-expression";
import {CallExpression, Expression, NumericLiteral, StringLiteral, SyntaxKind} from "typescript";
import {CallExpressionFormatterGetter} from "../call-expression/call-expression-formatter-getter";
import {StringLiteralFormatterGetter} from "../literal/string-literal/string-literal-formatter-getter";
import {NotImplementedFormatterGetter} from "../not-implemented/not-implemented-formatter-getter";
import {NumberLiteralFormatterGetter} from "../literal/number-literal/number-literal-formatter-getter";

/**
 * Can format any expression
 */
export class ExpressionFormatter implements IExpressionFormatter {
	constructor (private callExpressionFormatter: CallExpressionFormatterGetter,
							 private stringLiteralFormatter: StringLiteralFormatterGetter,
							 private numberLiteralFormatter: NumberLiteralFormatterGetter,
							 private notImplementedFormatter: NotImplementedFormatterGetter) {
	}

	/**
	 * Formats the given expression into an IFormattedExpression
	 * @param {Expression} expression
	 * @returns {IFormattedExpression}
	 */
	public format (expression: Expression): FormattedExpression {
		switch (expression.kind) {
			case SyntaxKind.CallExpression:
				return this.callExpressionFormatter().format(<CallExpression>expression);

			case SyntaxKind.StringLiteral:
				return this.stringLiteralFormatter().format(<StringLiteral>expression);

			case SyntaxKind.NumericLiteral:
				return this.numberLiteralFormatter().format(<NumericLiteral>expression);

			default:
				return this.notImplementedFormatter().format(expression);
		}
	}

}