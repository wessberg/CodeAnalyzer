import {FunctionTypeNode, MethodSignature} from "typescript";

export interface IFunctionTypeFormatterFormatOptions {
	node: MethodSignature|FunctionTypeNode;
}