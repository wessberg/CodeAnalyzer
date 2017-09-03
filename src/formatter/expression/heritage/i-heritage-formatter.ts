import {HeritageClause} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {FormattedHeritage} from "@wessberg/type";

export interface IHeritageFormatter extends IFormattedExpressionFormatter {
	format (expression: HeritageClause): FormattedHeritage;
}