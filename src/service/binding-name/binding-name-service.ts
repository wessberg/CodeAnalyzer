import {IBindingNameService} from "./i-binding-name-service";
import {BindingName, isIdentifier} from "typescript";
import {IIdentifierService} from "../identifier/i-identifier-service";
import {IBindingPatternService} from "../binding-pattern/i-binding-pattern-service";

/**
 * A service for working with BindingNames
 */
export class BindingNameService implements IBindingNameService {
	constructor (private identifierService: IIdentifierService,
							 private bindingPatternService: IBindingPatternService) {
	}

	/**
	 * Gets the stringified name of a BindingName
	 * @param {BindingName} bindingName
	 * @returns {string}
	 */
	public getName (bindingName: BindingName): string {
		if (isIdentifier(bindingName)) return this.identifierService.getText(bindingName);
		return this.bindingPatternService.getText(bindingName);
	}

}