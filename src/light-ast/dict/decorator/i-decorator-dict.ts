import {IDecoratorCtor} from "../../ctor/decorator/i-decorator-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IDecoratorDict extends IDecoratorCtor, INodeDict {
	nodeKind: "DECORATOR";
}