import {IEnumDeclaration} from "../../interface/ISimpleLanguageService";
import {EnumDeclaration} from "typescript";

export interface IEnumFormatter {
	format (statement: EnumDeclaration): IEnumDeclaration;
}