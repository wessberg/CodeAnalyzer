import {IReferenceTypeFormatter} from "./i-reference-type-formatter";
import {IReferenceType, TypeKind} from "@wessberg/type";
import {isExpressionWithTypeArguments, isIdentifier} from "typescript";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IReferenceTypeFormatterFormatOptions} from "./i-reference-type-formatter-format-options";

/**
 * A class for generating IReferenceTypes
 */
export class ReferenceTypeFormatter implements IReferenceTypeFormatter {
	constructor (private astUtil: ITypescriptASTUtil) {
	}

	/**
	 * Formats the provided Expression into an IReferenceType
	 * @param {ExpressionWithTypeArguments | Identifier | TypeReferenceNode} node
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @param {ITypeFormatter} typeFormatter
	 * @returns {IReferenceType}
	 */
	public format ({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter}: IReferenceTypeFormatterFormatOptions): IReferenceType {
		let referenceType: IReferenceType;

		if (isExpressionWithTypeArguments(node)) {
			referenceType = {
				kind: TypeKind.REFERENCE,
				name: this.astUtil.takeName(node.expression),
				typeArguments: node.typeArguments == null ? [] : node.typeArguments.map(typeArgument => typeFormatter.format(typeArgument, interfaceTypeMemberFormatter, parameterTypeFormatter))
			};
		}

		else if (isIdentifier(node)) {
			referenceType = {
				kind: TypeKind.REFERENCE,
				name: this.astUtil.takeName(node),
				typeArguments: []
			};
		}

		else {
			referenceType = {
				kind: TypeKind.REFERENCE,
				name: this.astUtil.takeName(node.typeName),
				typeArguments: node.typeArguments == null ? [] : node.typeArguments.map(typeArgument => typeFormatter.format(typeArgument, interfaceTypeMemberFormatter, parameterTypeFormatter))
			};
		}

		// Override the 'toString()' method
		referenceType.toString = () => this.stringify(referenceType);
		return referenceType;
	}

	/**
	 * Generates a string representation of the IReferenceType
	 * @param {IReferenceType} referenceType
	 * @returns {string}
	 */
	private stringify (referenceType: IReferenceType): string {
		let str = "";
		// Add the name of the reference
		str += referenceType.name;

		// Add the type arguments if it has any
		if (referenceType.typeArguments.length > 0) {
			str += `<${referenceType.typeArguments.map(typeArgument => typeArgument.toString()).join(", ")}>`;
		}

		return str;
	}

}