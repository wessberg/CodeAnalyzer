import {IIndexSignatureService} from "./i-index-signature-service";
import {IndexSignatureDeclaration} from "typescript";
import {IPrinter} from "@wessberg/typescript-ast-util";

/**
 * A service that helps with working with IndexSignatureDeclarations
 */
export class IndexSignatureService implements IIndexSignatureService {
	constructor (private printer: IPrinter) {
	}

	/**
	 * Gets the name of the type of an IndexSignatureDeclaration
	 * @param {IndexSignatureDeclaration} indexSignature
	 * @returns {string}
	 */
	public getTypeName (indexSignature: IndexSignatureDeclaration): string|undefined {
		return indexSignature.type == null ? undefined : this.printer.print(indexSignature.type);
	}

	/**
	 * Gets the name of an IndexSignatureDeclaration
	 * @param {IndexSignatureDeclaration} indexSignature
	 * @returns {string|undefined}
	 */
	public getName (indexSignature: IndexSignatureDeclaration): string|undefined {
		return indexSignature.name == null ? undefined : this.printer.print(indexSignature.name);
	}

}