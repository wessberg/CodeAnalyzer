import {IFormattedNumberEnumerationType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {INumberEnumerationTypeFormatter} from "./i-number-enumeration-type-formatter";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {NumericLiteral} from "typescript";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating INumberEnumerationTypes
 */
export class NumberEnumerationTypeFormatter extends FormattedExpressionFormatter implements INumberEnumerationTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private astUtil: ITypescriptASTUtil) {
		super();
	}

	/**
	 * Formats the provided Expression into an INumberEnumerationType
	 * @param {NumericLiteral} expression
	 * @returns {IFormattedNumberEnumerationType}
	 */
	public format (expression: NumericLiteral): IFormattedNumberEnumerationType {

		const numberEnumerationType: IFormattedNumberEnumerationType = {
			...super.format(expression),
			kind: FormattedTypeKind.NUMBER_ENUMERATION,
			value: parseInt(this.astUtil.takeName(expression)),
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(numberEnumerationType, expression);

		// Override the 'toString()' method
		numberEnumerationType.toString = () => this.stringify(numberEnumerationType);
		return numberEnumerationType;
	}

	/**
	 * Generates a string representation of the IFormattedNumberEnumerationType
	 * @param {number} value
	 * @returns {string}
	 */
	private stringify ({value}: IFormattedNumberEnumerationType): string {
		return `${value}`;
	}

}