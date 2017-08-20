import {IInterfaceType} from "@wessberg/type";
import {InterfaceDeclaration} from "typescript";

export interface IInterfaceTypeFormatter {
	format (statement: InterfaceDeclaration): IInterfaceType;
}