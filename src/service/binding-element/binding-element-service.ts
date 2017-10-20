import {IBindingElementService} from "./i-binding-element-service";
import {BindingElement} from "typescript";
import {IPrinter} from "@wessberg/typescript-ast-util";
import {IPropertyNameService} from "../property-name/i-property-name-service";

/**
 * A service for working with BindingElements
 */
export class BindingElementService implements IBindingElementService {
	constructor (private printer: IPrinter,
							 private propertyNameService: IPropertyNameService) {
	}

	/**
	 * Gets the name of a BindingElement
	 * @param {BindingElement} bindingElement
	 * @returns {string}
	 */
	public getName (bindingElement: BindingElement): string {
		return this.printer.print(bindingElement.name);
	}

	/**
	 * Gets the propertyName name of a BindingElement
	 * @param {BindingElement} bindingElement
	 * @returns {string}
	 */
	public getPropertyName (bindingElement: BindingElement): string|undefined {
		return bindingElement.propertyName == null ? undefined : this.propertyNameService.getName(bindingElement.propertyName);
	}

	/**
	 * Gets the stringified initializer expression of a BindingElement
	 * @param {BindingElement} bindingElement
	 * @returns {string}
	 */
	public getInitializer (bindingElement: BindingElement): string|undefined {
		return bindingElement.initializer == null ? undefined : this.printer.print(bindingElement.initializer);
	}

	/**
	 * Returns true if the given BindingElement has a dotDotDotToken
	 * @param {BindingElement} bindingElement
	 * @returns {boolean}
	 */
	public isRestSpread (bindingElement: BindingElement): boolean {
		return bindingElement.dotDotDotToken != null;
	}

}