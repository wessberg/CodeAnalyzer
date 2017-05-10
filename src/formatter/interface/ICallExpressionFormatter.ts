import {ICallExpression} from "../../interface/ISimpleLanguageService";
import {CallExpression} from "typescript";

export interface ICallExpressionFormatter {
	format (statement: CallExpression): ICallExpression;
}