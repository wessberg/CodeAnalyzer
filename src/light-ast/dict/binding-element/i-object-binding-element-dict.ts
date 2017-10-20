import {IObjectBindingElementCtor} from "../../ctor/binding-element/i-object-binding-element-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IObjectBindingElementDict extends IObjectBindingElementCtor, INodeDict {
	nodeKind: NodeKind.OBJECT_BINDING_ELEMENT;
}