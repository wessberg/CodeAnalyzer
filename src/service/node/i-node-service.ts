import {Decorator, Node, NodeArray, SourceFile, Statement} from "typescript";
import {IDecoratorCtor} from "../../light-ast/ctor/decorator/i-decorator-ctor";

export interface INodeService<T extends Node> {
	getAll (sourceFile: SourceFile|Statement[]|Statement|NodeArray<Statement>, deep?: boolean): NodeArray<T>;
	getAllForFile (file: string, content?: string, deep?: boolean): NodeArray<T>;
	hasDecorator (decorator: string|IDecoratorCtor|RegExp, node: T): boolean;
	getDecorator (decorator: string|IDecoratorCtor|RegExp, node: T): Decorator|undefined;
	addDecorator (decorator: string|IDecoratorCtor|Decorator, node: T): T;
	removeDecorator (decorator: string|IDecoratorCtor|RegExp|Decorator, node: T): boolean;
	removeDecorators (node: T, decorators?: (string|IDecoratorCtor|RegExp|Decorator)[]): boolean;
}