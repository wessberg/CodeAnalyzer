import {IMethodCtor} from "../method/i-method-ctor";
import {VisibilityKind} from "../../dict/visibility/visibility-kind";

export interface IClassMethodCtor extends IMethodCtor {
	name: string;
	isAbstract: boolean;
	isOptional: boolean;
	isStatic: boolean;
	visibility: VisibilityKind;
}