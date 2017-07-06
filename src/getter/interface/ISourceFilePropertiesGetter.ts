import {Expression, Node, Statement} from "typescript";
import {ISourceFileProperties} from "../../identifier/interface/IIdentifier";

export interface ISourceFilePropertiesGetter {
	getSourceFileProperties (statement: Statement|Node|Expression): ISourceFileProperties;
}