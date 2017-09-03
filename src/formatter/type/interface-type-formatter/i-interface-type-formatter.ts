import {IFormattedInterfaceType} from "@wessberg/type";
import {InterfaceDeclaration} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface IInterfaceTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: InterfaceDeclaration): IFormattedInterfaceType;
}