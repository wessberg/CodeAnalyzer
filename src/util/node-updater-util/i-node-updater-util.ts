import {Node} from "typescript";
import {INodeUpdaterUtilUpdateOptions} from "./i-node-updater-util-update-options";

export interface INodeUpdaterUtil {
	updateInPlace<T extends Node> (newNode: T, existing: T, options?: Partial<INodeUpdaterUtilUpdateOptions>): T;
}