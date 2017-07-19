import {Declaration, Expression, Node, Statement} from "typescript";
import {IValueableFormatter} from "./interface/IValueableFormatter";
import {valueExpressionGetter, valueResolvedGetter} from "../services";
import {INonNullableValueable, IValueable} from "../identifier/interface/IIdentifier";

/**
 * A class that can format any Statement to an IValuable.
 */
export class ValueableFormatter implements IValueableFormatter {
	/**
	 * A map between Statements and IValueables.
	 * @type {Map<Node?, IValueable>}
	 */
	private static readonly cachedValueables: Map<Statement|Expression|Declaration|Node|undefined, IValueable> = new Map();

	/**
	 * Formats the given Statement into an IValueable.
	 * @param {Statement|Expression|Declaration|Node} statement
	 * @param {string|number} [takeKey]
	 * @param {Statement|Expression|Declaration|Node} [takeValueExpressionFrom]
	 * @returns {IValueable}
	 */
	public format (statement: Statement|Expression|Declaration|Node|undefined, takeKey?: string|number, takeValueExpressionFrom: Statement|Expression|Declaration|Node|undefined = statement): IValueable {
		const cached = ValueableFormatter.cachedValueables.get(statement);
		if (cached != null && takeKey == null) return cached;

		const valueExpression = statement == null || takeValueExpressionFrom == null ? null : valueExpressionGetter.getValueExpression(takeValueExpressionFrom);
		const value: IValueable = {
			expression: valueExpression,
			resolved: undefined,
			resolvedPrecompute: undefined,

			/**
			 * Returns true if a value has been resolved previously.
			 * @returns {boolean}
			 */
			hasDoneFirstResolve () {
				return value.resolved !== undefined;
			},
			resolving: false,

			/**
			 * Resolves a value for the value expression.
			 * @returns {ArbitraryValue}
			 */
			resolve () {
				if (statement == null || value.expression == null) {
					value.resolved = value.resolvedPrecompute = null;
				} else {
					const [computed, flattened] = valueResolvedGetter.getValueResolved(<INonNullableValueable>value, statement, takeKey);
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