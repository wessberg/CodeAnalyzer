import {ClassDeclaration, ClassElement, ClassExpression, Decorator, Node} from "typescript";

export interface IRemoverBase {
	removeClassDeclarationMembers (classDeclaration: ClassDeclaration|ClassExpression, classElements?: Iterable<ClassElement>): boolean;
	removeDecorators<T extends Node> (node: T, decorators?: Iterable<Decorator>): boolean;
}