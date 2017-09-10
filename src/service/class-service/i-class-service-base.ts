import {ClassDeclaration, ClassExpression, NodeArray} from "typescript";
import {AstNode} from "../../type/ast-node/ast-node";
import {IFormattedClass} from "@wessberg/type";

export interface IClassServiceBase {
	getClassesForFile (file: string, content?: string): IFormattedClass[];
	getClassesForStatement (statement: ClassDeclaration|ClassExpression): IFormattedClass[];
	getClassesForStatements (statements: NodeArray<AstNode>): IFormattedClass[];
}