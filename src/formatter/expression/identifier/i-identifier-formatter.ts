import {Identifier} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedIdentifier} from "@wessberg/type";

export interface IIdentifierFormatter extends IFormattedExpressionFormatter {
	format (expression: Identifier): IFormattedIdentifier;
}