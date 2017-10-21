import {IObjectBindingElementCtor} from "../../ctor/binding-element/i-object-binding-element-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IObjectBindingElementDict extends IObjectBindingElementCtor, INodeDict {
	nodeKind: "OBJECT_BINDING_ELEMENT";
}