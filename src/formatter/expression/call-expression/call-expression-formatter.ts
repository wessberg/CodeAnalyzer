import {ICallExpressionFormatter} from "./i-call-expression-formatter";
import {CallExpression} from "typescript";
import {IFormattedCallExpression} from "./i-formatted-call-expression";
import {FormattedExpressionKind} from "../formatted-expression-kind/formatted-expression-kind";
import {CacheServiceGetter} from "../../../service/cache-service/cache-service-getter";
import {ArgumentsFormatterGetter} from "../arguments/arguments-formatter-getter";
import {TypeFormatterGetter} from "../../type/type-formatter/type-formatter-getter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {ExpressionFormatterGetter} from "../expression/expression-formatter-getter";

/**
 * A class that can format CallExpressions
 */
export class CallExpressionFormatter extends FormattedExpressionFormatter implements ICallExpressionFormatter {
	constructor (private cacheService: CacheServiceGetter,
							 private expressionFormatter: ExpressionFormatterGetter,
							 private argumentsFormatter: ArgumentsFormatterGetter,
							 private typeFormatter: TypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the given CallExpression into an IFormattedCallExpression
	 * @param {CallExpression} expression
	 * @returns {IFormattedCallExpression}
	 */
	public format (expression: CallExpression): IFormattedCallExpression {

		const result: IFormattedCallExpression = {
			...super.format(expression),
			typeArguments: expression.typeArguments == null ? [] : expression.typeArguments.map(argument => this.typeFormatter().format(argument)),
			arguments: this.argumentsFormatter().format(expression),
			expressionKind: FormattedExpressionKind.CALL_EXPRESSION,
			expression: this.expressionFormatter().format(expression.expression)
		};

		// Map the formatted expression to the relevant statement
		this.cacheService().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedArgument
	 * @param {IFormattedCallExpression} formattedCallExpression
	 * @returns {string}
	 */
	private stringify (formattedCallExpression: IFormattedCallExpression): string {
		return `${formattedCallExpression.expression.toString()}${formattedCallExpression.typeArguments.length > 0 ? `<${formattedCallExpression.typeArguments.map(arg => arg.toString()).join(",")}>` : ""}(${formattedCallExpression.arguments.arguments.map(arg => arg.toString()).join(",")})`;
	}

}