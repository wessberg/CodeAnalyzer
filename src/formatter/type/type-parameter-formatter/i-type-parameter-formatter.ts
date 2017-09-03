import {IFormattedTypeParameter} from "@wessberg/type";
import {TypeParameterDeclaration} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface ITypeParameterFormatter extends IFormattedExpressionFormatter {
	format (expression: TypeParameterDeclaration): IFormattedTypeParameter;
}