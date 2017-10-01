import {VisibilityKind} from "../visibility/visibility-kind";

export interface IAllModifiersDict {
	isAbstract: boolean;
	isAsync: boolean;
	isStatic: boolean;
	isReadonly: boolean;
	isConst: boolean;
	isExported: boolean;
	isDeclared: boolean;
	isDefault: boolean;
	visibility: VisibilityKind;
}