import {PropertyAccessExpression} from "typescript";
import {INodeService} from "../node/i-node-service";

export interface IPropertyAccessExpressionService extends INodeService<PropertyAccessExpression> {
	getPropertyName (expression: PropertyAccessExpression): string;
	getIdentifierName (expression: PropertyAccessExpression): string;
}