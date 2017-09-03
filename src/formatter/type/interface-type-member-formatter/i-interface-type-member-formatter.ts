import {InterfaceProperty} from "../interface-type-formatter/interface-property";
import {IndexSignatureDeclaration, ParameterDeclaration, PropertySignature} from "typescript";
import {IFormattedInterfaceTypeMember} from "@wessberg/type";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface IInterfaceTypeMemberFormatter extends IFormattedExpressionFormatter {
	format (member: InterfaceProperty|PropertySignature|IndexSignatureDeclaration|ParameterDeclaration): IFormattedInterfaceTypeMember;
}