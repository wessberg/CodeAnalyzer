import {HeritageClause, NodeArray} from "typescript";
import {IHeritage} from "../../identifier/interface/IIdentifier";

export interface IHeritageClauseFormatter {
	format (clauses: NodeArray<HeritageClause>): IHeritage;
}