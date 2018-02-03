import {IPropertySignatureService} from "./i-property-signature-service";
import {IPrinter} from "@wessberg/typescript-ast-util";
import {PropertySignature} from "typescript";
import {ITypeNodeService} from "../type-node/i-type-node-service";

/**
 * A service that helps with working with PropertySignatures
 */
export class PropertySignatureService implements IPropertySignatureService {
	constructor (private readonly printer: IPrinter,
							 private readonly typeNodeService: ITypeNodeService) {
	}

	/**
	 * Gets the string representation of the expression of a PropertySignature, if it has one
	 * @param {PropertySignature} propertySignature
	 * @returns {string}
	 */
	public getExpression (propertySignature: PropertySignature): string|undefined {
		return propertySignature.initializer == null ? undefined : this.printer.print(propertySignature.initializer);
	}

	/**
	 * Gets the name of a PropertySignature type
	 * @param {PropertySignature} propertySignature
	 * @returns {string}
	 */
	public getTypeName (propertySignature: PropertySignature): string|undefined {
		return propertySignature.type == null ? undefined : this.typeNodeService.getNameOfType(propertySignature.type);
	}

}