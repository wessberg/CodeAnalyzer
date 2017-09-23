import {Node} from "typescript";

export interface INodeUpdaterUtil {
	updateInPlace<T extends Node> (newNode: T, existing: T): T;
}