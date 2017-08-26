import {FormattedExpression} from "../../formatter/expression/formatted-expression/i-formatted-expression";
import {AstNode} from "../../type/ast-node";
import {NodeArray} from "typescript";

export interface ICacheServiceBase {
	mapFormattedExpressionToStatement (formattedExpression: FormattedExpression, statement: AstNode|NodeArray<AstNode>): void;
	getStatementsForFormattedExpression (formattedExpression: FormattedExpression): Set<AstNode|NodeArray<AstNode>>;
	getFormattedExpressionsForStatement (statement: AstNode|NodeArray<AstNode>): Set<FormattedExpression>;
}