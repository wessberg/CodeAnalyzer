import {IParameterCtor} from "../parameter/i-parameter-ctor";

export interface ISignatureCtor {
	name: string|null|undefined;
	type: string|null|undefined;
	parameters: Iterable<IParameterCtor>|null;
	typeParameters: Iterable<string>|null;
}