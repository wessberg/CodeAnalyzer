import {IFormattedKeyofType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IKeyofTypeFormatter} from "./i-keyof-type-formatter";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {TypeNode} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedKeyofType
 */
export class KeyofTypeFormatter extends FormattedExpressionFormatter implements IKeyofTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private typeFormatter: TypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedKeyofType
	 * @param {TypeNode} expression
	 * @returns {IFormattedKeyofType}
	 */
	public format (expression: TypeNode): IFormattedKeyofType {

		const keyofType: IFormattedKeyofType = {
			...super.format(expression),
			kind: FormattedTypeKind.KEYOF,
			type: this.typeFormatter().format(expression),
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(keyofType, expression);

		// Override the 'toString()' method
		keyofType.toString = () => this.stringify(keyofType);
		return keyofType;
	}

	/**
	 * Generates a string representation of the IFormattedKeyofType
	 * @param {IFormattedKeyofType} keyofType
	 * @returns {string}
	 */
	private stringify (keyofType: IFormattedKeyofType): string {
		return `keyof ${keyofType.type.toString()}`;
	}

}