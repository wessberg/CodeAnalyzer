import {CallExpression, NewExpression} from "typescript";
import {IArgument} from "../../identifier/interface/IIdentifier";

export interface IArgumentsFormatter {
	format (declaration: CallExpression|NewExpression): IArgument[];
}