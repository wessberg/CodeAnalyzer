import {VisibilityKind} from "../visibility/visibility-kind";
import {DecoratorDict} from "../decorator/decorator-dict";
import {Decorator} from "typescript";

export interface IClassPropertyDict {
	name: string;
	decorators: Iterable<DecoratorDict|Decorator>|null;
	type: string;
	initializer: string|null;
	isAbstract: boolean;
	isReadonly: boolean;
	isOptional: boolean;
	isAsync: boolean;
	isStatic: boolean;
	visibility: VisibilityKind;
}