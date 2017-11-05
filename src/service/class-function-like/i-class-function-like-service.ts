import {INodeService} from "../node/i-node-service";
import {ClassFunctionLike} from "./class-function-like";
import {VisibilityKind} from "../../light-ast/dict/visibility/visibility-kind";

export interface IClassFunctionLikeService<T extends ClassFunctionLike> extends INodeService<T> {
	appendInstructions (instructions: string, member: T): T;
	getTypeName (member: T): string|undefined;
	isOptional (member: T): boolean;
	changeVisibility (visibility: VisibilityKind, member: T): T;
	getName (member: T): string;
}