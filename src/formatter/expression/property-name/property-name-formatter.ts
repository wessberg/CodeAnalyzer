import {IPropertyNameFormatter} from "./i-property-name-formatter";
import {isIdentifier, isNumericLiteral, isStringLiteral, PropertyName} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {ExpressionFormatterGetter} from "../expression/expression-formatter-getter";
import {FormattedExpressionKind, FormattedPropertyName, FormattedPropertyNameKind} from "@wessberg/type";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";

/**
 * A class that can format FormattedPropertyNames
 */
export class PropertyNameFormatter extends FormattedExpressionFormatter implements IPropertyNameFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private astMapper: AstMapperGetter,
							 private expressionFormatter: ExpressionFormatterGetter) {
		super();
	}

	/**
	 * Formats the given PropertyName into a FormattedPropertyName
	 * @param {PropertyName} expression
	 * @returns {FormattedPropertyName}
	 */
	public format (expression: PropertyName): FormattedPropertyName {

		const base = {
			...super.format(expression)
		};

		let result: FormattedPropertyName;

		if (isIdentifier(expression)) {
			result = {
				...base,
				kind: FormattedPropertyNameKind.STATIC,
				expressionKind: FormattedExpressionKind.PROPERTY_NAME,
				name: this.astUtil.takeName(expression)
			};
		}

		else if (isStringLiteral(expression)) {
			result = {
				...base,
				kind: FormattedPropertyNameKind.STATIC,
				expressionKind: FormattedExpressionKind.PROPERTY_NAME,
				name: expression.text
			};
		}

		else if (isNumericLiteral(expression)) {
			result = {
				...base,
				kind: FormattedPropertyNameKind.STATIC,
				expressionKind: FormattedExpressionKind.PROPERTY_NAME,
				name: parseInt(expression.text)
			};
		}

		else {
			const formattedComputed = this.expressionFormatter().format(expression.expression);
			const stringified = formattedComputed.toString();
			const isSymbol = stringified.startsWith("Symbol");
			if (isSymbol) {
				result = {
					...base,
					kind: FormattedPropertyNameKind.BUILT_IN_SYMBOL,
					expressionKind: FormattedExpressionKind.PROPERTY_NAME,
					name: stringified
				};
			} else {
				result = {
					...base,
					kind: FormattedPropertyNameKind.COMPUTED,
					expressionKind: FormattedExpressionKind.PROPERTY_NAME,
					expression: formattedComputed
				};
			}
		}

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the FormattedPropertyName
	 * @param {FormattedPropertyName} formatted
	 * @returns {string}
	 */
	private stringify (formatted: FormattedPropertyName): string {
		switch (formatted.kind) {
			case FormattedPropertyNameKind.STATIC:
				return `${formatted.name}`;
			case FormattedPropertyNameKind.BUILT_IN_SYMBOL:
				return `[${formatted.name}]`;
			case FormattedPropertyNameKind.COMPUTED:
				return `[${formatted.expression.toString()}]`;
		}
	}

}