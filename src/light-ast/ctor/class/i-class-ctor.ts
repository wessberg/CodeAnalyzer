import {ClassElementCtor} from "../class-element/class-element-ctor";
import {IExtendsHeritageCtor, IImplementsHeritageCtor} from "../heritage/i-heritage-ctor";
import {IDecoratorCtor} from "../decorator/i-decorator-ctor";

export interface IClassCtor {
	name: string|null;
	members: ClassElementCtor[]|null;
	decorators: IDecoratorCtor[]|null;
	isAbstract: boolean;
	extendsClass: IExtendsHeritageCtor|null;
	implementsInterfaces: IImplementsHeritageCtor|null;
	typeParameters: string[]|null;
}