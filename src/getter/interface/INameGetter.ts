import {DeclarationName, Expression, Node, Statement, TypeNode, TypeReferenceNode} from "typescript";
import {BindingIdentifier} from "../../model/BindingIdentifier";

export interface INameGetter {
	getName (statement: Statement|Expression|Node|TypeNode|TypeReferenceNode): string;
	getNameOfMember (name: DeclarationName|Expression, allowNonStringNames?: boolean, forceNoBindingIdentifier?: boolean): string|RegExp|number|BindingIdentifier;
}