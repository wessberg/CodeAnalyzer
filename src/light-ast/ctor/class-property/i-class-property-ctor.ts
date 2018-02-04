import {IDecoratorCtor} from "../decorator/i-decorator-ctor";
import {VisibilityKind} from "../../dict/visibility/visibility-kind";

export interface IClassPropertyCtor {
	name: string;
	decorators: IDecoratorCtor[]|null;
	type: string|null;
	initializer: string|null;
	isAbstract: boolean;
	isReadonly: boolean;
	isOptional: boolean;
	isAsync: boolean;
	isStatic: boolean;
	visibility: VisibilityKind;
}