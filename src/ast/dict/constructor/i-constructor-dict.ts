import {ParameterDict} from "../parameter/parameter-dict";
import {ParameterDeclaration} from "typescript";

export interface IConstructorDict {
	body: string|null;
	parameters: Iterable<ParameterDict|ParameterDeclaration>|null;
}