import {ArrowFunction} from "typescript";
import {IArrowFunction} from "../../service/interface/ICodeAnalyzer";
import {IFunctionLikeFormatter} from "./IFunctionLikeFormatter";

export interface IArrowFunctionFormatter extends IFunctionLikeFormatter {
	format (declaration: ArrowFunction): IArrowFunction;
}