import {IndexSignatureDeclaration, LeftHandSideExpression, MethodSignature, ParameterDeclaration, PropertySignature, TypeNode, TypeReferenceNode} from "typescript";
import {IParameterTypeFormatter} from "../parameter-type-formatter/i-parameter-type-formatter";
import {Type} from "@wessberg/type";
import {IInterfaceTypeMemberFormatter} from "../interface-type-member-formatter/i-interface-type-member-formatter";
import {InterfaceProperty} from "../interface-type-formatter/interface-property";

export declare type TypeFormatterNode = TypeNode|TypeReferenceNode|LeftHandSideExpression|InterfaceProperty|PropertySignature|IndexSignatureDeclaration|MethodSignature|ParameterDeclaration|undefined;

export interface ITypeFormatter {
	format (node: TypeFormatterNode, interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter, parameterTypeFormatter: IParameterTypeFormatter): Type;
}