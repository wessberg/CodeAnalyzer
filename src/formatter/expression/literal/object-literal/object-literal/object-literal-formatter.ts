import {ObjectLiteralExpression} from "typescript";
import {AstMapperGetter} from "../../../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionFormatter} from "../../../formatted-expression/formatted-expression-formatter";
import {FormattedExpressionKind, IFormattedObjectLiteral} from "@wessberg/type";
import {ObjectLiteralPropertyFormatterGetter} from "../object-literal-property/object-literal-property-formatter-getter";
import {IObjectLiteralFormatter} from "./i-object-literal-formatter";

/**
 * A class that can format object literals
 */
export class ObjectLiteralFormatter extends FormattedExpressionFormatter implements IObjectLiteralFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private objectLiteralPropertyFormatter: ObjectLiteralPropertyFormatterGetter) {
		super();
	}

	/**
	 * Formats the given ObjectLiteralExpression into an IFormattedObjectLiteral
	 * @param {ObjectLiteralExpression} expression
	 * @returns {IFormattedObjectLiteral}
	 */
	public format (expression: ObjectLiteralExpression): IFormattedObjectLiteral {

		const result: IFormattedObjectLiteral = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.OBJECT_LITERAL,
			properties: expression.properties.map(property => this.objectLiteralPropertyFormatter().format(property))
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedObjectLiteral
	 * @param {IFormattedObjectLiteral} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IFormattedObjectLiteral): string {
		return `{${formatted.properties.map(property => property.toString()).join(", ")}}`;
	}

}