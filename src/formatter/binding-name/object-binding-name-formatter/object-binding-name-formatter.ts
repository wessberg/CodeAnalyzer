import {IObjectBindingNameFormatter} from "./i-object-binding-name-formatter";
import {IObjectBindingName} from "@wessberg/type";
import {BindingElement} from "typescript";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";

/**
 * A class for formatting IObjectBindingNames
 */
export class ObjectBindingNameFormatter implements IObjectBindingNameFormatter {
	constructor (private astUtil: ITypescriptASTUtil) {}

	/**
	 * Formats the provided BindingElement into an IObjectBindingName
	 * @param {BindingElement} bindingElement
	 * @returns {IObjectBindingName}
	 */
	public format (bindingElement: BindingElement): IObjectBindingName {
		const name = this.astUtil.takeName(bindingElement.name);
		const propertyName = bindingElement.propertyName == null ? name : this.astUtil.takeName(bindingElement.name);
		return {
			name,
			propertyName,
			isRestSpread: bindingElement.dotDotDotToken != null
		};
	}

}