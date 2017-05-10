import {HeritageClause, NodeArray} from "typescript";
import {IHeritage} from "../../service/interface/ISimpleLanguageService";

export interface IHeritageClauseFormatter {
	format (clauses: NodeArray<HeritageClause>): IHeritage;
}