import {EnumDeclaration} from "typescript";
import {IEnumDeclaration} from "../../identifier/interface/IIdentifier";

export interface IEnumFormatter {
	format (statement: EnumDeclaration): IEnumDeclaration;
}