import {IMarshaller} from "@wessberg/marshaller";
import {DeclarationName, Expression, Identifier, Node, Statement, SyntaxKind, TypeNode, TypeReferenceNode} from "typescript";
import {BindingIdentifier} from "../model/BindingIdentifier";
import {isArrayLiteralExpression, isArrowFunction, isBindingElement, isCallExpression, isClassDeclaration, isClassExpression, isComputedPropertyName, isConstructorDeclaration, isDecorator, isElementAccessExpression, isEnumDeclaration, isEnumMember, isExportSpecifier, isExpressionWithTypeArguments, isExternalModuleReference, isFirstLiteralToken, isFunctionDeclaration, isFunctionExpression, isIdentifierObject, isImportSpecifier, isMethodDeclaration, isNamespaceImport, isNewExpression, isNumericLiteral, isObjectLiteralExpression, isParameterDeclaration, isParenthesizedExpression, isPropertyAccessExpression, isPropertyAssignment, isPropertyDeclaration, isPropertyName, isPropertySignature, isRegularExpressionLiteral, isStringLiteral, isSuperExpression, isTemplateExpression, isTemplateHead, isTemplateMiddle, isTemplateTail, isThisKeyword, isTypeAssertionExpression, isTypeReference, isTypeReferenceNode, isVariableDeclaration} from "../predicate/PredicateFunctions";
import {ArbitraryValue} from "../service/interface/ICodeAnalyzer";
import {INameGetter} from "./interface/INameGetter";
import {Config} from "../static/Config";

export class NameGetter implements INameGetter {

	constructor (private marshaller: IMarshaller) {
	}

	public getName (statement: Statement|Expression|Node|TypeNode|TypeReferenceNode): string {

		if (
			isFunctionDeclaration(statement) ||
			isFunctionExpression(statement)
		) {
			if (statement.name == null) return Config.name.anonymous;
			return <string>this.getNameOfMember(statement.name, false, true);
		}

		if (
			isBindingElement(statement) ||
			isParameterDeclaration(statement) ||
			isPropertySignature(statement) ||
			isPropertyDeclaration(statement) ||
			isPropertyAssignment(statement) ||
			isVariableDeclaration(statement) ||
			isClassDeclaration(statement) ||
			isClassExpression(statement) ||
			isMethodDeclaration(statement) ||
			isPropertyAccessExpression(statement) ||
			isEnumDeclaration(statement) ||
			isEnumMember(statement) ||
			isImportSpecifier(statement) ||
			isExportSpecifier(statement) ||
			isNamespaceImport(statement) ||
			isNewExpression(statement)
		) {
			if (statement.name == null) throw new ReferenceError(`${this.constructor.name} could not get the name for an expression of kind ${SyntaxKind[statement.kind]}`);
			return <string>this.getNameOfMember(statement.name, false, true);
		}

		if (isSuperExpression(statement)) {
			return "super";
		}

		if (isConstructorDeclaration(statement)) {
			return "constructor";
		}

		if (isIdentifierObject(statement)) {
			return <string>this.getNameOfMember(statement, false, true);
		}

		if (
			(isTypeReferenceNode(statement) || isTypeReference(statement)) &&
			isIdentifierObject(statement.typeName)
		) {
			return <string>this.getNameOfMember(statement.typeName, false, true);
		}

		if (
			isExpressionWithTypeArguments(statement) ||
			isCallExpression(statement) ||
			isDecorator(statement) ||
			isExternalModuleReference(statement)
		) {
			if (statement.expression == null) throw new ReferenceError(`${this.constructor.name} could not get the name for an expression of kind ${SyntaxKind[statement.kind]}`);
			return <string>this.getNameOfMember(statement.expression, false, true);
		}

		if (
			isParenthesizedExpression(statement) ||
			isTypeAssertionExpression(statement)
		) {
			return this.getName(statement.expression);
		}

		if (
			isArrowFunction(statement)
		) {
			return Config.name.anonymous;
		}

		if (
			isThisKeyword(statement)
		) {
			return "this";
		}

		throw new ReferenceError(`${this.constructor.name} could not get the name for an expression of kind ${SyntaxKind[statement.kind]}`);
	}

	/**
	 * Detects the name/key of a member of something (for example, an ObjectLiteral). If the second argument is truthy,
	 * the name may also be a non-string entity.
	 * @param {DeclarationName} name
	 * @param {boolean} [allowNonStringNames=false]
	 * @param {boolean} [forceNoBindingIdentifier=false]
	 * @returns {string|number|BindingIdentifier|RegExp}
	 */
	public getNameOfMember (name: DeclarationName|Expression, allowNonStringNames: boolean = false, forceNoBindingIdentifier: boolean = false): string|number|BindingIdentifier|RegExp {

		if (isSuperExpression(name)) {
			return "super";
		}

		if (isConstructorDeclaration(name)) {
			return "constructor";
		}

		if (isTypeAssertionExpression(name)) {
			return this.getNameOfMember(name.expression, allowNonStringNames, forceNoBindingIdentifier);
		}

		if (isComputedPropertyName(name)) {
			if (isPropertyName(name.expression)) {
				if (isComputedPropertyName(name.expression)) return this.getNameOfMember(name.expression, allowNonStringNames, false);
				return this.getNameOfMember(name.expression, allowNonStringNames, false);
			}

			if (isCallExpression(name.expression)) {
				return this.getNameOfMember(name.expression.expression, allowNonStringNames, forceNoBindingIdentifier);
			}

			throw new TypeError(`${this.getNameOfMember.name} could not compute the name of a ${SyntaxKind[name.kind]}: It wasn't a PropertyName or a CallExpression. Instead, it was a ${SyntaxKind[name.expression.kind]}`);
		}

		if (isIdentifierObject(name)) {
			const marshalled = <string>this.marshaller.marshal<string, ArbitraryValue>(name.text, allowNonStringNames ? undefined : "");

			if (this.memberHasNoBindingIdentifier(name)) {
				// Then this is the key of a property-assignment. We already know it isn't computed, so it can't be an identifier to another variable.
				return marshalled;
			}

			// Otherwise, it most likely is a reference to a variable or other Identifier unless it is a global symbol like "Infinity" or "Nan".
			if (this.marshaller.getTypeOf(this.marshaller.marshal<ArbitraryValue, ArbitraryValue>(name.text)) === "string" && !forceNoBindingIdentifier) {
				return new BindingIdentifier(name.text, name);
			}
			return marshalled;
		}

		if (isFirstLiteralToken(name)) {
			return <string|number|BindingIdentifier|RegExp>this.marshaller.marshal<string, string|number|BindingIdentifier|RegExp>(name.text, allowNonStringNames ? undefined : "");
		}

		if (isNewExpression(name)) {
			return this.getNameOfMember(name.expression, false, forceNoBindingIdentifier);
		}

		if (isStringLiteral(name)) {
			return name.text;
		}

		if (isThisKeyword(name)) {
			return new BindingIdentifier("this", name);
		}

		if (isRegularExpressionLiteral(name)) {
			return <string|RegExp>this.marshaller.marshal<string, RegExpConstructor|string>(name.text, forceNoBindingIdentifier ? "" : RegExp);
		}

		if (isPropertyAccessExpression(name)) {
			const baseName = <string>this.getNameOfMember(name.expression, false, false);
			return new BindingIdentifier(baseName.toString(), name.expression);
		}

		if (isCallExpression(name)) {
			return this.getNameOfMember(name.expression, allowNonStringNames, forceNoBindingIdentifier);
		}

		if (isParenthesizedExpression(name)) {
			return this.getNameOfMember(name.expression, allowNonStringNames, forceNoBindingIdentifier);
		}

		if (isFunctionExpression(name)) {
			return name.name == null ? Config.name.anonymous : this.getNameOfMember(name.name, allowNonStringNames, forceNoBindingIdentifier);
		}

		if (isElementAccessExpression(name)) {
			const baseName = <string>this.getNameOfMember(name.expression, false, false);

			return new BindingIdentifier(baseName.toString(), name);
		}

		throw new TypeError(`${this.getNameOfMember.name} could not compute the name of a ${SyntaxKind[name.kind]}.`);
	}

	/**
	 * Returns true if the name of an identifier cannot be computed or refer to another identifier.
	 * @param {Statement} statement
	 * @returns {boolean}
	 */
	private memberHasNoBindingIdentifier (statement: Statement|Identifier): boolean {
		const parent = statement.parent;
		if (parent == null) return false;

		// If this is an identifier and the parent is a property access expression on a
		// parenthesized, array or object literal expression (e.g. (something || []).concat(otherThing)),
		// The right-hand side property access should never be attached to a BindingIdentifier.
		if (
			isIdentifierObject(statement) &&
			isPropertyAccessExpression(parent) &&
			(
				isCallExpression(parent.expression) ||
				isParenthesizedExpression(parent.expression) ||
				isStringLiteral(parent.expression) ||
				isNumericLiteral(parent.expression) ||
				isTemplateExpression(parent.expression) ||
				isTemplateHead(parent.expression) ||
				isTemplateMiddle(parent.expression) ||
				isTemplateTail(parent.expression) ||
				isArrayLiteralExpression(parent.expression) ||
				isObjectLiteralExpression(parent.expression) ||
				isPropertyAccessExpression(parent.expression)
			)
		) return true;

		// If this is the name of a method, function or parameter, it cannot be a BindingIdentifier.
		if (
			isIdentifierObject(statement) &&
			(
				isMethodDeclaration(parent) ||
				isFunctionDeclaration(parent) ||
				isFunctionExpression(parent) ||
				isParameterDeclaration(parent)
			)
		) return true;

		return false;
	}
}