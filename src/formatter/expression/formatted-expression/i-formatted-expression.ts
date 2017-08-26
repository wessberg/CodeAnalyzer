import {FormattedExpressionKind} from "../formatted-expression-kind/formatted-expression-kind";
import {IFormattedCallExpression} from "../call-expression/i-formatted-call-expression";
import {IFormattedArguments} from "../arguments/i-formatted-arguments";
import {IFormattedStringLiteral} from "../literal/string-literal/i-formatted-string-literal";
import {IFormattedNumberLiteral} from "../literal/number-literal/i-formatted-number-literal";
import {IFormattedNotImplemented} from "../not-implemented/i-formatted-not-implemented";

export interface IFormattedExpression {
	file: string;
	expressionKind: FormattedExpressionKind;
	startsAt: number;
	endsAt: number;
}

export declare type FormattedExpression = IFormattedCallExpression|IFormattedArguments|IFormattedStringLiteral|IFormattedNumberLiteral|IFormattedNotImplemented;