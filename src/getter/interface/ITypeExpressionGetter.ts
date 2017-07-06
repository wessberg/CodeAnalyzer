import {ParameterDeclaration, TypeAliasDeclaration, TypeNode} from "typescript";
import {TypeExpression} from "../../identifier/interface/IIdentifier";

export interface ITypeExpressionGetter {
	getTypeExpression (statement: ParameterDeclaration|TypeAliasDeclaration|TypeNode): TypeExpression;
}