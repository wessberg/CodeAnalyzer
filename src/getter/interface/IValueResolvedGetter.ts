import {Expression, Node, Statement} from "typescript";
import {INonNullableValueable} from "../../service/interface/ISimpleLanguageService";

export interface IValueResolvedGetter {
	getValueResolved (valueable: INonNullableValueable, from: Statement | Expression | Node, scope: string | null, takeKey?: string | number, insideThisScope?: boolean): string | null;
}