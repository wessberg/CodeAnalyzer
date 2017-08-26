import {IReferenceTypeFormatter} from "./i-reference-type-formatter";
import {IReferenceType, TypeKind} from "@wessberg/type";
import {isExpressionWithTypeArguments, isIdentifier} from "typescript";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IReferenceTypeFormatterFormatOptions} from "./i-reference-type-formatter-format-options";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";

/**
 * A class for generating IReferenceTypes
 */
export class ReferenceTypeFormatter implements IReferenceTypeFormatter {
	constructor (private astUtil: ITypescriptASTUtil, private typeFormatter: TypeFormatterGetter) {
	}

	/**
	 * Formats the provided Expression into an IReferenceType
	 * @param {ExpressionWithTypeArguments | Identifier | TypeReferenceNode} node
	 * @returns {IReferenceType}
	 */
	public format ({node}: IReferenceTypeFormatterFormatOptions): IReferenceType {
		let referenceType: IReferenceType;

		if (isExpressionWithTypeArguments(node)) {
			referenceType = {
				kind: TypeKind.REFERENCE,
				name: this.astUtil.takeName(node.expression),
				typeArguments: node.typeArguments == null ? [] : node.typeArguments.map(typeArgument => this.typeFormatter().format(typeArgument))
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
				typeArguments: node.typeArguments == null ? [] : node.typeArguments.map(typeArgument => this.typeFormatter().format(typeArgument))
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