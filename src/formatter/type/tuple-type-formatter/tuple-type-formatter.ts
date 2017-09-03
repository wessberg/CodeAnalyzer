import {IFormattedTupleType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {ITupleTypeFormatter} from "./i-tuple-type-formatter";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {TupleTypeNode} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedTupleType
 */
export class TupleTypeFormatter extends FormattedExpressionFormatter implements ITupleTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private typeFormatter: TypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedTupleType
	 * @param {TupleTypeNode} expression
	 * @returns {IFormattedTupleType}
	 */
	public format (expression: TupleTypeNode): IFormattedTupleType {

		const tupleType: IFormattedTupleType = {
			...super.format(expression),
			kind: FormattedTypeKind.TUPLE,
			members: expression.elementTypes.map(elementType => this.typeFormatter().format(elementType)),
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(tupleType, expression);

		// Override the 'toString()' method
		tupleType.toString = () => this.stringify(tupleType);
		return tupleType;
	}

	/**
	 * Generates a string representation of the IFormattedTupleType
	 * @param {IFormattedTupleType} tupleType
	 * @returns {string}
	 */
	private stringify (tupleType: IFormattedTupleType): string {
		return `[${tupleType.members.map(member => member.toString()).join(", ")}]`;
	}

}