import {IComputedPropertyNameService} from "./i-computed-property-name-service";
import {IPrinter} from "@wessberg/typescript-ast-util";
import {ComputedPropertyName} from "typescript";

/**
 * A service for working with ComputedPropertyNames
 */
export class ComputedPropertyNameService implements IComputedPropertyNameService {

	constructor (private readonly printer: IPrinter) {
	}

	/**
	 * Gets the stringified expression of a ComputedPropertyName
	 * @param {ComputedPropertyName} computedPropertyName
	 * @returns {string}
	 */
	public getExpression (computedPropertyName: ComputedPropertyName): string {
		return this.printer.print(computedPropertyName.expression);
	}
}