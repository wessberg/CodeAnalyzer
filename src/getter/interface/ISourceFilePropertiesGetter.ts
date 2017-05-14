import {Expression, Node, Statement} from "typescript";
import {ISourceFileProperties} from "../../service/interface/ICodeAnalyzer";

export interface ISourceFilePropertiesGetter {
	getSourceFileProperties (statement: Statement|Node|Expression): ISourceFileProperties;
}