import {DecoratorDict} from "../../dict/decorator/decorator-dict";
import {ParameterDict} from "../../dict/parameter/parameter-dict";
import {VisibilityKind} from "../../dict/visibility/visibility-kind";

export interface IClassServiceCreatePropertyOptions {
	name: string;
	decorators: Iterable<DecoratorDict>|null;
	parameters: Iterable<ParameterDict>|null;
	type: string;
	body: string|null;
	initializer: string|null;
	isAbstract: boolean;
	isOptional: boolean;
	isAsync: boolean;
	isStatic: boolean;
	visibility: VisibilityKind;
}