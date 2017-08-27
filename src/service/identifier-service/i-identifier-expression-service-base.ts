import {Identifier, NodeArray} from "typescript";
import {AstNode} from "../../type/ast-node";
import {IFormattedIdentifier} from "../../formatter/expression/identifier/i-formatted-identifier";

export interface IIdentifierExpressionServiceBase {
	getIdentifiersForFile (file: string): IFormattedIdentifier[];
	getIdentifiersForStatement (statement: Identifier): IFormattedIdentifier[];
	getIdentifiersForStatements (statements: NodeArray<AstNode>): IFormattedIdentifier[];
}