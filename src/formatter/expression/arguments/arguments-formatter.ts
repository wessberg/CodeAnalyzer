import {CallExpression} from "typescript";
import {IArgumentsFormatter} from "./i-arguments-formatter";
import {IFormattedArguments} from "./i-formatted-arguments";
import {FormattedExpressionKind} from "../formatted-expression-kind/formatted-expression-kind";
import {FormattedExpressionFormatterGetter} from "../formatted-expression/formatted-expression-formatter-getter";
import {CacheServiceGetter} from "../../../service/cache-service/cache-service-getter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";

/**
 * A class that can format arguments from provided expressions
 */
export class ArgumentsFormatter extends FormattedExpressionFormatter implements IArgumentsFormatter {
	constructor (private cacheService: CacheServiceGetter,
							 private expressionFormatter: FormattedExpressionFormatterGetter) {
		super();
	}

	/**
	 * Formats the given CallExpressions arguments into IFormattedArguments
	 * @param {ts.CallExpression} expression
	 * @returns {IFormattedArguments}
	 */
	public format (expression: CallExpression): IFormattedArguments {
		const result: IFormattedArguments = {
			...super.format(expression),
			startsAt: expression.arguments.pos,
			endsAt: expression.arguments.end,
			expressionKind: FormattedExpressionKind.ARGUMENTS,
			arguments: expression.arguments.map(argument => this.expressionFormatter().format(argument))
		};

		// Map the formatted expression to the relevant statement
		this.cacheService().mapFormattedExpressionToStatement(result, expression.arguments);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedArguments
	 * @param {IFormattedArguments} formattedArguments
	 * @returns {string}
	 */
	private stringify (formattedArguments: IFormattedArguments): string {
		return `(${formattedArguments.arguments.map(arg => arg.toString()).join(",")})`;
	}

}