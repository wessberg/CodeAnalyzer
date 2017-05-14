import {PropertyDeclaration} from "typescript";
import {IPropDeclaration} from "../../service/interface/ICodeAnalyzer";

export interface IPropFormatter {
	format (declaration: PropertyDeclaration, className: string): IPropDeclaration;
}