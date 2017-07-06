import {MethodDeclaration} from "typescript";
import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";
import {IMethodDeclaration} from "../../identifier/interface/IIdentifier";

export interface IMethodFormatter extends IFunctionLikeFormatter {
	format (declaration: MethodDeclaration, className: string): IMethodDeclaration;
}