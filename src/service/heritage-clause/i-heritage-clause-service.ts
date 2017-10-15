import {ExpressionWithTypeArguments, HeritageClause} from "typescript";

export interface IHeritageClauseService {
	isImplementsClause (clause: HeritageClause): boolean;
	isExtendsClause (clause: HeritageClause): boolean;
	hasTypeWithName (name: string|ExpressionWithTypeArguments, clause: HeritageClause): boolean;
	getTypeNames (clause: HeritageClause): string[];
}