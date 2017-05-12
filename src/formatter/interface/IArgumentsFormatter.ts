import {CallExpression, NewExpression} from "typescript";
import {IArgument} from "../../service/interface/ISimpleLanguageService";

export interface IArgumentsFormatter {
	format (declaration: CallExpression | NewExpression): IArgument[];
}