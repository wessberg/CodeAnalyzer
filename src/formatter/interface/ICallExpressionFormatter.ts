import {CallExpression} from "typescript";
import {ICallExpression} from "../../identifier/interface/IIdentifier";

export interface ICallExpressionFormatter {
	format (statement: CallExpression): ICallExpression;
}