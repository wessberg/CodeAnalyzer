import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";
import {IFunctionDeclaration} from "../../interface/ISimpleLanguageService";
import {FunctionDeclaration} from "typescript";

export interface IFunctionFormatter extends IFunctionLikeFormatter {
	format (declaration: FunctionDeclaration): IFunctionDeclaration;
}