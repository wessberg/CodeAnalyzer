import {PropertyDeclaration} from "typescript";
import {isStaticKeyword} from "../predicate/PredicateFunctions";
import {IPropFormatter} from "./interface/IPropFormatter";
import {decoratorsFormatter, identifierUtil, mapper, modifiersFormatter, nameGetter, sourceFilePropertiesGetter, tokenSerializer, tracer, typeExpressionGetter, typeUtil, valueExpressionGetter, valueResolvedGetter} from "../services";
import {IdentifierMapKind, INonNullableValueable, IPropDeclaration} from "../identifier/interface/IIdentifier";

export class PropFormatter implements IPropFormatter {

	/**
	 * Takes a PropertyDeclaration and returns an IPropDeclaration.
	 * @param {PropertyDeclaration} declaration
	 * @param {string} className
	 * @returns {IPropDeclaration}
	 */
	public format (declaration: PropertyDeclaration, className: string): IPropDeclaration {
		const filePath = sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;
		const startsAt = declaration.pos;
		const endsAt = declaration.end;
		const name = <string>nameGetter.getNameOfMember(declaration.name, false, true);
		const typeExpression = declaration.type == null ? null : typeExpressionGetter.getTypeExpression(declaration.type);
		const typeFlattened = typeExpression == null ? null : tokenSerializer.serializeTypeExpression(typeExpression);
		const typeBindings = typeExpression == null ? null : typeUtil.takeTypeBindings(typeExpression);
		const valueExpression = declaration.initializer == null ? null : valueExpressionGetter.getValueExpression(declaration.initializer);
		const isStatic = declaration.modifiers == null ? false : declaration.modifiers.find(modifier => isStaticKeyword(modifier)) != null;
		const scope = tracer.traceThis(declaration);

		const map: IPropDeclaration = identifierUtil.setKind({
			___kind: IdentifierMapKind.PROP,
			isStatic,
			modifiers: modifiersFormatter.format(declaration),
			startsAt,
			endsAt,
			name,
			filePath,
			className,
			type: {
				expression: typeExpression,
				flattened: typeFlattened,
				bindings: typeBindings
			},
			decorators: decoratorsFormatter.format(declaration),
			value: {
				expression: valueExpression,
				resolving: false,
				resolved: undefined,
				resolvedPrecompute: undefined,
				hasDoneFirstResolve () {
					return map.value.resolved !== undefined;
				},
				resolve () {
					if (map.value.expression == null) {
						map.value.resolved = map.value.resolvedPrecompute = null;
					} else {
						const [computed, flattened] = valueResolvedGetter.getValueResolved(<INonNullableValueable>map.value, declaration, scope);
						map.value.resolved = computed;
						map.value.resolvedPrecompute = flattened;
					}
					return map.value.resolved;
				}
			}
		}, IdentifierMapKind.PROP);

		mapper.set(map, declaration);
		return map;
	}

}