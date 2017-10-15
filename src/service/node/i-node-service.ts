import {Node, NodeArray, SourceFile} from "typescript";
import {DecoratorDict} from "../../dict/decorator/decorator-dict";

export interface INodeService<T extends Node> {
	getAll (sourceFile: SourceFile, deep?: boolean): NodeArray<T>;
	hasDecorator (decorator: string|DecoratorDict|RegExp, node: T): boolean;
	removeDecorator (decorator: string|DecoratorDict|RegExp, node: T): boolean;
	removeDecorators (node: T, decorators?: (string|DecoratorDict|RegExp)[]): boolean;
}