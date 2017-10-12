import {VisibilityKind} from "../visibility/visibility-kind";
import {DecoratorDict} from "../decorator/decorator-dict";

export interface IClassPropertyDict {
	name: string;
	decorators: Iterable<DecoratorDict>|null;
	type: string;
	initializer: string|null;
	isAbstract: boolean;
	isReadonly: boolean;
	isOptional: boolean;
	isAsync: boolean;
	isStatic: boolean;
	visibility: VisibilityKind;
}