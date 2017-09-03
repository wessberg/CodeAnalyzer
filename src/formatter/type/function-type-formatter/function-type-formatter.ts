import {IFormattedFunctionType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IFunctionTypeFormatter} from "./i-function-type-formatter";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {FunctionTypeNode, MethodSignature} from "typescript";
import {ParameterFormatterGetter} from "../../expression/parameter/parameter-formatter-getter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedFunctionType
 */
export class FunctionTypeFormatter extends FormattedExpressionFormatter implements IFunctionTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private parameterFormatter: ParameterFormatterGetter,
							 private typeFormatter: TypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the provided options into an IFormattedFunctionType.
	 * @param {MethodSignature|FunctionTypeNode} expression
	 * @returns {IFormattedFunctionType}
	 */
	public format (expression: MethodSignature|FunctionTypeNode): IFormattedFunctionType {
		const functionType: IFormattedFunctionType = {
			...super.format(expression),
			kind: FormattedTypeKind.FUNCTION,
			parameters: expression.parameters.map(parameter => this.parameterFormatter().format(parameter)),
			returns: this.typeFormatter().format(expression.type),
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(functionType, expression);

		// Override the 'toString()' method
		functionType.toString = () => this.stringify(functionType);
		return functionType;
	}

	/**
	 * Generates a string representation of the IFunctionType
	 * @param {IFormattedFunctionType} functionType
	 * @returns {string}
	 */
	private stringify (functionType: IFormattedFunctionType): string {
		let str = "";
		// Add the opening parenthesis
		str += "(";

		// If it has any arguments, stringify them
		if (functionType.parameters.length > 0) {
			str += `${functionType.parameters.map(parameter => parameter.toString()).join(",")}`;
		}

		// Add the closing parenthesis
		str += ")";

		// Add the return type divider
		str += ": ";

		// Add the return type
		str += functionType.returns.toString();

		return str;
	}

}