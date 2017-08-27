import {AstNode} from "../../type/ast-node/ast-node";
import {NodeArray} from "typescript";
import {FormattedExpression} from "@wessberg/type";

export interface IAstMapper {
	mapFormattedExpressionToStatement (formattedExpression: FormattedExpression, statement: AstNode|NodeArray<AstNode>): void;
	getStatementsForFormattedExpression (formattedExpression: FormattedExpression): Set<AstNode|NodeArray<AstNode>>;
	getFormattedExpressionsForStatement (statement: AstNode|NodeArray<AstNode>): Set<FormattedExpression>;
}