import {FunctionDeclaration} from "typescript";
import {IFunctionDeclaration} from "../../service/interface/ICodeAnalyzer";
import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";

export interface IFunctionFormatter extends IFunctionLikeFormatter {
	format (declaration: FunctionDeclaration): IFunctionDeclaration;
}