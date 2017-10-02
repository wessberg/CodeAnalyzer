import {ITypeService} from "./i-type-service";
import {TypeNode, TypeParameterDeclaration} from "typescript";
import {IFormatter} from "../../formatter/i-formatter-getter";

/**
 * A service for working with Types
 */
export class TypeService implements ITypeService {
	constructor (private formatter: IFormatter) {
	}

	/**
	 * Creates a TypeParameterDeclaration from the provided string representation of it
	 * @param {string} type
	 * @returns {TypeParameterDeclaration}
	 */
	public createTypeParameterDeclaration (type: string): TypeParameterDeclaration {
		return this.formatter.formatTypeParameter(type);
	}

	/**
	 * Creates a TypeNode from the provided string representation of it
	 * @param {string} type
	 * @returns {TypeNode}
	 */
	public createTypeNode (type: string): TypeNode {
		return this.formatter.formatType(type);
	}
}