import {Block, ClassElement, HeritageClause, NamedImports, NodeArray, Statement} from "typescript";

export interface IJoinerBase {
	joinHeritageClauses (...clauses: (HeritageClause|undefined)[]): NodeArray<HeritageClause>;
	joinImplementsHeritageClause (newImplementsClause: HeritageClause, existingImplementsClause: HeritageClause|undefined): HeritageClause;
	joinClassElements (...elements: (ClassElement|undefined)[]): NodeArray<ClassElement>;
	joinBlock (...blocks: (Block|undefined)[]): Block;
	joinStatementNodeArrays (newStatements: NodeArray<Statement>|Statement, existingStatements: NodeArray<Statement>|undefined): NodeArray<Statement>;
	joinNamedImports (newNamedImports: NamedImports, existingNamedImports: NamedImports|undefined): NamedImports;
}