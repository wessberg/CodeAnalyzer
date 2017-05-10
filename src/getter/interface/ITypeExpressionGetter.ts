import {TypeExpression} from "../../service/interface/ISimpleLanguageService";
import {ParameterDeclaration, TypeAliasDeclaration, TypeNode} from "typescript";

export interface ITypeExpressionGetter {
	getTypeExpression (statement: ParameterDeclaration | TypeAliasDeclaration | TypeNode): TypeExpression;
}