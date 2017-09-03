import {IFormattedReferenceType} from "@wessberg/type";
import {EntityName, ExpressionWithTypeArguments, Identifier, TypeReferenceNode} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface IReferenceTypeFormatter extends IFormattedExpressionFormatter {
	format (node: ExpressionWithTypeArguments|Identifier|TypeReferenceNode|EntityName): IFormattedReferenceType;
}