import {IExpressionFormatter} from "./i-expression-formatter";
import {FormattedExpression} from "../formatted-expression/i-formatted-expression";
import {BooleanLiteral, CallExpression, Expression, Identifier, NumericLiteral, PropertyAccessExpression, RegularExpressionLiteral, StringLiteral, SyntaxKind} from "typescript";
import {CallExpressionFormatterGetter} from "../call-expression/call-expression-formatter-getter";
import {StringLiteralFormatterGetter} from "../literal/string-literal/string-literal-formatter-getter";
import {NotImplementedFormatterGetter} from "../not-implemented/not-implemented-formatter-getter";
import {NumberLiteralFormatterGetter} from "../literal/number-literal/number-literal-formatter-getter";
import {PropertyAccessExpressionFormatterGetter} from "../property-access-expression/property-access-expression-formatter-getter";
import {IdentifierFormatterGetter} from "../identifier/identifier-formatter-getter";
import {BooleanLiteralFormatterGetter} from "../literal/boolean-literal/boolean-literal-formatter-getter";
import {RegexLiteralFormatterGetter} from "../literal/regex-literal/regex-literal-formatter-getter";

/**
 * Can format any expression
 */
export class ExpressionFormatter implements IExpressionFormatter {
	constructor (private callExpressionFormatter: CallExpressionFormatterGetter,
							 private propertyAccessExpressionFormatter: PropertyAccessExpressionFormatterGetter,
							 private identifierExpressionFormatter: IdentifierFormatterGetter,
							 private stringLiteralFormatter: StringLiteralFormatterGetter,
							 private numberLiteralFormatter: NumberLiteralFormatterGetter,
							 private booleanLiteralFormatter: BooleanLiteralFormatterGetter,
							 private regexLiteralFormatter: RegexLiteralFormatterGetter,
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

			case SyntaxKind.PropertyAccessExpression:
				return this.propertyAccessExpressionFormatter().format(<PropertyAccessExpression>expression);

			case SyntaxKind.StringLiteral:
			case SyntaxKind.NoSubstitutionTemplateLiteral:
				return this.stringLiteralFormatter().format(<StringLiteral>expression);

			case SyntaxKind.NumericLiteral:
				return this.numberLiteralFormatter().format(<NumericLiteral>expression);

			case SyntaxKind.TrueKeyword:
			case SyntaxKind.FalseKeyword:
				return this.booleanLiteralFormatter().format(<BooleanLiteral>expression);

			case SyntaxKind.Identifier:
				return this.identifierExpressionFormatter().format(<Identifier>expression);

			case SyntaxKind.RegularExpressionLiteral:
				return this.regexLiteralFormatter().format(<RegularExpressionLiteral>expression);

			default:
				return this.notImplementedFormatter().format(expression);
		}
	}

}