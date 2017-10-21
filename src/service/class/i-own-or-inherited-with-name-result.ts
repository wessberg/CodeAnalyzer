import {ClassDeclaration, ClassExpression} from "typescript";

export interface IOwnOrInheritedWithNameResult {
	isInherited: boolean;
	classDeclaration: ClassDeclaration|ClassExpression;
}