import {ArrowFunction, FunctionDeclaration, FunctionExpression, NodeArray} from "typescript";
import {AstNode} from "../../type/ast-node/ast-node";
import {FormattedFunction} from "@wessberg/type";

export interface IFunctionServiceBase {
	getFunctionsForFile (file: string, content?: string): FormattedFunction[];
	getFunctionsForStatement (statement: FunctionExpression|FunctionDeclaration|ArrowFunction): FormattedFunction[];
	getFunctionsForStatements (statements: NodeArray<AstNode>): FormattedFunction[];
}