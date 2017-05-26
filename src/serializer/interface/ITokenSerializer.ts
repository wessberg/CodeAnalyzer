import {BinaryOperator, Expression, Node, NodeFlags, Statement, SyntaxKind, TypeNode} from "typescript";
import {IBindingIdentifier} from "../../model/interface/IBindingIdentifier";
import {ArbitraryValue, TypeExpression} from "../../service/interface/ICodeAnalyzer";

export interface ITokenSerializer {
	serializeFlag (flag: NodeFlags): string|null;
	marshalToken (token: SyntaxKind|BinaryOperator|TypeNode, parent: Statement|Expression|Node): ArbitraryValue;
	serializeTypeExpression (expression: TypeExpression): string;
	serializeToken (token: SyntaxKind|TypeNode, parent: Statement|Expression|Node): string|IBindingIdentifier;
}