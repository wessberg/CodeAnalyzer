import {IInterfaceType} from "@wessberg/type";
import {InterfaceDeclaration, NodeArray, Statement} from "typescript";

export interface IInterfaceTypeServiceBase {
	getInterfacesForFile (file: string): IInterfaceType[];
	getInterfacesForStatement (statement: InterfaceDeclaration): IInterfaceType[];
	getInterfacesForStatements (statements: NodeArray<Statement>): IInterfaceType[];
}