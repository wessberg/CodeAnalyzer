import {Block, ClassElement, Expression, HeritageClause, NamedExports, NamedImports, NodeArray, Statement} from "typescript";
import {IPlacement} from "../placement/i-placement";

export interface IJoinerBase {
	joinHeritageClauses (...clauses: (HeritageClause|undefined)[]): NodeArray<HeritageClause>;
	joinImplementsHeritageClause (newImplementsClause: HeritageClause, existingImplementsClause: HeritageClause|undefined): HeritageClause;
	joinClassElements (...elements: (ClassElement|undefined)[]): NodeArray<ClassElement>;
	joinBlock (...blocks: (Block|undefined)[]): Block;
	joinStatementNodeArrays (newStatements: NodeArray<Statement>|Statement, existingStatements: NodeArray<Statement>|undefined, placement?: IPlacement): NodeArray<Statement>;
	joinExpressionNodeArrays (newExpressions: NodeArray<Expression>|Expression, existingExpressions: NodeArray<Expression>|undefined, placement?: IPlacement): NodeArray<Expression>;
	joinNamedImports (newNamedImports: NamedImports, existingNamedImports: NamedImports|undefined): NamedImports;
	joinNamedExports (newNamedExports: NamedExports, existingNamedExports: NamedExports|undefined): NamedExports;
}