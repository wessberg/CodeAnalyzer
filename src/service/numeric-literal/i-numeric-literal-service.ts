import {ILiteralService} from "../literal/i-literal-service";
import {NumericLiteral} from "typescript";

export interface INumericLiteralService extends ILiteralService<NumericLiteral, number> {
}