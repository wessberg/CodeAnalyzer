import {ClassDeclaration} from "typescript";
import {IClassDeclaration} from "../../service/interface/ISimpleLanguageService";

export interface IClassFormatter {
	format (statement: ClassDeclaration): IClassDeclaration
}