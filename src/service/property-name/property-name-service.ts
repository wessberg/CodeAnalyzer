import {IPropertyNameService} from "./i-property-name-service";
import {isIdentifier, isNumericLiteral, isStringLiteral, PropertyName} from "typescript";
import {IIdentifierService} from "../identifier/i-identifier-service";
import {IStringLiteralService} from "../string-literal/i-string-literal-service";
import {INumericLiteralService} from "../numeric-literal/i-numeric-literal-service";
import {IComputedPropertyNameService} from "../computed-property-name/i-computed-property-name-service";

/**
 * A service for working with PropertyNames
 */
export class PropertyNameService implements IPropertyNameService {
	constructor (private identifierService: IIdentifierService,
							 private stringLiteralService: IStringLiteralService,
							 private numericLiteralService: INumericLiteralService,
							 private computedPropertyNameService: IComputedPropertyNameService) {
	}

	/**
	 * Gets the name of a PropertyName
	 * @param {PropertyName} propertyName
	 * @returns {string}
	 */
	public getName (propertyName: PropertyName): string {
		if (isIdentifier(propertyName)) return this.identifierService.getText(propertyName);
		if (isStringLiteral(propertyName)) return this.stringLiteralService.getText(propertyName);
		if (isNumericLiteral(propertyName)) return this.numericLiteralService.getText(propertyName);
		return this.computedPropertyNameService.getExpression(propertyName);
	}

}