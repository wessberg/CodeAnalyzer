import {UnionTypeNode} from "typescript";
import {IInterfaceTypeMemberFormatter} from "../interface-type-member-formatter/i-interface-type-member-formatter";
import {IParameterTypeFormatter} from "../parameter-type-formatter/i-parameter-type-formatter";
import {ITypeFormatter} from "../type-formatter/i-type-formatter";

export interface IUnionTypeFormatterFormatOptions {
	node: UnionTypeNode;
	typeFormatter: ITypeFormatter;
	interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter;
	parameterTypeFormatter: IParameterTypeFormatter;
}