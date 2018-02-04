import {IMethodCtor} from "../../ctor/method/i-method-ctor";
import {INodeDict} from "../node/i-node-dict";
import {IParameterDict} from "../parameter/i-parameter-dict";
import {IDecoratorDict} from "../decorator/i-decorator-dict";

export interface IMethodDict extends IMethodCtor, INodeDict {
	nodeKind: "METHOD";
	parameters: IParameterDict[]|null;
	decorators: IDecoratorDict[]|null;
}