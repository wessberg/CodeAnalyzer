import {IClassCtor} from "../../ctor/class/i-class-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IClassDict extends IClassCtor, INodeDict {
	nodeKind: NodeKind.CLASS;
}