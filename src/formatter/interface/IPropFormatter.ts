import {PropertyDeclaration} from "typescript";
import {IPropDeclaration} from "../../service/interface/ISimpleLanguageService";

export interface IPropFormatter {
	format (declaration: PropertyDeclaration, className: string): IPropDeclaration;
}