import {IExpressionFormatter} from "./i-expression-formatter";
import {Expression, ExpressionWithTypeArguments, isArrowFunction, isAwaitExpression, isBlock, isCallExpression, isClassDeclaration, isClassExpression, isConstructorDeclaration, isDecorator, isExportDeclaration, isExportSpecifier, isExpressionStatement, isExpressionWithTypeArguments, isFunctionDeclaration, isFunctionExpression, isGetAccessorDeclaration, isHeritageClause, isIdentifier, isImportDeclaration, isImportSpecifier, isMethodDeclaration, isNamespaceExportDeclaration, isNamespaceImport, isNoSubstitutionTemplateLiteral, isNumericLiteral, isObjectLiteralExpression, isParameter, isPropertyAccessExpression, isPropertyDeclaration, isPropertyName, isRegularExpressionLiteral, isSetAccessorDeclaration, isStringLiteral, isTypeNode, isYieldExpression, Statement, SuperExpression, SyntaxKind, ThisExpression} from "typescript";
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
import {FunctionFormatterGetter} from "../function/function-formatter-getter";
import {ParameterFormatterGetter} from "../parameter/parameter-formatter-getter";
import {ClassConstructorFormatterGetter} from "../class-constructor/class-constructor-formatter-getter";
import {ThisExpressionFormatterGetter} from "../this-expression/this-expression-formatter-getter";
import {SuperExpressionFormatterGetter} from "../super-expression/super-expression-formatter-getter";
import {AwaitExpressionFormatterGetter} from "../await-expression/await-expression-formatter-getter";
import {YieldExpressionFormatterGetter} from "../yield-expression/yield-expression-formatter-getter";
import {TypeFormatterGetter} from "../../type/type-formatter/type-formatter-getter";
import {ModuleBindingFormatterGetter} from "../module-binding/module-binding-formatter-getter";
import {ImportFormatterGetter} from "../import-formatter/import-formatter-getter";
import {ExportFormatterGetter} from "../export-formatter/export-formatter-getter";

/**
 * Can format any expression
 */
export class ExpressionFormatter implements IExpressionFormatter {
	constructor (private moduleBindingFormatter: ModuleBindingFormatterGetter,
							 private importFormatter: ImportFormatterGetter,
							 private exportFormatter: ExportFormatterGetter,
							 private thisExpressionFormatter: ThisExpressionFormatterGetter,
							 private superExpressionFormatter: SuperExpressionFormatterGetter,
							 private awaitExpressionFormatter: AwaitExpressionFormatterGetter,
							 private yieldExpressionFormatter: YieldExpressionFormatterGetter,
							 private classFormatter: ClassFormatterGetter,
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
							 private classConstructorFormatter: ClassConstructorFormatterGetter,
							 private functionFormatter: FunctionFormatterGetter,
							 private parameterFormatter: ParameterFormatterGetter,
							 private notImplementedFormatter: NotImplementedFormatterGetter,
							 private typeFormatter: TypeFormatterGetter) {
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

		else if (isConstructorDeclaration(expression)) {
			return this.classConstructorFormatter().format(expression);
		}

		else if (isParameter(expression)) {
			return this.parameterFormatter().format(expression);
		}

		else if (isFunctionExpression(expression) || isFunctionDeclaration(expression) || isArrowFunction(expression)) {
			return this.functionFormatter().format(expression);
		}

		else if (isPropertyDeclaration(expression)) {
			return this.classPropertyFormatter().format(expression);
		}

		else if (isImportDeclaration(expression)) {
			return this.importFormatter().format(expression);
		}

		else if (isExportDeclaration(expression)) {
			return this.exportFormatter().format(expression);
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

		else if (isAwaitExpression(expression)) {
			return this.awaitExpressionFormatter().format(expression);
		}

		else if (isYieldExpression(expression)) {
			return this.yieldExpressionFormatter().format(expression);
		}

		else if (expression.kind === SyntaxKind.ThisKeyword) {
			return this.thisExpressionFormatter().format(<ThisExpression>expression);
		}

		else if (expression.kind === SyntaxKind.SuperKeyword) {
			return this.superExpressionFormatter().format(<SuperExpression>expression);
		}

		else if (isExpressionWithTypeArguments(expression) || isExpressionStatement(expression)) {
			return this.format(expression.expression);
		}

		else if (isTypeNode(expression)) {
			return this.typeFormatter().format(expression);
		}

		else if (isNamespaceImport(expression) || isNamespaceExportDeclaration(expression) || isImportSpecifier(expression) || isExportSpecifier(expression)) {
			return this.moduleBindingFormatter().format(expression);
		}

		else {
			return this.notImplementedFormatter().format(expression);
		}
	}

}