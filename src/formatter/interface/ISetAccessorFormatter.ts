import {SetAccessorDeclaration} from "typescript";
import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";
import {ISetAccessorDeclaration} from "../../identifier/interface/IIdentifier";

export interface ISetAccessorFormatter extends IFunctionLikeFormatter {
	format (declaration: SetAccessorDeclaration, className: string): ISetAccessorDeclaration;
}