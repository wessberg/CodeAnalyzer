import {IPropertyAccessExpressionFormatter} from "./i-property-access-expression-formatter";
import {PropertyAccessExpression} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {ExpressionFormatterGetter} from "../expression/expression-formatter-getter";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {FormattedExpressionKind, IFormattedPropertyAccessExpression} from "@wessberg/type";

/**
 * A class that can format PropertyAccessExpressions
 */
export class PropertyAccessExpressionFormatter extends FormattedExpressionFormatter implements IPropertyAccessExpressionFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private astMapper: AstMapperGetter,
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
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

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