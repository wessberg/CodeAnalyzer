import {CallExpression} from "typescript";
import {ICallExpression} from "../../service/interface/ISimpleLanguageService";

export interface ICallExpressionFormatter {
	format (statement: CallExpression): ICallExpression;
}