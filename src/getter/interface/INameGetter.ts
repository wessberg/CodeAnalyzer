import {DeclarationName, Expression, Node, Statement, TypeNode, TypeReferenceNode} from "typescript";
import {ArbitraryValue} from "../../service/interface/ISimpleLanguageService";

export interface INameGetter {
	getName (statement: Statement | Expression | Node | TypeNode | TypeReferenceNode): string | null;
	getNameOfMember (name: DeclarationName | Expression, allowNonStringNames?: boolean, forceNoBindingIdentifier?: boolean): ArbitraryValue;
}