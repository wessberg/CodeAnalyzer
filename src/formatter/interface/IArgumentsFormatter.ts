import {IArgument} from "../../service/interface/ISimpleLanguageService";
import {CallExpression, NewExpression} from "typescript";

export interface IArgumentsFormatter {
	format (declaration: CallExpression | NewExpression): IArgument[];
}