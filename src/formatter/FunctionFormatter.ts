import {FunctionLikeFormatter} from "./FunctionLikeFormatter";
import {IFunctionFormatter} from "./interface/IFunctionFormatter";
import {IdentifierMapKind, IFunctionDeclaration, INonNullableValueable} from "../interface/ISimpleLanguageService";
import {FunctionDeclaration} from "typescript";
import {ICache} from "../cache/interface/ICache";
import {IMapper} from "../mapper/interface/IMapper";
import {ITracer} from "../tracer/interface/ITracer";
import {IValueExpressionGetter} from "src/getter/interface/IValueExpressionGetter";
import {IValueResolvedGetter} from "src/getter/interface/IValueResolvedGetter";
import {ISourceFilePropertiesGetter} from "src/getter/interface/ISourceFilePropertiesGetter";
import {IDecoratorsFormatter} from "src/formatter/interface/IDecoratorsFormatter";
import {INameGetter} from "../getter/interface/INameGetter";
import {IModifiersFormatter} from "./interface/IModifiersFormatter";
import {IParametersFormatter} from "./interface/IParametersFormatter";

export class FunctionFormatter extends FunctionLikeFormatter implements IFunctionFormatter {

	constructor (private mapper: IMapper,
							 private tracer: ITracer,
							 private cache: ICache,
							 private nameGetter: INameGetter,
							 private valueExpressionGetter: IValueExpressionGetter,
							 private valueResolvedGetter: IValueResolvedGetter,
							 sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 decoratorsFormatter: IDecoratorsFormatter,
							 modifiersFormatter: IModifiersFormatter,
							 parametersFormatter: IParametersFormatter) {
		super(sourceFilePropertiesGetter, decoratorsFormatter, modifiersFormatter, parametersFormatter);
	}

	/**
	 * Takes a FunctionDeclaration and returns an IFunctionDeclaration.
	 * @param {FunctionDeclaration} declaration
	 * @returns {IFunctionDeclaration}
	 */
	public format (declaration: FunctionDeclaration): IFunctionDeclaration {
		const name = declaration.name == null ? "anonymous" : <string>this.nameGetter.getNameOfMember(declaration.name, false, true);
		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;

		const cached = this.cache.getCachedFunction(filePath, name);
		if (cached != null && !this.cache.cachedFunctionNeedsUpdate(cached.content)) return cached.content;

		const valueExpression = declaration.body == null ? null : this.valueExpressionGetter.getValueExpression(declaration.body);
		const that = this;
		const scope = this.tracer.traceThis(declaration);

		const map: IFunctionDeclaration = {
			...this.formatFunctionLikeDeclaration(declaration),
			...{
				___kind: IdentifierMapKind.FUNCTION,
				name,
				filePath,
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
			}
		};

		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.FUNCTION,
			enumerable: false
		});
		this.mapper.set(map, declaration);
		this.cache.setCachedFunction(filePath, map);
		return map;
	}
}