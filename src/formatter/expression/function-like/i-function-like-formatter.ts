import {FunctionLikeDeclaration} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedFunctionLike} from "@wessberg/type";

export interface IFunctionLikeFormatter extends IFormattedExpressionFormatter {
	format (expression: FunctionLikeDeclaration): IFormattedFunctionLike;
}