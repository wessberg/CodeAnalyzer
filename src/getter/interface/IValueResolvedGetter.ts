import {Expression, Node, Statement} from "typescript";
import {ArbitraryValue, IIdentifier, INonNullableValueable} from "../../service/interface/ICodeAnalyzer";
import {BindingIdentifier} from "../../model/BindingIdentifier";

export interface IFlattenOptions {
	shouldCompute: boolean;
	forceNoQuoting: boolean;
}

export interface ITracedExpressionsFormatterOptions {
	traced: IIdentifier;
	from: Statement|Expression|Node;
	identifier: BindingIdentifier;
	scope: string;
	isSignature: boolean;
	next: ArbitraryValue|undefined;
}

export interface IValueResolvedGetter {
	getValueResolved (valueable: INonNullableValueable, from: Statement|Expression|Node, takeKey?: string|number): [ArbitraryValue, ArbitraryValue];
}