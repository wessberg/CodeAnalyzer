import {IFormattedUnionType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IUnionTypeFormatter} from "./i-union-type-formatter";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {UnionTypeNode} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IUnionTypes
 */
export class UnionTypeFormatter extends FormattedExpressionFormatter implements IUnionTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private typeFormatter: TypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedUnionType
	 * @param {UnionTypeNode} expression
	 * @returns {IFormattedUnionType}
	 */
	public format (expression: UnionTypeNode): IFormattedUnionType {

		const unionType: IFormattedUnionType = {
			...super.format(expression),
			kind: FormattedTypeKind.UNION,
			types: expression.types.map(type => this.typeFormatter().format(type)),
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(unionType, expression);

		// Override the 'toString()' method
		unionType.toString = () => this.stringify(unionType);
		return unionType;
	}

	/**
	 * Generates a string representation of the IFormattedUnionType
	 * @param {IFormattedUnionType} unionType
	 * @returns {string}
	 */
	private stringify (unionType: IFormattedUnionType): string {
		return `${unionType.types.map(type => type.toString()).join(" | ")}`;
	}

}