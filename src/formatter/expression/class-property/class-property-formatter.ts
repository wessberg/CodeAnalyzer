import {PropertyDeclaration} from "typescript";
import {IClassPropertyFormatter} from "./i-class-property-formatter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionKind, IFormattedClassProperty} from "@wessberg/type";
import {ExpressionFormatterGetter} from "../expression/expression-formatter-getter";
import {PropertyNameFormatterGetter} from "../property-name/property-name-formatter-getter";
import {TypeFormatterGetter} from "../../type/type-formatter/type-formatter-getter";
import {DecoratorFormatterGetter} from "../decorator/decorator-formatter-getter";
import {ClassElementFormatterGetter} from "../class-element/class-element-formatter-getter";

/**
 * A class that can format class properties
 */
export class ClassPropertyFormatter extends FormattedExpressionFormatter implements IClassPropertyFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private classElementFormatter: ClassElementFormatterGetter,
							 private decoratorFormatter: DecoratorFormatterGetter,
							 private typeFormatter: TypeFormatterGetter,
							 private propertyNameFormatter: PropertyNameFormatterGetter,
							 private expressionFormatter: ExpressionFormatterGetter) {
		super();
	}

	/**
	 * Formats the given Decorator into an IFormattedClassProperty
	 * @param {PropertyDeclaration} expression
	 * @returns {IFormattedClassProperty}
	 */
	public format (expression: PropertyDeclaration): IFormattedClassProperty {

		const result: IFormattedClassProperty = {
			...super.format(expression),
			...this.classElementFormatter().format(expression),
			decorators: expression.decorators == null ? [] : expression.decorators.map(decorator => this.decoratorFormatter().format(decorator)),
			type: expression.type == null ? null : this.typeFormatter().format(expression.type),
			initializer: expression.initializer == null ? null : this.expressionFormatter().format(expression.initializer),
			name: this.propertyNameFormatter().format(expression.name),
			expressionKind: FormattedExpressionKind.CLASS_PROPERTY
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedClassProperty
	 * @param {IFormattedClassProperty} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IFormattedClassProperty): string {
		let str = "";
		// Add decorators in top
		str += `${formatted.decorators.map(decorator => decorator.toString()).join("\\n")}\n`;

		// Add the 'static' modifier if the property is static
		if (formatted.static) str += "static ";
		str += formatted.name.toString();

		// Add the type expression if it is given
		if (formatted.type != null) {
			str += `: ${formatted.type.toString()}`;
		}

		// Add the initializer
		if (formatted.initializer != null) {
			str += ` = ${formatted.initializer.toString()}`;
		}

		// Add a ";" in the end
		str += ";";
		return str;
	}

}