import {ClassDeclaration} from "typescript";
import {IClassDeclaration} from "../../service/interface/ICodeAnalyzer";

export interface IClassFormatter {
	format (statement: ClassDeclaration): IClassDeclaration;
}