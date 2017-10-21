import {SetAccessorDeclaration} from "typescript";
import {IOwnOrInheritedWithNameResult} from "./i-own-or-inherited-with-name-result";

export interface IOwnOrInheritedSetterWithNameResult extends IOwnOrInheritedWithNameResult {
	setter: SetAccessorDeclaration;
}