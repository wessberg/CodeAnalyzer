import {ITypeNodeService} from "./i-type-node-service";
import {TypeNode} from "typescript";
import {IPrinter} from "@wessberg/typescript-ast-util";

/**
 * A service for working with TypeNodes
 */
export class TypeNodeService implements ITypeNodeService {
	constructor (private printer: IPrinter) {}

	/**
	 * Gets the name of a TypeNode
	 * @param {TypeNode} type
	 * @returns {string}
	 */
	public getNameOfType (type: TypeNode): string {
		return this.printer.print(type);
	}
}