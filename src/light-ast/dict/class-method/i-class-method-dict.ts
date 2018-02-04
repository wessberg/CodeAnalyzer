import {IClassMethodCtor} from "../../ctor/class-method/i-class-method-ctor";
import {INodeDict} from "../node/i-node-dict";
import {IParameterDict} from "../parameter/i-parameter-dict";
import {IDecoratorDict} from "../decorator/i-decorator-dict";

export interface IClassMethodDict extends IClassMethodCtor, INodeDict {
	nodeKind: "CLASS_METHOD";
	decorators: IDecoratorDict[]|null;
	parameters: IParameterDict[]|null;
}