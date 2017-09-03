import {IIndexTypeFormatter} from "./i-index-type-formatter";
import {IFormattedIndexType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {InterfaceTypeMemberFormatterGetter} from "../interface-type-member-formatter/interface-type-member-formatter-getter";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {IndexSignatureDeclaration} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedIndexTypes
 */
export class IndexTypeFormatter extends FormattedExpressionFormatter implements IIndexTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private interfaceTypeMemberFormatter: InterfaceTypeMemberFormatterGetter,
							 private typeFormatter: TypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedIndexType
	 * @param {IndexSignatureDeclaration} expression
	 * @returns {IFormattedIndexType}
	 */
	public format (expression: IndexSignatureDeclaration): IFormattedIndexType {
		const indexType: IFormattedIndexType = {
			...super.format(expression),
			kind: FormattedTypeKind.INDEX,
			key: this.interfaceTypeMemberFormatter().format(expression.parameters[0]),
			value: this.typeFormatter().format(expression.type),
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(indexType, expression);

		// Override the 'toString()' method
		indexType.toString = () => this.stringify(indexType);
		return indexType;
	}

	/**
	 * Generates a string representation of the IFormattedIndexType
	 * @param {IFormattedIndexType} indexType
	 * @returns {string}
	 */
	private stringify (indexType: IFormattedIndexType): string {
		return `[${indexType.key.toString()}]: ${indexType.value.toString()}`;
	}

}