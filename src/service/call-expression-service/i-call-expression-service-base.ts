import {CallExpression, NodeArray} from "typescript";
import {IFormattedCallExpression} from "../../formatter/expression/call-expression/i-formatted-call-expression";
import {AstNode} from "../../type/ast-node";

export interface ICallExpressionServiceBase {
	getCallExpressionsForFile (file: string): IFormattedCallExpression[];
	getCallExpressionsForStatement (statement: CallExpression): IFormattedCallExpression[];
	getCallExpressionsForStatements (statements: NodeArray<AstNode>): IFormattedCallExpression[];
}