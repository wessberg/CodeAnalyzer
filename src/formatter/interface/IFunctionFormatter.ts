import {FunctionDeclaration} from "typescript";
import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";
import {IFunctionDeclaration} from "../../identifier/interface/IIdentifier";

export interface IFunctionFormatter extends IFunctionLikeFormatter {
	format (declaration: FunctionDeclaration): IFunctionDeclaration;
}