import {IClassPropertyCtor} from "../../ctor/class-property/i-class-property-ctor";
import {INodeDict} from "../node/i-node-dict";
import {IDecoratorDict} from "../decorator/i-decorator-dict";

export interface IClassPropertyDict extends IClassPropertyCtor, INodeDict {
	nodeKind: "CLASS_PROPERTY";
	decorators: IDecoratorDict[]|null;
}