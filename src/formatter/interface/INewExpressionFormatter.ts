import {NewExpression} from "typescript";
import {INewExpression} from "../../service/interface/ICodeAnalyzer";

export interface INewExpressionFormatter {
	format (statement: NewExpression): INewExpression;
}