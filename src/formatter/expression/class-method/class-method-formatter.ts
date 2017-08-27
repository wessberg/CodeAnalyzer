import {IClassMethodFormatter} from "./i-class-method-formatter";
import {MethodDeclaration} from "typescript";
import {FormattedExpressionKind, IFormattedClassMethod} from "@wessberg/type";
import {MethodBaseFormatter} from "../method-base/method-base-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FunctionLikeFormatterGetter} from "../function-like/function-like-formatter-getter";
import {PropertyNameFormatterGetter} from "../property-name/property-name-formatter-getter";
import {DecoratorFormatterGetter} from "../decorator/decorator-formatter-getter";
import {ParameterTypeFormatterGetter} from "../../type/parameter-type-formatter/parameter-type-formatter-getter";
import {ClassElementFormatterGetter} from "../class-element/class-element-formatter-getter";
import {TypeParameterFormatterGetter} from "../../type/type-parameter-formatter/type-parameter-formatter-getter";

/**
 * A class that can format MethodDeclarations
 */
export class ClassMethodFormatter extends MethodBaseFormatter implements IClassMethodFormatter {
	constructor (private classElementFormatter: ClassElementFormatterGetter,
							 astMapper: AstMapperGetter,
							 functionLikeFormatter: FunctionLikeFormatterGetter,
							 propertyNameFormatter: PropertyNameFormatterGetter,
							 decoratorFormatter: DecoratorFormatterGetter,
							 parameterTypeFormatter: ParameterTypeFormatterGetter,
							 typeParameterFormatter: TypeParameterFormatterGetter) {
		super(astMapper, functionLikeFormatter, propertyNameFormatter, decoratorFormatter, parameterTypeFormatter, typeParameterFormatter);
	}

	/**
	 * Formats the given MethodDeclaration into a IFormattedClassMethod
	 * @param {MethodDeclaration} expression
	 * @returns {IFormattedMethod}
	 */
	public format (expression: MethodDeclaration): IFormattedClassMethod {
		const result: IFormattedClassMethod = {
			...super.format(expression),
			...this.classElementFormatter().format(expression),
			expressionKind: FormattedExpressionKind.CLASS_METHOD
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}
}