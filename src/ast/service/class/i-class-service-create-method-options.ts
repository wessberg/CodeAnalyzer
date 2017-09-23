import {ParameterDict} from "../../dict/parameter/parameter-dict";
import {DecoratorDict} from "../../dict/decorator/decorator-dict";
import {VisibilityKind} from "../../dict/visibility/visibility-kind";

export interface IClassServiceCreateMethodOptions {
	name: string;
	decorators: Iterable<DecoratorDict>|null;
	parameters: Iterable<ParameterDict>|null;
	typeParameters: Iterable<string>|null;
	type: string;
	body: string|null;
	isAbstract: boolean;
	isOptional: boolean;
	isAsync: boolean;
	isStatic: boolean;
	visibility: VisibilityKind;
}