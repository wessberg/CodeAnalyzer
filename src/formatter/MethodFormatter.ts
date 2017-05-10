import {IMethodFormatter} from "./interface/IMethodFormatter";
import {FunctionLikeFormatter} from "./FunctionLikeFormatter";
import {MethodDeclaration} from "typescript";
import {IdentifierMapKind, IMethodDeclaration, INonNullableValueable} from "../service/interface/ISimpleLanguageService";
import {INameGetter} from "../getter/interface/INameGetter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {IDecoratorsFormatter} from "./interface/IDecoratorsFormatter";
import {IModifiersFormatter} from "./interface/IModifiersFormatter";
import {IParametersFormatter} from "./interface/IParametersFormatter";
import {IValueExpressionGetter} from "../getter/interface/IValueExpressionGetter";
import {isStaticKeyword} from "../predicate/PredicateFunctions";
import {ITracer} from "../tracer/interface/ITracer";
import {IValueResolvedGetter} from "../getter/interface/IValueResolvedGetter";

export class MethodFormatter extends FunctionLikeFormatter implements IMethodFormatter {

	constructor (private tracer: ITracer,
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
	 * Takes a MethodDeclaration and returns an IMethodDeclaration.
	 * @param {MethodDeclaration} declaration
	 * @param {string} className
	 * @returns {IMethodDeclaration}
	 */
	format (declaration: MethodDeclaration, className: string): IMethodDeclaration {
		const name = <string>this.nameGetter.getNameOfMember(declaration.name, false, true);

		const isStatic = declaration.modifiers == null ? false : declaration.modifiers.find(modifier => isStaticKeyword(modifier)) != null;
		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;
		const valueExpression = declaration.body == null ? null : this.valueExpressionGetter.getValueExpression(declaration.body);
		const that = this;
		const scope = this.tracer.traceThis(declaration);

		const map: IMethodDeclaration = {
			...this.formatFunctionLikeDeclaration(declaration),
			...{
				___kind: IdentifierMapKind.METHOD,
				isStatic,
				name,
				className,
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
			value: IdentifierMapKind.METHOD,
			enumerable: false
		});
		return map;
	}

}