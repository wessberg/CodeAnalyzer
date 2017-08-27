import {Block} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedBlock} from "@wessberg/type";

export interface IBlockFormatter extends IFormattedExpressionFormatter {
	format (expression: Block): IFormattedBlock;
}