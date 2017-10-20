import {IClassPropertyCtor} from "../../ctor/class-property/i-class-property-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IClassPropertyDict extends IClassPropertyCtor, INodeDict {
	nodeKind: NodeKind.CLASS_PROPERTY;
}