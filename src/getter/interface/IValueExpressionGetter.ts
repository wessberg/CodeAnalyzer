import {Expression, Node, Statement} from "typescript";
import {InitializationValue} from "../../service/interface/ICodeAnalyzer";

export interface IValueExpressionGetter {
	getValueExpression (rawStatement: Statement|Expression|Node): InitializationValue;
}