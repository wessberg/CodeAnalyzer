import {ISourceFileProperties} from "../../service/interface/ISimpleLanguageService";
import {Statement, Node, Expression} from "typescript";

export interface ISourceFilePropertiesGetter {
	getSourceFileProperties (statement: Statement | Node | Expression): ISourceFileProperties;
}