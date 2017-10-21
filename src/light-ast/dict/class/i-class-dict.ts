import {IClassCtor} from "../../ctor/class/i-class-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IClassDict extends IClassCtor, INodeDict {
	nodeKind: "CLASS";
}