import {GetAccessorDeclaration} from "typescript";
import {IOwnOrInheritedWithNameResult} from "./i-own-or-inherited-with-name-result";

export interface IOwnOrInheritedGetterWithNameResult extends IOwnOrInheritedWithNameResult {
	getter: GetAccessorDeclaration;
}