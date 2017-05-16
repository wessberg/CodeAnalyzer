import {Declaration, Expression, Node, Statement} from "typescript";
import {INonNullableValueable, IValueable} from "../service/interface/ICodeAnalyzer";
import {IValueExpressionGetter} from "../getter/interface/IValueExpressionGetter";
import {IValueResolvedGetter} from "../getter/interface/IValueResolvedGetter";
import {ITracer} from "../tracer/interface/ITracer";
import {IValueableFormatter} from "./interface/IValueableFormatter";

export class ValueableFormatter implements IValueableFormatter {

	constructor (private tracer: ITracer,
							 private valueExpressionGetter: IValueExpressionGetter,
							 private valueResolvedGetter: IValueResolvedGetter) {
	}
	/**
	 * Formats the given Statement into an IValueable.
	 * @param {Statement|Expression|Declaration|Node} statement
	 * @param {string|number} [takeKey]
	 * @returns {IValueable}
	 */
	public format (statement: Statement|Expression|Declaration|Node|undefined, takeKey?: string|number): IValueable {
		const valueExpression = statement == null ? null : this.valueExpressionGetter.getValueExpression(statement);
		const scope = statement == null ? null : this.tracer.traceThis(statement);
		const that = this;
		const value: IValueable = {
			expression: valueExpression,
			resolved: undefined,
			hasDoneFirstResolve () {
				return value.resolved !== undefined;
			},
			resolving: false,
			resolve () {
				if (statement == null) return null;
				value.resolved = value.expression == null ? null : that.valueResolvedGetter.getValueResolved(<INonNullableValueable>value, statement, scope, takeKey);
				return value.resolved;
			}
		};
		return value;
	}


}