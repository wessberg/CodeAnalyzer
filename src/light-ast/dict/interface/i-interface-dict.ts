import {IInterfaceCtor} from "../../ctor/interface/i-interface-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IInterfaceDict extends IInterfaceCtor, INodeDict {
	nodeKind: NodeKind.INTERFACE;
}