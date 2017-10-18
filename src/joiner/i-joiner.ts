import {Block, ClassElement, Expression, HeritageClause, NamedExports, NamedImports, NodeArray, Statement} from "typescript";

export interface IJoinerBase {
	joinHeritageClauses (...clauses: (HeritageClause|undefined)[]): NodeArray<HeritageClause>;
	joinImplementsHeritageClause (newImplementsClause: HeritageClause, existingImplementsClause: HeritageClause|undefined): HeritageClause;
	joinClassElements (...elements: (ClassElement|undefined)[]): NodeArray<ClassElement>;
	joinBlock (...blocks: (Block|undefined)[]): Block;
	joinStatementNodeArrays (newStatements: NodeArray<Statement>|Statement, existingStatements: NodeArray<Statement>|undefined, suffix?: boolean): NodeArray<Statement>;
	joinExpressionNodeArrays (newExpressions: NodeArray<Expression>|Expression, existingExpressions: NodeArray<Expression>|undefined, suffix?: boolean): NodeArray<Expression>;
	joinNamedImports (newNamedImports: NamedImports, existingNamedImports: NamedImports|undefined): NamedImports;
	joinNamedExports (newNamedExports: NamedExports, existingNamedExports: NamedExports|undefined): NamedExports;
}