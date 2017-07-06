import {NewExpression} from "typescript";
import {INewExpression} from "../../identifier/interface/IIdentifier";

export interface INewExpressionFormatter {
	format (statement: NewExpression): INewExpression;
}