import {CallExpression, NodeArray, SourceFile} from "typescript";
import {INodeService} from "../node/i-node-service";

export interface ICallExpressionService extends INodeService<CallExpression> {
	getCallExpressionsOnPropertyAccessExpressionMatching (identifier: string, property: string|undefined, sourceFile: SourceFile, deep?: boolean): NodeArray<CallExpression>;
	getCallExpressionsMatching (match: RegExp, sourceFile: SourceFile, deep?: boolean): NodeArray<CallExpression>;
}