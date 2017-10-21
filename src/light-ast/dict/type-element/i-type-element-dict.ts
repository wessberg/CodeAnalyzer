import {IPropertySignatureDict} from "../property-signature/i-property-signature-dict";
import {ICallSignatureDict} from "../call-signature/i-call-signature-dict";
import {IConstructSignatureDict} from "../construct-signature/i-construct-signature-dict";
import {IMethodSignatureDict} from "../method-signature/i-method-signature-dict";
import {IIndexSignatureDict} from "../index-signature/i-index-signature-dict";
import {ITypeElementCtor} from "../../ctor/type-element/i-type-element-ctor";

export interface ITypeElementDict extends ITypeElementCtor {
}

export declare type TypeElementDict = IPropertySignatureDict|ICallSignatureDict|IConstructSignatureDict|IMethodSignatureDict|IIndexSignatureDict;