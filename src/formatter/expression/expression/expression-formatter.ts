import {IExpressionFormatter} from "./i-expression-formatter";
import {Expression, ExpressionWithTypeArguments, isBlock, isCallExpression, isClassDeclaration, isClassExpression, isDecorator, isExpressionWithTypeArguments, isGetAccessorDeclaration, isHeritageClause, isIdentifier, isMethodDeclaration, isNoSubstitutionTemplateLiteral, isNumericLiteral, isObjectLiteralExpression, isPropertyAccessExpression, isPropertyDeclaration, isPropertyName, isRegularExpressionLiteral, isSetAccessorDeclaration, isStringLiteral, Statement} from "typescript";
import {CallExpressionFormatterGetter} from "../call-expression/call-expression-formatter-getter";
import {StringLiteralFormatterGetter} from "../literal/string-literal/string-literal-formatter-getter";
import {NotImplementedFormatterGetter} from "../not-implemented/not-implemented-formatter-getter";
import {NumberLiteralFormatterGetter} from "../literal/number-literal/number-literal-formatter-getter";
import {PropertyAccessExpressionFormatterGetter} from "../property-access-expression/property-access-expression-formatter-getter";
import {IdentifierFormatterGetter} from "../identifier/identifier-formatter-getter";
import {BooleanLiteralFormatterGetter} from "../literal/boolean-literal/boolean-literal-formatter-getter";
import {RegexLiteralFormatterGetter} from "../literal/regex-literal/regex-literal-formatter-getter";
import {ClassFormatterGetter} from "../class/class-formatter-getter";
import {FormattedExpression} from "@wessberg/type";
import {AccessorFormatterGetter} from "../accessor/accessor-formatter-getter";
import {BlockFormatterGetter} from "../block/block-formatter-getter";
import {DecoratorFormatterGetter} from "../decorator/decorator-formatter-getter";
import {HeritageFormatterGetter} from "../heritage/heritage-formatter-getter";
import {ObjectLiteralFormatterGetter} from "../literal/object-literal/object-literal/object-literal-formatter-getter";
import {MethodFormatterGetter} from "../method/method-formatter-getter";
import {PropertyNameFormatterGetter} from "../property-name/property-name-formatter-getter";
import {isBooleanLiteral} from "@wessberg/typescript-ast-util";
import {ClassPropertyFormatterGetter} from "../class-property/class-property-formatter-getter";

/**
 * Can format any expression
 */
export class ExpressionFormatter implements IExpressionFormatter {
	constructor (private classFormatter: ClassFormatterGetter,
							 private callExpressionFormatter: CallExpressionFormatterGetter,
							 private propertyAccessExpressionFormatter: PropertyAccessExpressionFormatterGetter,
							 private identifierFormatter: IdentifierFormatterGetter,
							 private stringLiteralFormatter: StringLiteralFormatterGetter,
							 private numberLiteralFormatter: NumberLiteralFormatterGetter,
							 private booleanLiteralFormatter: BooleanLiteralFormatterGetter,
							 private regexLiteralFormatter: RegexLiteralFormatterGetter,
							 private objectLiteralFormatter: ObjectLiteralFormatterGetter,
							 private accessorFormatter: AccessorFormatterGetter,
							 private blockFormatter: BlockFormatterGetter,
							 private decoratorFormatter: DecoratorFormatterGetter,
							 private heritageFormatter: HeritageFormatterGetter,
							 private methodFormatter: MethodFormatterGetter,
							 private propertyNameFormatter: PropertyNameFormatterGetter,
							 private classPropertyFormatter: ClassPropertyFormatterGetter,
							 private notImplementedFormatter: NotImplementedFormatterGetter) {
	}

	/**
	 * Formats the given expression into an IFormattedExpression
	 * @param {Expression|ExpressionWithTypeArguments|Statement} expression
	 * @returns {IFormattedExpression}
	 */
	public format (expression: Expression|ExpressionWithTypeArguments|Statement): FormattedExpression {

		if (isClassExpression(expression) || isClassDeclaration(expression)) {
			return this.classFormatter().format(expression);
		}

		else if (isPropertyDeclaration(expression)) {
			return this.classPropertyFormatter().format(expression);
		}

		else if (isCallExpression(expression)) {
			return this.callExpressionFormatter().format(expression);
		}

		else if (isGetAccessorDeclaration(expression) || isSetAccessorDeclaration(expression)) {
			return this.accessorFormatter().format(expression);
		}

		else if (isPropertyAccessExpression(expression)) {
			return this.propertyAccessExpressionFormatter().format(expression);
		}

		else if (isObjectLiteralExpression(expression)) {
			return this.objectLiteralFormatter().format(expression);
		}

		else if (isStringLiteral(expression) || isNoSubstitutionTemplateLiteral(expression)) {
			return this.stringLiteralFormatter().format(expression);
		}

		else if (isNumericLiteral(expression)) {
			return this.numberLiteralFormatter().format(expression);
		}

		else if (isBooleanLiteral(expression)) {
			return this.booleanLiteralFormatter().format(expression);
		}

		else if (isIdentifier(expression)) {
			return this.identifierFormatter().format(expression);
		}

		else if (isRegularExpressionLiteral(expression)) {
			return this.regexLiteralFormatter().format(expression);
		}

		else if (isExpressionWithTypeArguments(expression)) {
			return this.format(expression.expression);
		}

		else if (isBlock(expression)) {
			return this.blockFormatter().format(expression);
		}

		else if (isDecorator(expression)) {
			return this.decoratorFormatter().format(expression);
		}

		else if (isHeritageClause(expression)) {
			return this.heritageFormatter().format(expression);
		}

		else if (isMethodDeclaration(expression)) {
			return this.methodFormatter().format(expression);
		}

		else if (isPropertyName(expression)) {
			return this.propertyNameFormatter().format(expression);
		}

		else {
			return this.notImplementedFormatter().format(expression);
		}
	}

}