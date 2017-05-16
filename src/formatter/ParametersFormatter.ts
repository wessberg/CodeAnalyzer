import {ConstructorDeclaration, FunctionDeclaration, MethodDeclaration, ParameterDeclaration} from "typescript";
import {INameGetter} from "../getter/interface/INameGetter";
import {ITypeExpressionGetter} from "../getter/interface/ITypeExpressionGetter";
import {IValueExpressionGetter} from "../getter/interface/IValueExpressionGetter";
import {IValueResolvedGetter} from "../getter/interface/IValueResolvedGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {ITokenSerializer} from "../serializer/interface/ITokenSerializer";
import {IdentifierMapKind, INonNullableValueable, IParameter, ParameterKind} from "../service/interface/ICodeAnalyzer";
import {ITracer} from "../tracer/interface/ITracer";
import {ITypeUtil} from "../util/interface/ITypeUtil";
import {IParametersFormatter} from "./interface/IParametersFormatter";
import {isArrayBindingPattern, isObjectBindingPattern, isOmittedExpression} from "../predicate/PredicateFunctions";

export class ParametersFormatter implements IParametersFormatter {

	constructor (private mapper: IMapper,
							 private tracer: ITracer,
							 private nameGetter: INameGetter,
							 private typeExpressionGetter: ITypeExpressionGetter,
							 private valueResolvedGetter: IValueResolvedGetter,
							 private valueExpressionGetter: IValueExpressionGetter,
							 private tokenSerializer: ITokenSerializer,
							 private typeUtil: ITypeUtil) {
	}

	/**
	 * Takes the parameters from a ConstructorDeclaration or a MethodDeclaration and returns an array of IParameters.
	 * @param {ConstructorDeclaration | MethodDeclaration | FunctionDeclaration} declaration
	 * @returns {IParameter[]}
	 */
	public format (declaration: ConstructorDeclaration|MethodDeclaration|FunctionDeclaration): IParameter[] {
		return declaration.parameters.map(param => this.formatParameter(param));
	}

	/**
	 * Formats a concrete ParameterDeclaration and returns an IParameter.
	 * @param {ParameterDeclaration} parameter
	 * @returns {IParameter}
	 */
	private formatParameter (parameter: ParameterDeclaration): IParameter {
		const startsAt = parameter.pos;
		const endsAt = parameter.end;

		const parameterKind = isObjectBindingPattern(parameter.name)
			? ParameterKind.OBJECT_BINDING
			: isArrayBindingPattern(parameter.name)
				? ParameterKind.ARRAY_BINDING
				: ParameterKind.STANDARD;

		const name: (string|undefined)[] = [];
		if (isObjectBindingPattern(parameter.name)) {
			parameter.name.elements.forEach(binding => {
				name.push(<string>this.nameGetter.getName(binding));
			});
		}

		else if (isArrayBindingPattern(parameter.name)) {
			parameter.name.elements.forEach((binding) => {
				if (isOmittedExpression(binding)) name.push(undefined);
				name.push(<string>this.nameGetter.getName(binding));
			});
		}

		else {
			name.push(<string>this.nameGetter.getNameOfMember(parameter.name, false, true));
		}

		const typeExpression = parameter.type == null ? null : this.typeExpressionGetter.getTypeExpression(parameter);
		const typeFlattened = typeExpression == null ? null : this.tokenSerializer.serializeTypeExpression(typeExpression);
		const typeBindings = typeExpression == null ? null : this.typeUtil.takeTypeBindings(typeExpression);
		const valueExpression = parameter.initializer != null ? this.valueExpressionGetter.getValueExpression(parameter.initializer) : null;
		const that = this;
		const scope = this.tracer.traceThis(parameter);

		const map: IParameter = {
			___kind: IdentifierMapKind.PARAMETER,
			startsAt,
			endsAt,
			parameterKind,
			name,
			type: {
				expression: typeExpression,
				flattened: typeFlattened,
				bindings: typeBindings
			},
			value: {
				expression: valueExpression,
				resolving: false,
				resolved: undefined,
				hasDoneFirstResolve () {
					return map.value.resolved !== undefined;
				},
				resolve () {
					map.value.resolved = map.value.expression == null ? null : that.valueResolvedGetter.getValueResolved(<INonNullableValueable>map.value, parameter, scope);
					return map.value.resolved;
				}
			}
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.PARAMETER,
			enumerable: false
		});
		this.mapper.set(map, parameter);
		return map;
	}

}