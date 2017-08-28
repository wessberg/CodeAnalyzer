import {isAccessor, isMethodDeclaration, isPropertyAssignment, isShorthandPropertyAssignment, ObjectLiteralElementLike} from "typescript";
import {AstMapperGetter} from "../../../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionFormatter} from "../../../formatted-expression/formatted-expression-formatter";
import {FormattedExpressionKind, FormattedObjectLiteralProperty, FormattedObjectLiteralPropertyKind, IFormattedObjectLiteralPropertyAssignmentProperty, IFormattedObjectLiteralShortHandAssignmentProperty, IFormattedObjectLiteralSpreadAssignmentProperty, isFormattedObjectLiteralPropertyAssignmentProperty, isFormattedObjectLiteralShortHandAssignmentProperty} from "@wessberg/type";
import {IObjectLiteralPropertyFormatter} from "./i-object-literal-property-formatter";
import {ExpressionFormatterGetter} from "../../../expression/expression-formatter-getter";
import {PropertyNameFormatterGetter} from "../../../property-name/property-name-formatter-getter";
import {AccessorFormatterGetter} from "../../../accessor/accessor-formatter-getter";
import {MethodFormatterGetter} from "../../../method/method-formatter-getter";

/**
 * A class that can format object literal properties
 */
export class ObjectLiteralPropertyFormatter extends FormattedExpressionFormatter implements IObjectLiteralPropertyFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private accessorFormatter: AccessorFormatterGetter,
							 private propertyNameFormatter: PropertyNameFormatterGetter,
							 private methodFormatter: MethodFormatterGetter,
							 private expressionFormatter: ExpressionFormatterGetter) {
		super();
	}

	/**
	 * Formats the given ObjectLiteralElement into an FormattedObjectLiteralProperty
	 * @param {ObjectLiteralElement} expression
	 * @returns {FormattedObjectLiteralProperty}
	 */
	public format (expression: ObjectLiteralElementLike): FormattedObjectLiteralProperty {

		if (isAccessor(expression)) {
			return this.accessorFormatter().format(expression);
		}

		else if (isMethodDeclaration(expression)) {
			return this.methodFormatter().format(expression);
		}

		else {
			const base = {
				...super.format(expression)
			};

			let result: IFormattedObjectLiteralShortHandAssignmentProperty|IFormattedObjectLiteralPropertyAssignmentProperty|IFormattedObjectLiteralSpreadAssignmentProperty;

			if (isPropertyAssignment(expression)) {
				result = {
					...base,
					name: this.propertyNameFormatter().format(expression.name),
					expressionKind: FormattedExpressionKind.OBJECT_LITERAL_PROPERTY,
					kind: FormattedObjectLiteralPropertyKind.PROPERTY_ASSIGNMENT,
					value: this.expressionFormatter().format(expression.initializer)
				};
			}

			else if (isShorthandPropertyAssignment(expression)) {
				result = {
					...base,
					name: this.propertyNameFormatter().format(expression.name),
					expressionKind: FormattedExpressionKind.OBJECT_LITERAL_PROPERTY,
					kind: FormattedObjectLiteralPropertyKind.SHORTHAND_ASSIGNMENT
				};
			}

			else {
				result = {
					...base,
					expressionKind: FormattedExpressionKind.OBJECT_LITERAL_PROPERTY,
					kind: FormattedObjectLiteralPropertyKind.SPREAD_ASSIGNMENT,
					expression: this.expressionFormatter().format(expression.expression)
				};
			}

			// Map the formatted expression to the relevant statement
			this.astMapper().mapFormattedExpressionToStatement(result, expression);

			// Override the 'toString()' method
			result.toString = () => this.stringify(result);
			return result;
		}
	}

	/**
	 * Generates a string representation of the IFormattedObjectLiteralShortHandAssignmentProperty|IFormattedObjectLiteralPropertyAssignmentProperty|IFormattedObjectLiteralSpreadAssignmentProperty
	 * @param {IFormattedObjectLiteralShortHandAssignmentProperty|IFormattedObjectLiteralPropertyAssignmentProperty|IFormattedObjectLiteralSpreadAssignmentProperty} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IFormattedObjectLiteralShortHandAssignmentProperty|IFormattedObjectLiteralPropertyAssignmentProperty|IFormattedObjectLiteralSpreadAssignmentProperty): string {
		if (isFormattedObjectLiteralPropertyAssignmentProperty(formatted)) {
			return `${formatted.name.toString()}: ${formatted.value.toString()}`;
		}

		else if (isFormattedObjectLiteralShortHandAssignmentProperty(formatted)) {
			return formatted.name.toString();
		}

		else {
			return `...${formatted.expression.toString()}`;
		}
	}

}