import {PropertyDeclaration} from "typescript";
import {INameGetter} from "../getter/interface/INameGetter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {ITypeExpressionGetter} from "../getter/interface/ITypeExpressionGetter";
import {IValueExpressionGetter} from "../getter/interface/IValueExpressionGetter";
import {IValueResolvedGetter} from "../getter/interface/IValueResolvedGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {isStaticKeyword} from "../predicate/PredicateFunctions";
import {ITokenSerializer} from "../serializer/interface/ITokenSerializer";
import {IdentifierMapKind, INonNullableValueable, IPropDeclaration} from "../service/interface/ISimpleLanguageService";
import {ITracer} from "../tracer/interface/ITracer";
import {ITypeUtil} from "../util/interface/ITypeUtil";
import {IDecoratorsFormatter} from "./interface/IDecoratorsFormatter";
import {IModifiersFormatter} from "./interface/IModifiersFormatter";
import {IPropFormatter} from "./interface/IPropFormatter";

export class PropFormatter implements IPropFormatter {

	constructor (private mapper: IMapper,
							 private tracer: ITracer,
							 private modifiersFormatter: IModifiersFormatter,
							 private decoratorsFormatter: IDecoratorsFormatter,
							 private sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 private valueExpressionGetter: IValueExpressionGetter,
							 private valueResolvedGetter: IValueResolvedGetter,
							 private typeExpressionGetter: ITypeExpressionGetter,
							 private nameGetter: INameGetter,
							 private tokenSerializer: ITokenSerializer,
							 private typeUtil: ITypeUtil) {}

	/**
	 * Takes a PropertyDeclaration and returns an IPropDeclaration.
	 * @param {PropertyDeclaration} declaration
	 * @param {string} className
	 * @returns {IPropDeclaration}
	 */
	public format (declaration: PropertyDeclaration, className: string): IPropDeclaration {
		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;
		const startsAt = declaration.pos;
		const endsAt = declaration.end;
		const name = <string>this.nameGetter.getNameOfMember(declaration.name, false, true);
		const typeExpression = declaration.type == null ? null : this.typeExpressionGetter.getTypeExpression(declaration.type);
		const typeFlattened = typeExpression == null ? null : this.tokenSerializer.serializeTypeExpression(typeExpression);
		const typeBindings = typeExpression == null ? null : this.typeUtil.takeTypeBindings(typeExpression);
		const valueExpression = declaration.initializer == null ? null : this.valueExpressionGetter.getValueExpression(declaration.initializer);
		const that = this;
		const isStatic = declaration.modifiers == null ? false : declaration.modifiers.find(modifier => isStaticKeyword(modifier)) != null;
		const scope = this.tracer.traceThis(declaration);

		const map: IPropDeclaration = {
			___kind: IdentifierMapKind.PROP,
			isStatic,
			modifiers: this.modifiersFormatter.format(declaration),
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
			decorators: this.decoratorsFormatter.format(declaration),
			value: {
				expression: valueExpression,
				resolving: false,
				resolved: undefined,
				hasDoneFirstResolve () {return map.value.resolved !== undefined;},
				resolve () {
					map.value.resolved = map.value.expression == null ? null : that.valueResolvedGetter.getValueResolved(<INonNullableValueable>map.value, declaration, scope);
					return map.value.resolved;
				}
			}
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.PROP,
			enumerable: false
		});
		this.mapper.set(map, declaration);
		return map;
	}

}