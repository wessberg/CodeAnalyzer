import {IConstructorDeclaration} from "../../interface/ISimpleLanguageService";
import {ConstructorDeclaration} from "typescript";
import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";

export interface IConstructorFormatter extends IFunctionLikeFormatter {
	format (declaration: ConstructorDeclaration, className: string): IConstructorDeclaration;
}