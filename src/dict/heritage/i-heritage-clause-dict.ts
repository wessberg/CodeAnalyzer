import {INameWithTypeArguments} from "../name-with-type-arguments/i-name-with-type-arguments";
import {HeritageKind} from "./heritage-kind";

export interface IHeritageDict {
	kind: HeritageKind;
}

export interface IExtendsHeritageDict extends IHeritageDict, INameWithTypeArguments {
	kind: HeritageKind.EXTENDS;
}

export interface IImplementsHeritageDict extends IHeritageDict {
	kind: HeritageKind.IMPLEMENTS;
	elements: INameWithTypeArguments[];
}

export declare type HeritageDict = IExtendsHeritageDict|IImplementsHeritageDict;