import {Expression, Node, Statement} from "typescript";
import {ArbitraryValue, INonNullableValueable} from "../../service/interface/ICodeAnalyzer";

export interface IFlattenOptions {
	shouldCompute: boolean;
	forceNoQuoting: boolean;
}

export interface IValueResolvedGetter {
	getValueResolved (valueable: INonNullableValueable, from: Statement|Expression|Node, scope: string|null, takeKey?: string|number, insideThisScope?: boolean): [ArbitraryValue, ArbitraryValue];
}