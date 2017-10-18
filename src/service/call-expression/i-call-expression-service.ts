import {CallExpression, NodeArray, SourceFile} from "typescript";
import {INodeService} from "../node/i-node-service";
import {PropertyAccessCallExpression} from "./property-access-call-expression";

export interface ICallExpressionService extends INodeService<CallExpression> {
	getCallExpressionsOnPropertyAccessExpressionMatching (identifier: string, property: string|undefined, sourceFile: SourceFile, deep?: boolean): NodeArray<PropertyAccessCallExpression>;
	getCallExpressionsMatching (match: RegExp, sourceFile: SourceFile, deep?: boolean): NodeArray<CallExpression>;
	getTypeArgumentNames (callExpression: CallExpression): string[];
	setArgumentExpressionOnArgumentIndex (argumentIndex: number, expression: string, callExpression: CallExpression): CallExpression;
	hasArgumentOnIndex (index: number, callExpression: CallExpression): boolean;
}