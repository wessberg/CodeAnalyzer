import {VisibilityKind} from "../../dict/visibility/visibility-kind";

export interface IAllModifiersCtor {
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