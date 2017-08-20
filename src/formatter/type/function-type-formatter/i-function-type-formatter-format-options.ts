import {FunctionTypeNode, MethodSignature} from "typescript";
import {ITypeFormatter} from "../type-formatter/i-type-formatter";
import {IInterfaceTypeMemberFormatter} from "../interface-type-member-formatter/i-interface-type-member-formatter";
import {IParameterTypeFormatter} from "../parameter-type-formatter/i-parameter-type-formatter";

export interface IFunctionTypeFormatterFormatOptions {
	node: MethodSignature|FunctionTypeNode;
	typeFormatter: ITypeFormatter;
	interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter;
	parameterTypeFormatter: IParameterTypeFormatter;
}