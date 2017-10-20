import {ExpressionWithTypeArguments, HeritageClause} from "typescript";
import {INameWithTypeArguments} from "../../light-ast/dict/name-with-type-arguments/i-name-with-type-arguments";

export interface IHeritageClauseService {
	isImplementsClause (clause: HeritageClause): boolean;
	isExtendsClause (clause: HeritageClause): boolean;
	hasTypeWithName (name: string|ExpressionWithTypeArguments, clause: HeritageClause): boolean;
	getTypeNames (clause: HeritageClause): string[];
	getFirstTypeName (clause: HeritageClause): string;
	getTypeNamesWithArguments (clause: HeritageClause): INameWithTypeArguments[];
	getFirstTypeNameWithArguments (clause: HeritageClause): INameWithTypeArguments;
}