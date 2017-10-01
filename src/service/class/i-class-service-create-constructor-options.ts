import {ParameterDict} from "../../dict/parameter/parameter-dict";

export interface IClassServiceCreateConstructorOptions {
	parameters: Iterable<ParameterDict>|null;
	body: string|null;
}