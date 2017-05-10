import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";
import {IMethodDeclaration} from "../../service/interface/ISimpleLanguageService";
import {MethodDeclaration} from "typescript";

export interface IMethodFormatter extends IFunctionLikeFormatter {
	format (declaration: MethodDeclaration, className: string): IMethodDeclaration;
}