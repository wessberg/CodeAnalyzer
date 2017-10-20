import {IMethodSignatureService} from "./i-method-signature-service";
import {IPrinter} from "@wessberg/typescript-ast-util";
import {MethodSignature} from "typescript";

/**
 * A service that helps with working with MethodSignatures
 */
export class MethodSignatureService implements IMethodSignatureService {
	constructor (private printer: IPrinter) {
	}

	/**
	 * Gets the name of a MethodSignature type
	 * @param {MethodSignature} methodSignature
	 * @returns {string}
	 */
	public getTypeName (methodSignature: MethodSignature): string|undefined {
		return methodSignature.type == null ? undefined : this.printer.print(methodSignature.type);
	}

	/**
	 * Gets the name of a MethodSignature
	 * @param {MethodSignature} methodSignature
	 * @returns {string}
	 */
	public getName (methodSignature: MethodSignature): string {
		return this.printer.print(methodSignature.name);
	}

}