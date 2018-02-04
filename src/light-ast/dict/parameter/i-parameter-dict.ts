import {IParameterCtor} from "../../ctor/parameter/i-parameter-ctor";
import {IDecoratorDict} from "../decorator/i-decorator-dict";
import {BindingNameDict} from "../binding-name/binding-name-dict";

export interface IParameterDict extends IParameterCtor {
	nodeKind: "PARAMETER";
	decorators: IDecoratorDict[]|null;
	name: BindingNameDict;
}