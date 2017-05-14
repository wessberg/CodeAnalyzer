import {CallExpression, Expression, NewExpression} from "typescript";
import {IValueExpressionGetter} from "../getter/interface/IValueExpressionGetter";
import {IValueResolvedGetter} from "../getter/interface/IValueResolvedGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {IArgument, IdentifierMapKind, INonNullableValueable} from "../service/interface/ICodeAnalyzer";
import {ITracer} from "../tracer/interface/ITracer";
import {IArgumentsFormatter} from "./interface/IArgumentsFormatter";

export class ArgumentsFormatter implements IArgumentsFormatter {

	constructor (private mapper: IMapper,
							 private tracer: ITracer,
							 private valueResolvedGetter: IValueResolvedGetter,
							 private valueExpressionGetter: IValueExpressionGetter) {
	}

	/**
	 * Takes the arguments from a CallExpression and returns an array of IArguments.
	 * @param {CallExpression} declaration
	 * @returns {IArgument[]}
	 */
	public format (declaration: CallExpression|NewExpression): IArgument[] {
		return declaration.arguments == null ? [] : declaration.arguments.map(arg => this.formatArgument(arg));
	}

	/**
	 * Formats a concrete ParameterDeclaration and returns an IArgument.
	 * @param {Expression} argument
	 * @returns {IArgument}
	 */
	private formatArgument (argument: Expression): IArgument {
		const startsAt = argument.pos;
		const endsAt = argument.end;
		const valueExpression = this.valueExpressionGetter.getValueExpression(argument);
		const that = this;
		const scope = this.tracer.traceThis(argument);

		const map: IArgument = {
			___kind: IdentifierMapKind.ARGUMENT,
			startsAt,
			endsAt,
			value: {
				expression: valueExpression,
				resolving: false,
				resolved: undefined,
				hasDoneFirstResolve () {
					return map.value.resolved !== undefined;
				},
				resolve () {
					map.value.resolved = map.value.expression == null ? null : that.valueResolvedGetter.getValueResolved(<INonNullableValueable>map.value, argument, scope);
					return map.value.resolved;
				}
			}
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.ARGUMENT,
			enumerable: false
		});
		this.mapper.set(map, argument);
		return map;
	}
}