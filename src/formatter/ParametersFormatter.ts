import {ArrowFunction, ConstructorDeclaration, FunctionDeclaration, GetAccessorDeclaration, MethodDeclaration, ParameterDeclaration, SetAccessorDeclaration} from "typescript";
import {IParametersFormatter} from "./interface/IParametersFormatter";
import {isArrayBindingPattern, isObjectBindingPattern, isOmittedExpression} from "../predicate/PredicateFunctions";
import {identifierUtil, mapper, nameGetter, sourceFilePropertiesGetter, tokenSerializer, tracer, typeExpressionGetter, typeUtil, valueExpressionGetter, valueResolvedGetter} from "../services";
import {IdentifierMapKind, INonNullableValueable, IParameter, ParameterKind} from "../identifier/interface/IIdentifier";

/**
 * Formats any kind of relevant Statement into an array of IParameters.
 */
export class ParametersFormatter implements IParametersFormatter {

	/**
	 * Takes the parameters from the given declaration and returns an array of IParameters.
	 * @param {ConstructorDeclaration|MethodDeclaration|FunctionDeclaration|ArrowFunction|GetAccessorDeclaration|SetAccessorDeclaration} declaration
	 * @returns {IParameter[]}
	 */
	public format (declaration: ConstructorDeclaration|MethodDeclaration|FunctionDeclaration|ArrowFunction|GetAccessorDeclaration|SetAccessorDeclaration): IParameter[] {
		return declaration.parameters.map(param => this.formatParameter(param));
	}

	/**
	 * Formats a concrete ParameterDeclaration and returns an IParameter.
	 * @param {ParameterDeclaration} parameter
	 * @returns {IParameter}
	 */
	private formatParameter (parameter: ParameterDeclaration): IParameter {
		const filePath = sourceFilePropertiesGetter.getSourceFileProperties(parameter).filePath;
		const startsAt = parameter.pos;
		const endsAt = parameter.end;

		const parameterKind = isObjectBindingPattern(parameter.name)
			? ParameterKind.OBJECT_BINDING
			: isArrayBindingPattern(parameter.name)
				? ParameterKind.ARRAY_BINDING
				: ParameterKind.STANDARD;

		const name: (string|undefined)[] = [];
		const nameFormatted: string[] = [];
		if (isObjectBindingPattern(parameter.name)) {
			const elements = parameter.name.elements;
			nameFormatted.push("{");
			elements.forEach((binding, index) => {
				const named = nameGetter.getName(binding);
				name.push(named);
				nameFormatted.push(named);
				if (index !== elements.length - 1) nameFormatted.push(",");
			});
			nameFormatted.push("}");
		}

		else if (isArrayBindingPattern(parameter.name)) {
			nameFormatted.push("[");
			const elements = parameter.name.elements;
			elements.forEach((binding, index) => {
				if (isOmittedExpression(binding)) {
					name.push(undefined);
					nameFormatted.push(",");
				} else {
					const named = nameGetter.getName(binding);
					name.push(named);
					nameFormatted.push(named);
					if (index !== elements.length - 1) nameFormatted.push(",");
				}
			});
		}

		else {
			const named = <string>nameGetter.getNameOfMember(parameter.name, false, true);
			name.push(named);
			nameFormatted.push(named);
		}

		const typeExpression = parameter.type == null ? null : typeExpressionGetter.getTypeExpression(parameter);
		const typeFlattened = typeExpression == null ? null : tokenSerializer.serializeTypeExpression(typeExpression);
		const typeBindings = typeExpression == null ? null : typeUtil.takeTypeBindings(typeExpression);
		const valueExpression = parameter.initializer != null ? valueExpressionGetter.getValueExpression(parameter.initializer) : null;
		const scope = tracer.traceThis(parameter);

		const map: IParameter = identifierUtil.setKind({
			___kind: IdentifierMapKind.PARAMETER,
			filePath,
			startsAt,
			endsAt,
			parameterKind,
			name,
			nameFormatted,
			type: {
				expression: typeExpression,
				flattened: typeFlattened,
				bindings: typeBindings
			},
			value: {
				expression: valueExpression,
				resolving: false,
				resolved: undefined,
				resolvedPrecompute: undefined,

				/**
				 * Returns true if a value has been resolved previously.
				 * @returns {boolean}
				 */
				hasDoneFirstResolve () {
					return map.value.resolved !== undefined;
				},

				/**
				 * Resolves/computes a value for the associated value expression.
				 * @returns {ArbitraryValue}
				 */
				resolve () {
					if (map.value.expression == null) {
						map.value.resolved = map.value.resolvedPrecompute = null;
					} else {
						const [computed, flattened] = valueResolvedGetter.getValueResolved(<INonNullableValueable>map.value, parameter, scope);
						map.value.resolved = computed;
						map.value.resolvedPrecompute = flattened;
					}
					return map.value.resolved;
				}
			}
		}, IdentifierMapKind.PARAMETER);

		mapper.set(map, parameter);
		return map;
	}

}