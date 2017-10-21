import {PropertyDeclaration} from "typescript";
import {IOwnOrInheritedWithNameResult} from "./i-own-or-inherited-with-name-result";

export interface IOwnOrInheritedPropertyWithNameResult extends IOwnOrInheritedWithNameResult {
	property: PropertyDeclaration;
}