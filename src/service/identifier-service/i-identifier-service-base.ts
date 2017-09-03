import {Identifier, NodeArray} from "typescript";
import {AstNode} from "../../type/ast-node/ast-node";
import {IFormattedIdentifier} from "@wessberg/type";

export interface IIdentifierServiceBase {
	getIdentifiersForFile (file: string): IFormattedIdentifier[];
	getIdentifiersForStatement (statement: Identifier): IFormattedIdentifier[];
	getIdentifiersForStatements (statements: NodeArray<AstNode>): IFormattedIdentifier[];
}