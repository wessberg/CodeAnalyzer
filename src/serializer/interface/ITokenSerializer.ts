import {NodeFlags, SyntaxKind, BinaryOperator, TypeNode} from "typescript";
import {ArbitraryValue, TypeExpression} from "../../service/interface/ISimpleLanguageService";
import {IBindingIdentifier} from "../../model/interface/IBindingIdentifier";


export interface ITokenSerializer {
	serializeFlag (flag: NodeFlags): string | null;
	marshalToken (token: SyntaxKind | BinaryOperator | TypeNode): ArbitraryValue;
	serializeTypeExpression (expression: TypeExpression): string;
	serializeToken (token: SyntaxKind | TypeNode): string | IBindingIdentifier;
}