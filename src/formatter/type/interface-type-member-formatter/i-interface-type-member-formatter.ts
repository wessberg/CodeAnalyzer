import {InterfaceProperty} from "../interface-type-formatter/interface-property";
import {IndexSignatureDeclaration, ParameterDeclaration, PropertySignature} from "typescript";
import {IInterfaceTypeMember} from "@wessberg/type";

export interface IInterfaceTypeMemberFormatter {
	format (member: InterfaceProperty|PropertySignature|IndexSignatureDeclaration|ParameterDeclaration): IInterfaceTypeMember;
}