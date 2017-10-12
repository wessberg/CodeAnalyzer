import {ClassElementDict} from "../class-element/class-element-dict";
import {DecoratorDict} from "../decorator/decorator-dict";
import {IExtendsHeritageDict, IImplementsHeritageDict} from "../heritage/i-heritage-clause-dict";

export interface IClassDict {
	name: string|null;
	members: Iterable<ClassElementDict>|null;
	decorators: Iterable<DecoratorDict>|null;
	isAbstract: boolean;
	extendsClass: IExtendsHeritageDict|null;
	implementsInterfaces: IImplementsHeritageDict|null;
	typeParameters: Iterable<string>|null;
}