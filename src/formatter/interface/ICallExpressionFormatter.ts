import {ICallExpression} from "../../service/interface/ISimpleLanguageService";
import {CallExpression} from "typescript";

export interface ICallExpressionFormatter {
	format (statement: CallExpression): ICallExpression;
}