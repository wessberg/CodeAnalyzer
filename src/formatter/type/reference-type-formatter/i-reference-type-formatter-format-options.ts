import {ExpressionWithTypeArguments, Identifier, TypeReferenceNode} from "typescript";
import {ITypeFormatter} from "../type-formatter/i-type-formatter";
import {IInterfaceTypeMemberFormatter} from "../interface-type-member-formatter/i-interface-type-member-formatter";
import {IParameterTypeFormatter} from "../parameter-type-formatter/i-parameter-type-formatter";

export interface IReferenceTypeFormatterFormatOptions {
	node: ExpressionWithTypeArguments|Identifier|TypeReferenceNode;
	typeFormatter: ITypeFormatter;
	interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter;
	parameterTypeFormatter: IParameterTypeFormatter;
}