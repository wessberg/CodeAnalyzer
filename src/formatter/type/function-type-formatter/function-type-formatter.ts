import {IFunctionType, TypeKind} from "@wessberg/type";
import {IFunctionTypeFormatter} from "./i-function-type-formatter";
import {IFunctionTypeFormatterFormatOptions} from "./i-function-type-formatter-format-options";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";
import {ParameterTypeFormatterGetter} from "../parameter-type-formatter/parameter-type-formatter-getter";

/**
 * A class for generating IFunctionTypes
 */
export class FunctionTypeFormatter implements IFunctionTypeFormatter {
	constructor (private parameterTypeFormatter: ParameterTypeFormatterGetter,
							 private typeFormatter: TypeFormatterGetter) {
	}

	/**
	 * Formats the provided options into an IFunctionType.
	 * @param {MethodSignature|FunctionTypeNode} node
	 * @returns {IFunctionType}
	 */
	public format ({node}: IFunctionTypeFormatterFormatOptions): IFunctionType {
		const functionType: IFunctionType = {
			kind: TypeKind.FUNCTION,
			parameters: node.parameters.map(parameter => this.parameterTypeFormatter().format(parameter)),
			returns: this.typeFormatter().format(node.type)
		};

		// Override the 'toString()' method
		functionType.toString = () => this.stringify(functionType);
		return functionType;
	}

	/**
	 * Generates a string representation of the IFunctionType
	 * @param {IFunctionType} functionType
	 * @returns {string}
	 */
	private stringify (functionType: IFunctionType): string {
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