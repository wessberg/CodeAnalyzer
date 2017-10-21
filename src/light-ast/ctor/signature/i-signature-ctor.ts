import {IParameterCtor} from "../parameter/i-parameter-ctor";

export interface ISignatureCtor {
	name: string|null;
	type: string|null;
	parameters: Iterable<IParameterCtor>|null;
	typeParameters: Iterable<string>|null;
}