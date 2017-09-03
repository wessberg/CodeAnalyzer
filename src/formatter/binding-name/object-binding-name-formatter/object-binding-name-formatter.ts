import {IObjectBindingNameFormatter} from "./i-object-binding-name-formatter";
import {IObjectBindingName} from "@wessberg/type";
import {BindingElement} from "typescript";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";

/**
 * A class for formatting IObjectBindingNames
 */
export class ObjectBindingNameFormatter implements IObjectBindingNameFormatter {
	constructor (private astUtil: ITypescriptASTUtil) {
	}

	/**
	 * Formats the provided BindingElement into an IObjectBindingName
	 * @param {BindingElement} bindingElement
	 * @returns {IObjectBindingName}
	 */
	public format (bindingElement: BindingElement): IObjectBindingName {
		const name = this.astUtil.takeName(bindingElement.name);
		const propertyName = bindingElement.propertyName == null ? name : this.astUtil.takeName(bindingElement.name);
		const objectBindingName: IObjectBindingName = {
			name,
			propertyName,
			isRestSpread: bindingElement.dotDotDotToken != null
		};

		// Override the 'toString()' method
		objectBindingName.toString = () => this.stringify(objectBindingName);
		return objectBindingName;
	}

	/**
	 * Generates a string representation of the ArrayBindingName
	 * @param {IObjectBindingName} objectBindingName
	 * @returns {string}
	 */
	private stringify (objectBindingName: IObjectBindingName): string {
		let str = "";

		if (objectBindingName.isRestSpread) {
			str += "...";
		}
		// Add the property name
		str += objectBindingName.propertyName;

		// If the binding is given another name than the property, add it to the string
		if (objectBindingName.name !== objectBindingName.propertyName) {
			str += `: ${objectBindingName.name}`;
		}
		return str;
	}

}