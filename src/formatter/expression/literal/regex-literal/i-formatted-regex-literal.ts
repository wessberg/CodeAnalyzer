import {IFormattedExpression} from "../../formatted-expression/i-formatted-expression";
import {FormattedExpressionKind} from "../../formatted-expression-kind/formatted-expression-kind";

export interface IFormattedRegexLiteral extends IFormattedExpression {
	expressionKind: FormattedExpressionKind.REGEX_LITERAL;
	value: RegExp;
}