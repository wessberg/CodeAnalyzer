import {IFormattedObjectType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IObjectTypeFormatter} from "./i-object-type-formatter";
import {SyntaxKind, Token} from "typescript";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedObjectTypes
 */
export class ObjectTypeFormatter extends FormattedExpressionFormatter implements IObjectTypeFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedObjectType
	 * @returns {IFormattedObjectType}
	 */
	public format (expression: Token<SyntaxKind.ObjectKeyword>): IFormattedObjectType {

		const objectType: IFormattedObjectType = {
			...super.format(expression),
			kind: FormattedTypeKind.OBJECT,
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(objectType, expression);

		// Override the 'toString()' method
		objectType.toString = () => this.stringify();
		return objectType;
	}

	/**
	 * Generates a string representation of the IFormattedObjectType
	 * @returns {string}
	 */
	private stringify (): string {
		return `object`;
	}

}