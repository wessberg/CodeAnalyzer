import {IParameterCtor} from "../parameter/i-parameter-ctor";

export interface IConstructorCtor {
	body: string|null;
	parameters: Iterable<IParameterCtor>|null;
}