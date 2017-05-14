import {Expression, Node, Statement} from "typescript";
import {IIdentifier} from "../../service/interface/ICodeAnalyzer";

export interface IMapper {
	set (identifier: IIdentifier, statement: Statement | Expression | Node): void;
	get (identifier: IIdentifier): Statement | Expression | Node | undefined;
}