import {IFormattedInterfaceType} from "@wessberg/type";
import {InterfaceDeclaration, NodeArray, Statement} from "typescript";

export interface IInterfaceTypeServiceBase {
	getInterfacesForFile (file: string, content?: string): IFormattedInterfaceType[];
	getInterfacesForStatement (statement: InterfaceDeclaration): IFormattedInterfaceType[];
	getInterfacesForStatements (statements: NodeArray<Statement>): IFormattedInterfaceType[];
}