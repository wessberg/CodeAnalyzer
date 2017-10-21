import {IClassPropertyCtor} from "../../ctor/class-property/i-class-property-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IClassPropertyDict extends IClassPropertyCtor, INodeDict {
	nodeKind: "CLASS_PROPERTY";
}