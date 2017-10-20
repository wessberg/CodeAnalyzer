import {IParameterCtor} from "../../ctor/parameter/i-parameter-ctor";
import {NodeKind} from "../node/node-kind";

export interface IParameterDict extends IParameterCtor {
	nodeKind: NodeKind.PARAMETER;
}