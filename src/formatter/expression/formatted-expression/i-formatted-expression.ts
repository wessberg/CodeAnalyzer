import {FormattedExpressionKind} from "../formatted-expression-kind/formatted-expression-kind";
import {IFormattedCallExpression} from "../call-expression/i-formatted-call-expression";
import {IFormattedArguments} from "../arguments/i-formatted-arguments";
import {IFormattedStringLiteral} from "../literal/string-literal/i-formatted-string-literal";
import {IFormattedNumberLiteral} from "../literal/number-literal/i-formatted-number-literal";
import {IFormattedNotImplemented} from "../not-implemented/i-formatted-not-implemented";
import {IFormattedPropertyAccessExpression} from "../property-access-expression/i-formatted-property-access-expression";
import {IFormattedIdentifier} from "../identifier/i-formatted-identifier";
import {IFormattedBooleanLiteral} from "../literal/boolean-literal/i-formatted-boolean-literal";
import {IFormattedRegexLiteral} from "../literal/regex-literal/i-formatted-regex-literal";

export interface IFormattedExpression {
	// file: string;
	expressionKind: FormattedExpressionKind;
	startsAt: number;
	endsAt: number;
}

export declare type FormattedExpression = IFormattedCallExpression|IFormattedArguments|IFormattedStringLiteral|IFormattedNumberLiteral|IFormattedBooleanLiteral|IFormattedRegexLiteral|IFormattedPropertyAccessExpression|IFormattedIdentifier|IFormattedNotImplemented;