import {EnumDeclaration} from "typescript";
import {IEnumDeclaration} from "../../service/interface/ISimpleLanguageService";

export interface IEnumFormatter {
	format (statement: EnumDeclaration): IEnumDeclaration;
}