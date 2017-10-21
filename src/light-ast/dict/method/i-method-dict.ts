import {IMethodCtor} from "../../ctor/method/i-method-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IMethodDict extends IMethodCtor, INodeDict {
	nodeKind: "METHOD";
}