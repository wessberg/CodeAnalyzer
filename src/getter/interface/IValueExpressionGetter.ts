import {Expression, Node, Statement} from "typescript";
import {InitializationValue} from "../../identifier/interface/IIdentifier";

export interface IValueExpressionGetter {
	getValueExpression (rawStatement: Statement|Expression|Node): InitializationValue;
}