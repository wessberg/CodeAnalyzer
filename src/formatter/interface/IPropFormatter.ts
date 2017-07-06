import {PropertyDeclaration} from "typescript";
import {IPropDeclaration} from "../../identifier/interface/IIdentifier";

export interface IPropFormatter {
	format (declaration: PropertyDeclaration, className: string): IPropDeclaration;
}