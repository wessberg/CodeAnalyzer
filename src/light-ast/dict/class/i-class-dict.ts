import {IClassCtor} from "../../ctor/class/i-class-ctor";
import {INodeDict} from "../node/i-node-dict";
import {ClassElementDict} from "../class-element/class-element-dict";
import {IDecoratorDict} from "../decorator/i-decorator-dict";
import {IExtendsHeritageDict, IImplementsHeritageDict} from "../heritage/i-heritage-dict";

export interface IClassDict extends IClassCtor, INodeDict {
	nodeKind: "CLASS";
	members: ClassElementDict[]|null;
	decorators: IDecoratorDict[]|null;
	extendsClass: IExtendsHeritageDict|null;
	implementsInterfaces: IImplementsHeritageDict|null;
}