import {ConstructorDeclaration} from "typescript";
import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";
import {IConstructorDeclaration} from "../../identifier/interface/IIdentifier";

export interface IConstructorFormatter extends IFunctionLikeFormatter {
	format (declaration: ConstructorDeclaration, className: string): IConstructorDeclaration;
}