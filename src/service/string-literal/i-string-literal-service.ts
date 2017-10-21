import {ILiteralService} from "../literal/i-literal-service";
import {StringLiteral} from "typescript";

export interface IStringLiteralService extends ILiteralService<StringLiteral, string> {
}