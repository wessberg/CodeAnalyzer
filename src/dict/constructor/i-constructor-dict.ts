import {ParameterDict} from "../parameter/parameter-dict";

export interface IConstructorDict {
	body: string|null;
	parameters: Iterable<ParameterDict>|null;
}