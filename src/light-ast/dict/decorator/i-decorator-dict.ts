import {IDecoratorCtor} from "../../ctor/decorator/i-decorator-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IDecoratorDict extends IDecoratorCtor, INodeDict {
	nodeKind: NodeKind.DECORATOR;
}