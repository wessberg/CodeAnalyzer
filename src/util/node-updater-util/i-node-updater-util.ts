import {Node} from "typescript";
import {INodeUpdaterUtilUpdateOptionsDict} from "./i-node-updater-util-update-options-dict";

export interface INodeUpdaterUtil {
	updateInPlace<T extends Node> (newNode: T, existing: T, options?: Partial<INodeUpdaterUtilUpdateOptionsDict>): T;
}