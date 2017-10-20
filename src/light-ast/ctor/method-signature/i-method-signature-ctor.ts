import {ITypeElementCtor} from "../type-element/i-type-element-ctor";
import {ISignatureCtor} from "../signature/i-signature-ctor";

export interface IMethodSignatureCtor extends ITypeElementCtor, ISignatureCtor {
	name: string;
}