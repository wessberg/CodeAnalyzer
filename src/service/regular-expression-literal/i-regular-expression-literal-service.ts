import {ILiteralService} from "../literal/i-literal-service";
import {RegularExpressionLiteral} from "typescript";

export interface IRegularExpressionLiteralService extends ILiteralService<RegularExpressionLiteral, RegExp> {
}