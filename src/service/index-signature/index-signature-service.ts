import {IIndexSignatureService} from "./i-index-signature-service";
import {IndexSignatureDeclaration} from "typescript";
import {IPropertyNameService} from "../property-name/i-property-name-service";
import {ITypeNodeService} from "../type-node/i-type-node-service";

/**
 * A service that helps with working with IndexSignatureDeclarations
 */
export class IndexSignatureService implements IIndexSignatureService {
	constructor (private propertyNameService: IPropertyNameService,
							 private typeNodeService: ITypeNodeService) {
	}

	/**
	 * Gets the name of the type of an IndexSignatureDeclaration
	 * @param {IndexSignatureDeclaration} indexSignature
	 * @returns {string}
	 */
	public getTypeName (indexSignature: IndexSignatureDeclaration): string|undefined {
		return indexSignature.type == null ? undefined : this.typeNodeService.getNameOfType(indexSignature.type);
	}

	/**
	 * Gets the name of an IndexSignatureDeclaration
	 * @param {IndexSignatureDeclaration} indexSignature
	 * @returns {string|undefined}
	 */
	public getName (indexSignature: IndexSignatureDeclaration): string|undefined {
		return indexSignature.name == null ? undefined : this.propertyNameService.getName(indexSignature.name);
	}

}