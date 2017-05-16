import {CallExpression} from "typescript";
import {ICallExpression} from "../../service/interface/ICodeAnalyzer";

export interface ICallExpressionFormatter {
	format (statement: CallExpression): ICallExpression;
}