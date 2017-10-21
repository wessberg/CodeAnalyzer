import {HeritageKind} from "../../dict/heritage/heritage-kind";
import {INameWithTypeArguments} from "../../dict/name-with-type-arguments/i-name-with-type-arguments";

export interface IHeritageCtor {
	kind: HeritageKind;
}

export interface IExtendsHeritageCtor extends IHeritageCtor, INameWithTypeArguments {
	kind: "EXTENDS";
}

export interface IImplementsHeritageCtor extends IHeritageCtor {
	kind: "IMPLEMENTS";
	elements: INameWithTypeArguments[];
}

export declare type HeritageCtor = IExtendsHeritageCtor|IImplementsHeritageCtor;