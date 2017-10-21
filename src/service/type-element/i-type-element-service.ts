import {TypeElement} from "typescript";

export interface ITypeElementService {
	isOptional (typeElement: TypeElement): boolean;
	getName (typeElement: TypeElement): string|undefined;
}