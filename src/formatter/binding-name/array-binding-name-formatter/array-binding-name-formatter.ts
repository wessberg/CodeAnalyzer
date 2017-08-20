import {IArrayBindingNameFormatter} from "./i-array-binding-name-formatter";
import {ArrayBindingElement, isOmittedExpression, OmittedExpression} from "typescript";
import {ArrayBindingName, ArrayBindingNameKind} from "@wessberg/type";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";

/**
 * A class for formatting ArrayBindingNames
 */
export class ArrayBindingNameFormatter implements IArrayBindingNameFormatter {
	constructor (private astUtil: ITypescriptASTUtil) {}

	/**
	 * Formats the provided ArrayBindingElement or OmittedExpression into a ArrayBindingName
	 * @param {ArrayBindingElement | OmittedExpression} bindingElement
	 * @param {number} index
	 * @returns {ArrayBindingName}
	 */
	public format (bindingElement: ArrayBindingElement|OmittedExpression, index: number): ArrayBindingName {
		if (isOmittedExpression(bindingElement)) {
			return {
				kind: ArrayBindingNameKind.SKIPPED,
				index
			};
		}

		const name = this.astUtil.takeName(bindingElement.name);
		const propertyName = bindingElement.propertyName == null ? name : this.astUtil.takeName(bindingElement.name);

		return {
			kind: ArrayBindingNameKind.BOUND,
			index,
			name,
			propertyName,
			isRestSpread: bindingElement.dotDotDotToken != null
		};
	}
}