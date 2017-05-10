import {ClassDeclaration} from "typescript";
import {IClassDeclaration} from "../../interface/ISimpleLanguageService";

export interface IClassFormatter {
	format (statement: ClassDeclaration): IClassDeclaration
}