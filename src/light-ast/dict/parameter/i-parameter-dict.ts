import {IParameterCtor} from "../../ctor/parameter/i-parameter-ctor";

export interface IParameterDict extends IParameterCtor {
	nodeKind: "PARAMETER";
}