import {IExtendsHeritageCtor, IHeritageCtor, IImplementsHeritageCtor} from "../../ctor/heritage/i-heritage-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IHeritageDict extends IHeritageCtor, INodeDict {
	nodeKind: "HERITAGE";
}

export interface IExtendsHeritageDict extends IExtendsHeritageCtor, INodeDict {
	nodeKind: "HERITAGE";
}

export interface IImplementsHeritageDict extends IImplementsHeritageCtor, INodeDict {
	nodeKind: "HERITAGE";
}

export declare type HeritageDict = IExtendsHeritageDict|IImplementsHeritageDict;