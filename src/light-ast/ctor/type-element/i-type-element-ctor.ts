import {IPropertySignatureCtor} from "../property-signature/i-property-signature-ctor";
import {ICallSignatureCtor} from "../call-signature/i-call-signature-ctor";
import {IConstructSignatureCtor} from "../construct-signature/i-construct-signature-ctor";
import {IMethodSignatureCtor} from "../method-signature/i-method-signature-ctor";
import {IIndexSignatureCtor} from "../index-signature/i-index-signature-ctor";

export interface ITypeElementCtor {
	name: string|null|undefined;
	isOptional: boolean;
}

export declare type TypeElementCtor = IPropertySignatureCtor|ICallSignatureCtor|IConstructSignatureCtor|IMethodSignatureCtor|IIndexSignatureCtor;