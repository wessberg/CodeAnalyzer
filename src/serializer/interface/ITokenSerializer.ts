import {BinaryOperator, NodeFlags, SyntaxKind, TypeNode} from "typescript";
import {IBindingIdentifier} from "../../model/interface/IBindingIdentifier";
import {ArbitraryValue, TypeExpression} from "../../service/interface/ICodeAnalyzer";

export interface ITokenSerializer {
	serializeFlag (flag: NodeFlags): string|null;
	marshalToken (token: SyntaxKind|BinaryOperator|TypeNode): ArbitraryValue;
	serializeTypeExpression (expression: TypeExpression): string;
	serializeToken (token: SyntaxKind|TypeNode): string|IBindingIdentifier;
}