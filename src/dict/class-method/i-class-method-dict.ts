import {VisibilityKind} from "../visibility/visibility-kind";
import {IMethodDict} from "../method/i-method-dict";

export interface IClassMethodDict extends IMethodDict {
	name: string;
	isAbstract: boolean;
	isOptional: boolean;
	isStatic: boolean;
	visibility: VisibilityKind;
}