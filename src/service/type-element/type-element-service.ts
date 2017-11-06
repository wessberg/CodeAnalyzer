import {ITypeElementService} from "./i-type-element-service";
import {TypeElement} from "typescript";
import {IPropertyNameService} from "../property-name/i-property-name-service";

/**
 * A service for working with TypeElements
 */
export class TypeElementService implements ITypeElementService {
	constructor (private propertyNameService: IPropertyNameService) {
	}

	/**
	 * Returns true if the provided TypeElement has a questionToken
	 * @param {TypeElement} typeElement
	 * @returns {boolean}
	 */
	public isOptional (typeElement: TypeElement): boolean {
		return typeElement.questionToken != null;
	}

	/**
	 * Returns the name of the given TypeElement
	 * @param {TypeElement} typeElement
	 * @returns {string}
	 */
	public getName (typeElement: TypeElement): string|undefined {
		return typeElement.name == null ? undefined : this.propertyNameService.getName(typeElement.name);
	}
}