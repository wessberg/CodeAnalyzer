import {IFormattedIntersectionType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IIntersectionTypeFormatter} from "./i-intersection-type-formatter";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {IntersectionTypeNode} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedIntersectionTypes
 */
export class IntersectionTypeFormatter extends FormattedExpressionFormatter implements IIntersectionTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private typeFormatter: TypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedIntersectionType
	 * @param {IntersectionTypeNode} expression
	 * @returns {IFormattedIntersectionType}
	 */
	public format (expression: IntersectionTypeNode): IFormattedIntersectionType {

		const intersectionType: IFormattedIntersectionType = {
			...super.format(expression),
			kind: FormattedTypeKind.INTERSECTION,
			types: expression.types.map(type => this.typeFormatter().format(type)),
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(intersectionType, expression);

		// Override the 'toString()' method
		intersectionType.toString = () => this.stringify(intersectionType);
		return intersectionType;
	}

	/**
	 * Generates a string representation of the IFormattedIntersectionType
	 * @param {IFormattedIntersectionType} intersectionType
	 * @returns {string}
	 */
	private stringify (intersectionType: IFormattedIntersectionType): string {
		return `${intersectionType.types.map(type => type.toString()).join(" & ")}`;
	}

}