import {CallExpression, NewExpression} from "typescript";
import {IArgument} from "../../service/interface/ICodeAnalyzer";

export interface IArgumentsFormatter {
	format (declaration: CallExpression | NewExpression): IArgument[];
}