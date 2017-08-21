import {TypeNode} from "typescript";
import {IInterfaceTypeMemberFormatter} from "../interface-type-member-formatter/i-interface-type-member-formatter";
import {IParameterTypeFormatter} from "../parameter-type-formatter/i-parameter-type-formatter";
import {ITypeFormatter} from "../type-formatter/i-type-formatter";

export interface IParenthesizedTypeFormatterFormatOptions {
	node: TypeNode;
	typeFormatter: ITypeFormatter;
	interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter;
	parameterTypeFormatter: IParameterTypeFormatter;
}