import {CallExpression, NodeArray} from "typescript";
import {AstNode} from "../../type/ast-node/ast-node";
import {IFormattedCallExpression} from "@wessberg/type";

export interface ICallExpressionServiceBase {
	getCallExpressionsForFile (file: string): IFormattedCallExpression[];
	getCallExpressionsForStatement (statement: CallExpression): IFormattedCallExpression[];
	getCallExpressionsForStatements (statements: NodeArray<AstNode>): IFormattedCallExpression[];
	findMatchingCallExpressionsForFile (file: string, match: string|RegExp): IFormattedCallExpression[];
	findMatchingCallExpressionsForStatement (statement: CallExpression, match: string|RegExp): IFormattedCallExpression[];
	findMatchingCallExpressionsForStatements (statements: NodeArray<AstNode>, match: string|RegExp): IFormattedCallExpression[];
}