import {IFormattedTypeofType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {ITypeofTypeFormatter} from "./i-typeof-type-formatter";
import {ReferenceTypeFormatterGetter} from "../reference-type-formatter/reference-type-formatter-getter";
import {TypeQueryNode} from "typescript";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedTypeofTypes
 */
export class TypeofTypeFormatter extends FormattedExpressionFormatter implements ITypeofTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private referenceTypeFormatter: ReferenceTypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedTypeofType
	 * @param {TypeQueryNode} expression
	 * @returns {IFormattedTypeofType}
	 */
	public format (expression: TypeQueryNode): IFormattedTypeofType {

		const typeofType: IFormattedTypeofType = {
			...super.format(expression),
			kind: FormattedTypeKind.TYPEOF,
			of: this.referenceTypeFormatter().format(expression.exprName),
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(typeofType, expression);

		// Override the 'toString()' method
		typeofType.toString = () => this.stringify(typeofType);
		return typeofType;
	}

	/**
	 * Generates a string representation of the IFormattedTypeofType
	 * @param {IFormattedTypeofType} typeofType
	 * @returns {string}
	 */
	private stringify (typeofType: IFormattedTypeofType): string {
		return `typeof ${typeofType.of.toString()}`;
	}

}