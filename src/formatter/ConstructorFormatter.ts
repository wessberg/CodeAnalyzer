import {IModifiersFormatter} from "src/formatter/interface/IModifiersFormatter";
import {ConstructorDeclaration} from "typescript";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {IConstructorDeclaration, IdentifierMapKind, INonNullableValueable} from "../service/interface/ICodeAnalyzer";
import {FunctionLikeFormatter} from "./FunctionLikeFormatter";
import {IConstructorFormatter} from "./interface/IConstructorFormatter";
import {IDecoratorsFormatter} from "./interface/IDecoratorsFormatter";
import {IParametersFormatter} from "./interface/IParametersFormatter";
import {IValueExpressionGetter} from "../getter/interface/IValueExpressionGetter";
import {ITracer} from "../tracer/interface/ITracer";
import {IValueResolvedGetter} from "../getter/interface/IValueResolvedGetter";

export class ConstructorFormatter extends FunctionLikeFormatter implements IConstructorFormatter {
	constructor (private mapper: IMapper,
							 private tracer: ITracer,
							 private valueExpressionGetter: IValueExpressionGetter,
							 private valueResolvedGetter: IValueResolvedGetter,
							 sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 decoratorsFormatter: IDecoratorsFormatter,
							 modifiersFormatter: IModifiersFormatter,
							 parametersFormatter: IParametersFormatter) {

		super(sourceFilePropertiesGetter, decoratorsFormatter, modifiersFormatter, parametersFormatter);
	}

	/**
	 * Takes a ConstructorDeclaration and returns an IConstructorDeclaration.
	 * @param {ConstructorDeclaration} declaration
	 * @param {string} className
	 * @returns {IConstructorDeclaration}
	 */
	public format (declaration: ConstructorDeclaration, className: string): IConstructorDeclaration {
		const name = "constructor";

		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;
		const valueExpression = declaration.body == null ? null : this.valueExpressionGetter.getValueExpression(declaration.body);
		const that = this;
		const scope = this.tracer.traceThis(declaration);

		const map: IConstructorDeclaration = {
			...this.formatFunctionLikeDeclaration(declaration),
			...{
				___kind: IdentifierMapKind.CONSTRUCTOR,
				name,
				className,
				filePath,
				value: {
					expression: valueExpression,
					resolving: false,
					resolved: undefined,
					resolvedPrecompute: undefined,
					hasDoneFirstResolve () {
						return map.value.resolved !== undefined;
					},
					resolve (insideThisScope: boolean = false) {
						if (map.value.expression == null) {
							map.value.resolved = map.value.resolvedPrecompute = null;
						} else {
							const [computed, flattened] = that.valueResolvedGetter.getValueResolved(<INonNullableValueable>map.value, declaration, scope, undefined, insideThisScope);
							map.value.resolved = computed;
							map.value.resolvedPrecompute = flattened;
						}
						return map.value.resolved;
					}
				}
			}
		};

		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.CONSTRUCTOR,
			enumerable: false
		});
		this.mapper.set(map, declaration);
		return map;
	}
}