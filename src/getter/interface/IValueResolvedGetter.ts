import {Expression, Node, Statement} from "typescript";
import {BindingIdentifier} from "../../model/BindingIdentifier";
import {ArbitraryValue, IIdentifier, INonNullableValueable} from "../../identifier/interface/IIdentifier";

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