import {SetAccessorDeclaration} from "typescript";
import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";
import {ISetAccessorDeclaration} from "../../service/interface/ICodeAnalyzer";

export interface ISetAccessorFormatter extends IFunctionLikeFormatter {
	format (declaration: SetAccessorDeclaration, className: string): ISetAccessorDeclaration;
}