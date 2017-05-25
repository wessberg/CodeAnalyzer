import {Declaration, Expression, Node, Statement} from "typescript";
import {INonNullableValueable, IValueable} from "../service/interface/ICodeAnalyzer";
import {IValueExpressionGetter} from "../getter/interface/IValueExpressionGetter";
import {IValueResolvedGetter} from "../getter/interface/IValueResolvedGetter";
import {ITracer} from "../tracer/interface/ITracer";
import {IValueableFormatter} from "./interface/IValueableFormatter";

export class ValueableFormatter implements IValueableFormatter {
	private static readonly cachedValueables: Map<Statement|Expression|Declaration|Node|undefined, IValueable> = new Map();

	constructor (private tracer: ITracer,
							 private valueExpressionGetter: IValueExpressionGetter,
							 private valueResolvedGetter: IValueResolvedGetter) {
	}
	/**
	 * Formats the given Statement into an IValueable.
	 * @param {Statement|Expression|Declaration|Node} statement
	 * @param {string|number} [takeKey]
	 * @param {Statement|Expression|Declaration|Node} [takeValueExpressionFrom]
	 * @returns {IValueable}
	 */
	public format (statement: Statement|Expression|Declaration|Node|undefined, takeKey?: string|number, takeValueExpressionFrom?: Statement|Expression|Declaration|Node): IValueable {
		const cached = ValueableFormatter.cachedValueables.get(statement);
		if (cached != null && takeKey == null) return cached;

		const valueExpression = statement == null ? null : this.valueExpressionGetter.getValueExpression(takeValueExpressionFrom || statement);
		const scope = statement == null ? null : this.tracer.traceThis(statement);
		const that = this;
		const value: IValueable = {
			expression: valueExpression,
			resolved: undefined,
			resolvedPrecompute: undefined,
			hasDoneFirstResolve () {
				return value.resolved !== undefined;
			},
			resolving: false,
			resolve (insideThisScope: boolean = false) {
				if (statement == null || value.expression == null) {
					value.resolved = value.resolvedPrecompute = null;
				} else {
					const [computed, flattened] = that.valueResolvedGetter.getValueResolved(<INonNullableValueable>value, statement, scope, takeKey, insideThisScope);
					value.resolved = computed;
					value.resolvedPrecompute = flattened;
				}
				return value.resolved;
			}
		};
		ValueableFormatter.cachedValueables.set(statement, value);
		return value;
	}

}