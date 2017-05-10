import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";
import {IFunctionDeclaration} from "../../service/interface/ISimpleLanguageService";
import {FunctionDeclaration} from "typescript";

export interface IFunctionFormatter extends IFunctionLikeFormatter {
	format (declaration: FunctionDeclaration): IFunctionDeclaration;
}