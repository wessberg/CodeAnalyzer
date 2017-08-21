import {IArrayBindingNameFormatter} from "./i-array-binding-name-formatter";
import {ArrayBindingElement, isOmittedExpression, OmittedExpression} from "typescript";
import {ArrayBindingName, ArrayBindingNameKind} from "@wessberg/type";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";

/**
 * A class for formatting ArrayBindingNames
 */
export class ArrayBindingNameFormatter implements IArrayBindingNameFormatter {
	constructor (private astUtil: ITypescriptASTUtil) {
	}

	/**
	 * Formats the provided ArrayBindingElement or OmittedExpression into a ArrayBindingName
	 * @param {ArrayBindingElement | OmittedExpression} bindingElement
	 * @param {number} index
	 * @returns {ArrayBindingName}
	 */
	public format (bindingElement: ArrayBindingElement|OmittedExpression, index: number): ArrayBindingName {
		let arrayBindingName: ArrayBindingName;

		if (isOmittedExpression(bindingElement)) {
			arrayBindingName = {
				kind: ArrayBindingNameKind.SKIPPED,
				index
			};
		} else {
			const name = this.astUtil.takeName(bindingElement.name);
			const propertyName = bindingElement.propertyName == null ? name : this.astUtil.takeName(bindingElement.name);

			arrayBindingName = {
				kind: ArrayBindingNameKind.BOUND,
				index,
				name,
				propertyName,
				isRestSpread: bindingElement.dotDotDotToken != null
			};
		}

		// Override the 'toString()' method
		arrayBindingName.toString = () => this.stringify(arrayBindingName);
		return arrayBindingName;
	}

	/**
	 * Generates a string representation of the ArrayBindingName
	 * @param {IReferenceType} arrayBindingName
	 * @returns {string}
	 */
	private stringify (arrayBindingName: ArrayBindingName): string {
		if (arrayBindingName.kind === ArrayBindingNameKind.SKIPPED) return "";
		let str = "";
		if (arrayBindingName.isRestSpread) str += "...";
		str += arrayBindingName.name;
		return str;
	}
}