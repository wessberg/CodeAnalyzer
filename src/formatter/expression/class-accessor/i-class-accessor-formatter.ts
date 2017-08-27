import {GetAccessorDeclaration, SetAccessorDeclaration} from "typescript";
import {FormattedClassAccessor} from "@wessberg/type";
import {IAccessorBaseFormatter} from "../accessor-base/i-accessor-base-formatter";

export interface IClassAccessorFormatter extends IAccessorBaseFormatter {
	format (expression: GetAccessorDeclaration|SetAccessorDeclaration): FormattedClassAccessor;
}