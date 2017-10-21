import {IInterfaceCtor} from "../../ctor/interface/i-interface-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IInterfaceDict extends IInterfaceCtor, INodeDict {
	nodeKind: "INTERFACE";
}