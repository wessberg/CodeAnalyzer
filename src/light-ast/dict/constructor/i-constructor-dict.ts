import {IConstructorCtor} from "../../ctor/constructor/i-constructor-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IConstructorDict extends IConstructorCtor, INodeDict {
	nodeKind: "CONSTRUCTOR";
}