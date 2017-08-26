import {IParameterTypeFormatter} from "./i-parameter-type-formatter";
import {isArrayBindingPattern, isObjectBindingPattern, ParameterDeclaration} from "typescript";
import {BindingNameKind, ParameterType} from "@wessberg/type";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {ArrayBindingNameFormatterGetter} from "../../binding-name/array-binding-name-formatter/array-binding-name-formatter-getter";
import {ObjectBindingNameFormatterGetter} from "../../binding-name/object-binding-name-formatter/object-binding-name-formatter-getter";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";

/**
 * A class that helps with formatting ParameterDeclarations inside type declarations
 */
export class ParameterTypeFormatter implements IParameterTypeFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private objectBindingNameFormatter: ObjectBindingNameFormatterGetter,
							 private arrayBindingNameFormatter: ArrayBindingNameFormatterGetter,
							 private typeFormatter: TypeFormatterGetter) {
	}

	/**
	 * Formats the provided ParameterDeclaration into a ParameterType.
	 * @param {ParameterDeclaration} member
	 * @returns {ParameterType}
	 */
	public format (member: ParameterDeclaration): ParameterType {
		const isRestSpread = member.dotDotDotToken != null;
		const optional = member.questionToken != null;
		const type = this.typeFormatter().format(member.type);
		let parameterType: ParameterType;

		if (isObjectBindingPattern(member.name)) {
			parameterType = {
				kind: BindingNameKind.OBJECT_BINDING,
				isRestSpread,
				optional,
				type,
				bindings: member.name.elements.map(element => this.objectBindingNameFormatter().format(element))
			};
		}

		else if (isArrayBindingPattern(member.name)) {
			parameterType = {
				kind: BindingNameKind.ARRAY_BINDING,
				isRestSpread,
				optional,
				type,
				bindings: member.name.elements.map((element, index) => this.arrayBindingNameFormatter().format(element, index))
			};
		}

		else {
			parameterType = {
				kind: BindingNameKind.NORMAL,
				isRestSpread,
				optional,
				type,
				name: this.astUtil.takeName(member.name)
			};
		}

		// Override the 'toString()' method
		parameterType.toString = () => this.stringify(parameterType);
		return parameterType;
	}

	/**
	 * Generates a string representation of the ParameterType
	 * @param {ParameterType} parameterType
	 * @returns {string}
	 */
	private stringify (parameterType: ParameterType): string {
		let str = "";
		if (parameterType.isRestSpread) str += "...";
		switch (parameterType.kind) {

			case BindingNameKind.NORMAL:
				str += parameterType.name;
				break;

			case BindingNameKind.ARRAY_BINDING:
				str += `[${parameterType.bindings.map(binding => binding.toString()).join(", ")}]`;
				break;

			case BindingNameKind.OBJECT_BINDING:
				str += `{${parameterType.bindings.map(binding => binding.toString()).join(", ")}}`;
				break;
		}
		// Add a '?' at the end of the parameter if it is optional

		if (parameterType.optional) str += "?";
		str += ": ";
		str += parameterType.type.toString();
		return str;
	}

}