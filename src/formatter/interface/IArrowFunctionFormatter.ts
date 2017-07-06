import {ArrowFunction} from "typescript";
import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";
import {IArrowFunction} from "../../identifier/interface/IIdentifier";

export interface IArrowFunctionFormatter extends IFunctionLikeFormatter {
	format (declaration: ArrowFunction): IArrowFunction;
}