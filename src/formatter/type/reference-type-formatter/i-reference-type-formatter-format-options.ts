import {EntityName, ExpressionWithTypeArguments, Identifier, TypeReferenceNode} from "typescript";

export interface IReferenceTypeFormatterFormatOptions {
	node: ExpressionWithTypeArguments|Identifier|TypeReferenceNode|EntityName;
}