import {IExtendsHeritageCtor, IHeritageCtor, IImplementsHeritageCtor} from "../../ctor/heritage/i-heritage-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IHeritageDict extends IHeritageCtor, INodeDict {
	nodeKind: NodeKind.HERITAGE;
}

export interface IExtendsHeritageDict extends IExtendsHeritageCtor, INodeDict {
	nodeKind: NodeKind.HERITAGE;
}

export interface IImplementsHeritageDict extends IImplementsHeritageCtor, INodeDict {
	nodeKind: NodeKind.HERITAGE;
}

export declare type HeritageDict = IExtendsHeritageDict|IImplementsHeritageDict;