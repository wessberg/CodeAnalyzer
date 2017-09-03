import {IFormattedStringEnumerationType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IStringEnumerationTypeFormatter} from "./i-string-enumeration-type-formatter";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {StringLiteral} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedStringEnumerationType
 */
export class StringEnumerationTypeFormatter extends FormattedExpressionFormatter implements IStringEnumerationTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private astUtil: ITypescriptASTUtil) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedStringEnumerationType
	 * @param {StringLiteral} expression
	 * @returns {IFormattedStringEnumerationType}
	 */
	public format (expression: StringLiteral): IFormattedStringEnumerationType {

		const stringEnumerationType: IFormattedStringEnumerationType = {
			...super.format(expression),
			kind: FormattedTypeKind.STRING_ENUMERATION,
			value: this.astUtil.takeName(expression),
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(stringEnumerationType, expression);

		// Override the 'toString()' method
		stringEnumerationType.toString = () => this.stringify(stringEnumerationType);
		return stringEnumerationType;
	}

	/**
	 * Generates a string representation of the IFormattedStringEnumerationType
	 * @param {string} value
	 * @returns {string}
	 */
	private stringify ({value}: IFormattedStringEnumerationType): string {
		return value;
	}

}