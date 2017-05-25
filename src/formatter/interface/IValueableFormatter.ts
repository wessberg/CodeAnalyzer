import {Declaration, Expression, Node, Statement} from "typescript";
import {IValueable} from "../../service/interface/ICodeAnalyzer";

export interface IValueableFormatter {
	format (declaration: Statement|Expression|Node|Declaration|undefined, takeKey?: string|number, takeValueExpressionFrom?: Statement|Expression|Node|Declaration): IValueable;
}