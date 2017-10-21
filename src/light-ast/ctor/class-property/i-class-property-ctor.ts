import {IDecoratorCtor} from "../decorator/i-decorator-ctor";
import {VisibilityKind} from "../../dict/visibility/visibility-kind";

export interface IClassPropertyCtor {
	name: string;
	decorators: Iterable<IDecoratorCtor>|null;
	type: string;
	initializer: string|null;
	isAbstract: boolean;
	isReadonly: boolean;
	isOptional: boolean;
	isAsync: boolean;
	isStatic: boolean;
	visibility: VisibilityKind;
}