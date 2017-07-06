import {ClassDeclaration} from "typescript";
import {IClassDeclaration} from "../../identifier/interface/IIdentifier";

export interface IClassFormatter {
	format (statement: ClassDeclaration): IClassDeclaration;
}