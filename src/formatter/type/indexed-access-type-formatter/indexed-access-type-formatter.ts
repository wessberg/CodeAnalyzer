import {IFormattedIndexedAccessType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IIndexedAccessTypeFormatter} from "./i-indexed-access-type-formatter";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {IndexedAccessTypeNode} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedIndexedAccessTypes
 */
export class IndexedAccessTypeFormatter extends FormattedExpressionFormatter implements IIndexedAccessTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private typeFormatter: TypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedIndexedAccessType
	 * @param {IndexedAccessTypeNode} expression
	 * @returns {IFormattedIndexedAccessType}
	 */
	public format (expression: IndexedAccessTypeNode): IFormattedIndexedAccessType {

		const result: IFormattedIndexedAccessType = {
			...super.format(expression),
			kind: FormattedTypeKind.INDEXED_ACCESS,
			base: this.typeFormatter().format(expression.objectType),
			indexedAccessType: this.typeFormatter().format(expression.indexType),
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedIndexedAccessType
	 * @param {IFormattedIndexedAccessType} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IFormattedIndexedAccessType): string {
		return `${formatted.base.toString()}[${formatted.indexedAccessType.toString()}]`;
	}

}