import {NewExpression} from "typescript";
import {INewExpression} from "../../interface/ISimpleLanguageService";

export interface INewExpressionFormatter {
	format (statement: NewExpression): INewExpression;
}