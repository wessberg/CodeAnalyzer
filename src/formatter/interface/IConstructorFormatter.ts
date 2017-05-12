import {ConstructorDeclaration} from "typescript";
import {IConstructorDeclaration} from "../../service/interface/ISimpleLanguageService";
import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";

export interface IConstructorFormatter extends IFunctionLikeFormatter {
	format (declaration: ConstructorDeclaration, className: string): IConstructorDeclaration;
}