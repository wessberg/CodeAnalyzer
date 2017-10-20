import {IClassMethodCtor} from "../../ctor/class-method/i-class-method-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IClassMethodDict extends IClassMethodCtor, INodeDict {
	nodeKind: NodeKind.CLASS_METHOD;
}