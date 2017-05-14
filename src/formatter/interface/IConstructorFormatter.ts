import {ConstructorDeclaration} from "typescript";
import {IConstructorDeclaration} from "../../service/interface/ICodeAnalyzer";
import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";

export interface IConstructorFormatter extends IFunctionLikeFormatter {
	format (declaration: ConstructorDeclaration, className: string): IConstructorDeclaration;
}