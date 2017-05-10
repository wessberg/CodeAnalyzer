import {NewExpression} from "typescript";
import {INewExpression} from "../../service/interface/ISimpleLanguageService";

export interface INewExpressionFormatter {
	format (statement: NewExpression): INewExpression;
}