import {IFormattedPojoType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {PropertySignature, TypeLiteralNode} from "typescript";
import {IPojoTypeFormatter} from "./i-pojo-type-formatter";
import {InterfaceTypeMemberFormatterGetter} from "../interface-type-member-formatter/interface-type-member-formatter-getter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedPojoTypes
 */
export class PojoTypeFormatter extends FormattedExpressionFormatter implements IPojoTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private interfaceTypeMemberFormatter: InterfaceTypeMemberFormatterGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IPojoType
	 * @param {TypeLiteralNode} expression
	 * @returns {IFormattedPojoType}
	 */
	public format (expression: TypeLiteralNode): IFormattedPojoType {

		const pojoType: IFormattedPojoType = {
			...super.format(expression),
			kind: FormattedTypeKind.POJO,
			properties: expression.members.map(member => this.interfaceTypeMemberFormatter().format(<PropertySignature>member)),
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(pojoType, expression);

		// Override the 'toString()' method
		pojoType.toString = () => this.stringify(pojoType);
		return pojoType;
	}

	/**
	 * Generates a string representation of the IFormattedPojoType
	 * @param {IFormattedPojoType} pojoType
	 * @returns {string}
	 */
	private stringify (pojoType: IFormattedPojoType): string {
		return `{${pojoType.properties.map(property => property.toString()).join(", ")}}`;
	}

}