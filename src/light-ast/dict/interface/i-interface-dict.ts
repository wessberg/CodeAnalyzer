import {IInterfaceCtor} from "../../ctor/interface/i-interface-ctor";
import {INodeDict} from "../node/i-node-dict";
import {TypeElementDict} from "../type-element/i-type-element-dict";

export interface IInterfaceDict extends IInterfaceCtor, INodeDict {
	nodeKind: "INTERFACE";
	members: TypeElementDict[];
}