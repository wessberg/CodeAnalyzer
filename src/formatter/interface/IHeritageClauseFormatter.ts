import {HeritageClause, NodeArray} from "typescript";
import {IHeritage} from "../../service/interface/ICodeAnalyzer";

export interface IHeritageClauseFormatter {
	format (clauses: NodeArray<HeritageClause>): IHeritage;
}