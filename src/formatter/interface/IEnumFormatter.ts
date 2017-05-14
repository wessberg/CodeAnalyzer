import {EnumDeclaration} from "typescript";
import {IEnumDeclaration} from "../../service/interface/ICodeAnalyzer";

export interface IEnumFormatter {
	format (statement: EnumDeclaration): IEnumDeclaration;
}