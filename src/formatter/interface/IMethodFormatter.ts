import {MethodDeclaration} from "typescript";
import {IMethodDeclaration} from "../../service/interface/ISimpleLanguageService";
import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";

export interface IMethodFormatter extends IFunctionLikeFormatter {
	format (declaration: MethodDeclaration, className: string): IMethodDeclaration;
}