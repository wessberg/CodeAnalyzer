import {MethodDeclaration} from "typescript";
import {IOwnOrInheritedWithNameResult} from "./i-own-or-inherited-with-name-result";

export interface IOwnOrInheritedMethodWithNameResult extends IOwnOrInheritedWithNameResult {
	method: MethodDeclaration;
}