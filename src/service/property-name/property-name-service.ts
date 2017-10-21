import {IPropertyNameService} from "./i-property-name-service";
import {PropertyName} from "typescript";
import {IPrinter} from "@wessberg/typescript-ast-util";

/**
 * A service for working with PropertyNames
 */
export class PropertyNameService implements IPropertyNameService {
	constructor (private printer: IPrinter) {
	}

	/**
	 * Gets the name of a PropertyName
	 * @param {PropertyName} propertyName
	 * @returns {string}
	 */
	public getName (propertyName: PropertyName): string {
		return this.printer.print(propertyName);
	}

}