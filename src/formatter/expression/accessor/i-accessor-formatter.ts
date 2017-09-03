import {GetAccessorDeclaration, SetAccessorDeclaration} from "typescript";
import {FormattedAccessor} from "@wessberg/type";
import {IAccessorBaseFormatter} from "../accessor-base/i-accessor-base-formatter";

export interface IAccessorFormatter extends IAccessorBaseFormatter {
	format (expression: GetAccessorDeclaration|SetAccessorDeclaration): FormattedAccessor;
}