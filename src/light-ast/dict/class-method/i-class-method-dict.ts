import {IClassMethodCtor} from "../../ctor/class-method/i-class-method-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IClassMethodDict extends IClassMethodCtor, INodeDict {
	nodeKind: "CLASS_METHOD";
}