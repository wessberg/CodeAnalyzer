import {Node, NodeArray, SourceFile} from "typescript";
import {IDecoratorCtor} from "../../light-ast/ctor/decorator/i-decorator-ctor";

export interface INodeService<T extends Node> {
	getAll (sourceFile: SourceFile, deep?: boolean): NodeArray<T>;
	hasDecorator (decorator: string|IDecoratorCtor|RegExp, node: T): boolean;
	removeDecorator (decorator: string|IDecoratorCtor|RegExp, node: T): boolean;
	removeDecorators (node: T, decorators?: (string|IDecoratorCtor|RegExp)[]): boolean;
}