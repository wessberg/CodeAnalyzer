import {IndexSignatureDeclaration, LeftHandSideExpression, MethodSignature, ParameterDeclaration, PropertySignature, TypeNode, TypeQueryNode, TypeReferenceNode} from "typescript";
import {Type} from "@wessberg/type";
import {InterfaceProperty} from "../interface-type-formatter/interface-property";

export declare type TypeFormatterNode = TypeQueryNode|TypeNode|TypeReferenceNode|LeftHandSideExpression|InterfaceProperty|PropertySignature|IndexSignatureDeclaration|MethodSignature|ParameterDeclaration|undefined;

export interface ITypeFormatter {
	format (node: TypeFormatterNode): Type;
}