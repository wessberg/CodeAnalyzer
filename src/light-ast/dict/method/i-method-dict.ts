import {IMethodCtor} from "../../ctor/method/i-method-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IMethodDict extends IMethodCtor, INodeDict {
	nodeKind: NodeKind.METHOD;
}