import {ParameterDeclaration} from "typescript";
import {ParameterType} from "@wessberg/type";
import {IInterfaceTypeMemberFormatter} from "../interface-type-member-formatter/i-interface-type-member-formatter";

export interface IParameterTypeFormatter {
	format (member: ParameterDeclaration, interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter): ParameterType;
}