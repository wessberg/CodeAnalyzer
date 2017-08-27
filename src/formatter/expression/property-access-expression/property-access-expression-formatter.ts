import {IPropertyAccessExpressionFormatter} from "./i-property-access-expression-formatter";
import {PropertyAccessExpression} from "typescript";
import {IFormattedPropertyAccessExpression} from "./i-formatted-property-access-expression";
import {FormattedExpressionKind} from "../formatted-expression-kind/formatted-expression-kind";
import {CacheServiceGetter} from "../../../service/cache-service/cache-service-getter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {ExpressionFormatterGetter} from "../expression/expression-formatter-getter";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";

/**
 * A class that can format PropertyAccessExpressions
 */
export class PropertyAccessExpressionFormatter extends FormattedExpressionFormatter implements IPropertyAccessExpressionFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private cacheService: CacheServiceGetter,
							 private expressionFormatter: ExpressionFormatterGetter) {
		super();
	}

	/**
	 * Formats the given PropertyAccessExpression into an IFormattedPropertyAccessExpression
	 * @param {PropertyAccessExpression} expression
	 * @returns {IFormattedPropertyAccessExpression}
	 */
	public format (expression: PropertyAccessExpression): IFormattedPropertyAccessExpression {

		const result: IFormattedPropertyAccessExpression = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.PROPERTY_ACCESS,
			expression: this.expressionFormatter().format(expression.expression),
			property: this.astUtil.takeName(expression.name)
		};

		// Map the formatted expression to the relevant statement
		this.cacheService().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedPropertyAccessExpression
	 * @param {IFormattedPropertyAccessExpression} formattedPropertyAccessExpression
	 * @returns {string}
	 */
	private stringify (formattedPropertyAccessExpression: IFormattedPropertyAccessExpression): string {
		return `${formattedPropertyAccessExpression.expression.toString()}.${formattedPropertyAccessExpression.property}`;
	}

}