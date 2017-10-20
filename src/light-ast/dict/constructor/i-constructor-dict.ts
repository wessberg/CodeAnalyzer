import {IConstructorCtor} from "../../ctor/constructor/i-constructor-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IConstructorDict extends IConstructorCtor, INodeDict {
	nodeKind: NodeKind.CONSTRUCTOR;
}