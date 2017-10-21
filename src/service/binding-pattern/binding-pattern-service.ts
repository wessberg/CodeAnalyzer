import {IBindingPatternService} from "./i-binding-pattern-service";
import {BindingPattern} from "typescript";
import {IPrinter} from "@wessberg/typescript-ast-util";

/**
 * A service for working with BindingPatterns
 */
export class BindingPatternService implements IBindingPatternService {
	constructor (private printer: IPrinter) {
	}

	/**
	 * Gets the text of a BindingPattern
	 * @param {ts.BindingPattern} bindingPattern
	 * @returns {string}
	 */
	public getText (bindingPattern: BindingPattern): string {
		return this.printer.print(bindingPattern);
	}
}