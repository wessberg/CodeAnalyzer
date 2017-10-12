import {CallExpression, NodeArray, SourceFile} from "typescript";

export interface ICallExpressionService {
	getCallExpressions (sourceFile: SourceFile, deep?: boolean): NodeArray<CallExpression>;
	getCallExpressionsOnPropertyAccessExpressionMatching (identifier: string, property: string|undefined, sourceFile: SourceFile, deep?: boolean): NodeArray<CallExpression>;
	getCallExpressionsMatching (match: RegExp, sourceFile: SourceFile, deep?: boolean): NodeArray<CallExpression>;
}