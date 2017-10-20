import {TypeNode} from "typescript";

export interface ITypeNodeService {
	getNameOfType (type: TypeNode): string;
}