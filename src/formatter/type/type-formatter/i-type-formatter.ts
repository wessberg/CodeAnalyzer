import {LeftHandSideExpression, TypeNode, TypeReferenceNode} from "typescript";
import {IParameterTypeFormatter} from "../parameter-type-formatter/i-parameter-type-formatter";
import {Type} from "@wessberg/type";
import {IInterfaceTypeMemberFormatter} from "../interface-type-member-formatter/i-interface-type-member-formatter";

export interface ITypeFormatter {
	format (node: TypeNode|TypeReferenceNode|LeftHandSideExpression|undefined, interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter, parameterTypeFormatter: IParameterTypeFormatter): Type;
}