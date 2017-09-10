import {IFormattedPredicateType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IPredicateTypeFormatter} from "./i-predicate-type-formatter";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {TypePredicateNode} from "typescript";

/**
 * A class for generating IFormattedPredicateType
 */
export class PredicateTypeFormatter extends FormattedExpressionFormatter implements IPredicateTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private astUtil: ITypescriptASTUtil,
							 private typeFormatter: TypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IBooleanType
	 * @param {FirstTypeNode} expression
	 * @returns {IFormattedPredicateType}
	 */
	public format (expression: TypePredicateNode): IFormattedPredicateType {

		const result: IFormattedPredicateType = {
			...super.format(expression),
			kind: FormattedTypeKind.PREDICATE,
			name: this.astUtil.takeName(expression.parameterName),
			type: this.typeFormatter().format(expression.type),
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedPredicateType
	 * @param {IFormattedPredicateType} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IFormattedPredicateType): string {
		return `${formatted.name} is ${formatted.type.toString()}`;
	}

}