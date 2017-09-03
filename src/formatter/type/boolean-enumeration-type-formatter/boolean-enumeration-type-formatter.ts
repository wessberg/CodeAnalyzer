import {IFormattedBooleanEnumerationType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IBooleanEnumerationTypeFormatter} from "./i-boolean-enumeration-type-formatter";
import {BooleanLiteral, SyntaxKind} from "typescript";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedBooleanEnumerationTypes
 */
export class BooleanEnumerationTypeFormatter extends FormattedExpressionFormatter implements IBooleanEnumerationTypeFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedBooleanEnumerationType
	 * @param {BooleanLiteral} expression
	 * @returns {IFormattedBooleanEnumerationType}
	 */
	public format (expression: BooleanLiteral): IFormattedBooleanEnumerationType {

		const booleanEnumerationType: IFormattedBooleanEnumerationType = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.TYPE,
			kind: FormattedTypeKind.BOOLEAN_ENUMERATION,
			value: expression.kind === SyntaxKind.TrueKeyword
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(booleanEnumerationType, expression);

		// Override the 'toString()' method
		booleanEnumerationType.toString = () => this.stringify(booleanEnumerationType);
		return booleanEnumerationType;
	}

	/**
	 * Generates a string representation of the IFormattedBooleanEnumerationType
	 * @param {boolean} value
	 * @returns {string}
	 */
	private stringify ({value}: IFormattedBooleanEnumerationType): string {
		return `${value}`;
	}

}