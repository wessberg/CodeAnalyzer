import {IFunctionType, TypeKind} from "@wessberg/type";
import {IFunctionTypeFormatter} from "./i-function-type-formatter";
import {IFunctionTypeFormatterFormatOptions} from "./i-function-type-formatter-format-options";

/**
 * A class for generating IFunctionTypes
 */
export class FunctionTypeFormatter implements IFunctionTypeFormatter {

	/**
	 * Formats the provided options into an IFunctionType.
	 * @param {MethodSignature|FunctionTypeNode} node
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @param {ITypeFormatter} typeFormatter
	 * @returns {IFunctionType}
	 */
	public format ({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter}: IFunctionTypeFormatterFormatOptions): IFunctionType {
		let functionType: IFunctionType;

		functionType = {
			kind: TypeKind.FUNCTION,
			parameters: node.parameters.map(parameter => parameterTypeFormatter.format(parameter, interfaceTypeMemberFormatter)),
			returns: typeFormatter.format(node.type, interfaceTypeMemberFormatter, parameterTypeFormatter)
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