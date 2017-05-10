import {IPropDeclaration} from "../../service/interface/ISimpleLanguageService";
import {PropertyDeclaration} from "typescript";

export interface IPropFormatter {
	format (declaration: PropertyDeclaration, className: string): IPropDeclaration;
}