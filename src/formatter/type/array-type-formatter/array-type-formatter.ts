import {FormattedExpressionKind, FormattedTypeKind, IFormattedArrayType} from "@wessberg/type";
import {IArrayTypeFormatter} from "./i-array-type-formatter";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {ArrayTypeNode} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IArrayTypes
 */
export class ArrayTypeFormatter extends FormattedExpressionFormatter implements IArrayTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private typeFormatter: TypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an ITupleType
	 * @param {ArrayTypeNode} expression
	 * @returns {IFormattedArrayType}
	 */
	public format (expression: ArrayTypeNode): IFormattedArrayType {

		const arrayType: IFormattedArrayType = {
			...super.format(expression),
			kind: FormattedTypeKind.ARRAY,
			type: this.typeFormatter().format(expression.elementType),
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(arrayType, expression);

		// Override the 'toString()' method
		arrayType.toString = () => this.stringify(arrayType);
		return arrayType;
	}

	/**
	 * Generates a string representation of the IArrayType
	 * @param {IFormattedArrayType} arrayType
	 * @returns {string}
	 */
	private stringify (arrayType: IFormattedArrayType): string {
		return `${arrayType.type.toString()}[]`;
	}

}