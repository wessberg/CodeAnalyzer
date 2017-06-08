import {GetAccessorDeclaration} from "typescript";
import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";
import {IGetAccessorDeclaration} from "../../service/interface/ICodeAnalyzer";

export interface IGetAccessorFormatter extends IFunctionLikeFormatter {
	format (declaration: GetAccessorDeclaration, className: string): IGetAccessorDeclaration;
}