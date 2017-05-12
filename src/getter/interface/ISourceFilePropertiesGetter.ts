import {Expression, Node, Statement} from "typescript";
import {ISourceFileProperties} from "../../service/interface/ISimpleLanguageService";

export interface ISourceFilePropertiesGetter {
	getSourceFileProperties (statement: Statement | Node | Expression): ISourceFileProperties;
}