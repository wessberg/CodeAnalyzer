import {INonNullableValueable} from "../../interface/ISimpleLanguageService";
import {Statement, Expression, Node} from "typescript";

export interface IValueResolvedGetter {
	getValueResolved (valueable: INonNullableValueable, from: Statement | Expression | Node, scope: string | null, takeKey?: string | number): string | null;
}