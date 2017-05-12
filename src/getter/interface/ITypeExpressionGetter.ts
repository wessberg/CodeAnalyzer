import {ParameterDeclaration, TypeAliasDeclaration, TypeNode} from "typescript";
import {TypeExpression} from "../../service/interface/ISimpleLanguageService";

export interface ITypeExpressionGetter {
	getTypeExpression (statement: ParameterDeclaration | TypeAliasDeclaration | TypeNode): TypeExpression;
}