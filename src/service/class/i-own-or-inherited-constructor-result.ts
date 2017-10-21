import {ConstructorDeclaration} from "typescript";
import {IOwnOrInheritedWithNameResult} from "./i-own-or-inherited-with-name-result";

export interface IOwnOrInheritedConstructorResult extends IOwnOrInheritedWithNameResult {
	constructor: ConstructorDeclaration;
}