import {ITypeLiteralCtor} from "../type-literal/i-type-literal-ctor";
import {TypeElementCtor} from "../type-element/i-type-element-ctor";
import {INameWithTypeArguments} from "../../dict/name-with-type-arguments/i-name-with-type-arguments";

export interface IInterfaceCtor extends ITypeLiteralCtor {
	name: string;
	extends: INameWithTypeArguments[];
	typeParameters: string[]|null;
	members: TypeElementCtor[];
}