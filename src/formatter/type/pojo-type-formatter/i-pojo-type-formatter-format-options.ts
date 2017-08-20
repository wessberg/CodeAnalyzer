import {TypeLiteralNode} from "typescript";
import {IInterfaceTypeMemberFormatter} from "../interface-type-member-formatter/i-interface-type-member-formatter";

export interface IPojoTypeFormatterFormatOptions {
	node: TypeLiteralNode;
	interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter;
}