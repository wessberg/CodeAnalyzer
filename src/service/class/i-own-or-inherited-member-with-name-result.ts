import {ClassElement} from "typescript";
import {IOwnOrInheritedWithNameResult} from "./i-own-or-inherited-with-name-result";

export interface IOwnOrInheritedMemberWithNameResult extends IOwnOrInheritedWithNameResult {
	member: ClassElement;
}