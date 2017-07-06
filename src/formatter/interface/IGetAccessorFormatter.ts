import {GetAccessorDeclaration} from "typescript";
import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";
import {IGetAccessorDeclaration} from "../../identifier/interface/IIdentifier";

export interface IGetAccessorFormatter extends IFunctionLikeFormatter {
	format (declaration: GetAccessorDeclaration, className: string): IGetAccessorDeclaration;
}