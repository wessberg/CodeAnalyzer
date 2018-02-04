import {IConstructorCtor} from "../../ctor/constructor/i-constructor-ctor";
import {INodeDict} from "../node/i-node-dict";
import {IParameterDict} from "../parameter/i-parameter-dict";

export interface IConstructorDict extends IConstructorCtor, INodeDict {
	nodeKind: "CONSTRUCTOR";
	parameters: IParameterDict[]|null;
}