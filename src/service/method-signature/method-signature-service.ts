import {IMethodSignatureService} from "./i-method-signature-service";
import {MethodSignature} from "typescript";
import {IPropertyNameService} from "../property-name/i-property-name-service";
import {ITypeNodeService} from "../type-node/i-type-node-service";

/**
 * A service that helps with working with MethodSignatures
 */
export class MethodSignatureService implements IMethodSignatureService {
	constructor (private readonly propertyNameService: IPropertyNameService,
							 private readonly typeNodeService: ITypeNodeService) {
	}

	/**
	 * Gets the name of a MethodSignature type
	 * @param {MethodSignature} methodSignature
	 * @returns {string}
	 */
	public getTypeName (methodSignature: MethodSignature): string|undefined {
		return methodSignature.type == null ? undefined : this.typeNodeService.getNameOfType(methodSignature.type);
	}

	/**
	 * Gets the name of a MethodSignature
	 * @param {MethodSignature} methodSignature
	 * @returns {string}
	 */
	public getName (methodSignature: MethodSignature): string {
		return this.propertyNameService.getName(methodSignature.name);
	}

}