import {MethodDeclaration} from "typescript";
import {IMethodDeclaration} from "../../service/interface/ICodeAnalyzer";
import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";

export interface IMethodFormatter extends IFunctionLikeFormatter {
	format (declaration: MethodDeclaration, className: string): IMethodDeclaration;
}