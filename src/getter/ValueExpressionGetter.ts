import {GlobalObjectIdentifier} from "@wessberg/globalobject";
import {Expression, Identifier, Node, Statement, SyntaxKind} from "typescript";
import {BindingIdentifier} from "../model/BindingIdentifier";
import {isArrayBindingPattern, isArrayLiteralExpression, isArrowFunction, isAsyncKeyword, isAwaitExpression, isBinaryExpression, isBlockDeclaration, isBreakStatement, isCallExpression, isCaseBlock, isCaseClause, isCatchClause, isClassDeclaration, isClassExpression, isComputedPropertyName, isConditionalExpression, isConstructorDeclaration, isContinueStatement, isDefaultClause, isDeleteExpression, isDoStatement, isElementAccessExpression, isEmptyStatement, isExpressionStatement, isFirstNode, isForInStatement, isForOfStatement, isForStatement, isFunctionDeclaration, isFunctionExpression, isGetAccessorDeclaration, isIdentifierObject, isIfStatement, isLabeledStatement, isLastTypeNode, isMethodDeclaration, isNewExpression, isNoSubstitutionTemplateLiteral, isNumericLiteral, isObjectBindingPattern, isObjectLiteralExpression, isOmittedExpression, isParameterDeclaration, isParenthesizedExpression, isPostfixUnaryExpression, isPrefixUnaryExpression, isPropertyAccessExpression, isPropertyAssignment, isPropertyDeclaration, isRegularExpressionLiteral, isReturnStatement, isSetAccessorDeclaration, isShorthandPropertyAssignment, isSpreadAssignment, isSpreadElement, isStaticKeyword, isStringLiteral, isSwitchStatement, isTemplateExpression, isTemplateHead, isTemplateMiddle, isTemplateSpan, isTemplateTail, isThrowStatement, isTokenObject, isTryStatement, isTypeAssertionExpression, isTypeOfExpression, isTypeQueryNode, isVariableDeclaration, isVariableDeclarationList, isVariableStatement, isVoidExpression, isWhileStatement} from "../predicate/PredicateFunctions";
import {IValueExpressionGetter} from "./interface/IValueExpressionGetter";
import {heritageClauseFormatter, marshaller, nameGetter, sourceFilePropertiesGetter, stringUtil, tokenPredicator, tokenSerializer} from "../services";
import {ArbitraryValue, InitializationValue} from "../identifier/interface/IIdentifier";

/**
 * A class that can get a full value expression for any kind of expression.
 */
export class ValueExpressionGetter implements IValueExpressionGetter {

	/**
	 * Checks and formats the initialization value of the given statement (if any) and returns it.
	 * Since such a statement can be a combination of multiple operations and identifiers, an array of statements will be
	 * returned.
	 * @param {Statement|Expression|Node} rawStatement
	 * @returns {InitializationValue}
	 */
	public getValueExpression (rawStatement: Statement|Expression|Node): InitializationValue {

		if (isNumericLiteral(rawStatement)) {
			return [parseInt(rawStatement.text)];
		}

		if (isPropertyDeclaration(rawStatement)) {
			const className = rawStatement.parent == null ? "" : nameGetter.getName(rawStatement.parent);
			const name = nameGetter.getName(rawStatement.name);
			const initializer = rawStatement.initializer == null ? [] : this.getValueExpression(rawStatement.initializer);
			const isStatic = rawStatement.modifiers == null ? false : rawStatement.modifiers.find(modifier => isStaticKeyword(modifier)) != null;
			const staticIntro = isStatic ? ["static", " "] : [];

			const getterIntro: ArbitraryValue[] = [...staticIntro, "get", " ", name, "(", ")", "{"];
			const getterOutro: ArbitraryValue[] = ["return", " ", isStatic ? className : "this", ".", `_${name}`, "}"];
			let getter: ArbitraryValue[];

			const setterIntro: ArbitraryValue[] = [...staticIntro, "set", " ", name, "(", "value", ")", "{"];
			const setter: ArbitraryValue[] = [...setterIntro, isStatic ? className : "this", ".", `_${name}`, "=", "value", "}"];

			if (initializer.length === 0) {
				getter = [...getterIntro, ...getterOutro];
			} else {
				getter = [...getterIntro, "if", "(", isStatic ? className : "this", ".", `_${name}`, "===", "undefined", ")", "{", isStatic ? className : "this", ".", `_${name}`, "=", ...initializer, "}", ...getterOutro];
			}
			return [...getter, ...setter];
		}

		if (isStringLiteral(rawStatement)) {
			return [`\`${rawStatement.text}\``];
		}

		if (isRegularExpressionLiteral(rawStatement)) {
			return [rawStatement.text];
		}

		if (isNoSubstitutionTemplateLiteral(rawStatement)) {
			const marshalled = marshaller.unmarshal(rawStatement.text);
			return [stringUtil.quoteIfNecessary(marshalled)];
		}

		if (isArrayBindingPattern(rawStatement)) {
			const arr: ArbitraryValue[] = ["["];

			rawStatement.elements.forEach((binding, index) => {
				if (!isOmittedExpression(binding)) {
					arr.push(nameGetter.getName(binding));
				}
				if (index !== rawStatement.elements.length - 1) arr.push(",");
			});
			arr.push("]");
			return arr;
		}

		if (isObjectBindingPattern(rawStatement)) {
			const arr: ArbitraryValue[] = ["{"];

			rawStatement.elements.forEach((binding, index) => {
				arr.push(nameGetter.getName(binding));
				if (index !== rawStatement.elements.length - 1) arr.push(",");
			});
			arr.push("}");
			return arr;
		}

		if (isTemplateHead(rawStatement) || isTemplateMiddle(rawStatement) || isTemplateTail(rawStatement)) {
			return [rawStatement.text];
		}

		if (isTypeAssertionExpression(rawStatement)) {
			return this.getValueExpression(rawStatement.expression);
		}

		if (isAwaitExpression(rawStatement)) {
			return ["await", " ", ...this.getValueExpression(rawStatement.expression)];
		}

		if (isTemplateSpan(rawStatement)) {
			const head = this.getValueExpression(rawStatement.expression);
			const tail = this.getValueExpression(rawStatement.literal);
			let headNormalized: InitializationValue = [];
			if (head.length > 0) {
				headNormalized = ["${", ...head, "}"];
			}

			return [...headNormalized, ...tail];
		}

		if (isCatchClause(rawStatement)) {
			return ["catch", "(", ...this.getValueExpression(rawStatement.variableDeclaration), ")", "{", ...this.getValueExpression(rawStatement.block), "}"];
		}

		if (isExpressionStatement(rawStatement)) {
			return this.getValueExpression(rawStatement.expression);
		}

		if (isTryStatement(rawStatement)) {
			let arr: InitializationValue = ["try", "{", ...this.getValueExpression(rawStatement.tryBlock), "}"];
			if (rawStatement.catchClause != null) arr = [...arr, ...this.getValueExpression(rawStatement.catchClause)];
			if (rawStatement.finallyBlock != null) arr = [...arr, "finally", "{", ...this.getValueExpression(rawStatement.finallyBlock), "}"];
			return arr;
		}

		if (isLastTypeNode(rawStatement)) {
			return [];
		}

		if (isTypeQueryNode(rawStatement)) {
			return [];
		}

		if (isTypeOfExpression(rawStatement)) {
			return [];
			// return ["typeof", " ", ...this.getValueExpression(rawStatement.expression)];
		}

		if (isPrefixUnaryExpression(rawStatement)) {
			return [tokenSerializer.serializeToken(rawStatement.operator, rawStatement), ...this.getValueExpression(rawStatement.operand)];
		}

		if (isPostfixUnaryExpression(rawStatement)) {
			return [...this.getValueExpression(rawStatement.operand), tokenSerializer.serializeToken(rawStatement.operator, rawStatement)];
		}

		if (isDeleteExpression(rawStatement)) {
			return [tokenSerializer.marshalToken(rawStatement.kind, rawStatement), " ", ...this.getValueExpression(rawStatement.expression)];
		}

		if (isEmptyStatement(rawStatement)) {
			return [];
		}

		if (isVariableDeclarationList(rawStatement)) {
			const serialized = tokenSerializer.serializeFlag(rawStatement.flags);
			const keyword = serialized == null ? "var" : serialized;
			const values: InitializationValue = [keyword, " "];

			rawStatement.declarations.forEach((declaration, index) => {
				const content = this.getValueExpression(declaration);
				// Remove empty strings from the contents and add everything else to the value array.
				content.forEach(part => values.push(part));
				if (index !== rawStatement.declarations.length - 1) values.push(",");
			});
			return values;
		}

		if (isIfStatement(rawStatement)) {
			return ["if", "(", ...this.getValueExpression(rawStatement.expression), ")", "{", ...this.getValueExpression(rawStatement.thenStatement), "}"];
		}

		if (isForOfStatement(rawStatement)) {
			return [
				"for",
				...(rawStatement.awaitModifier == null ? [] : [" ", ...this.getValueExpression(rawStatement.awaitModifier)]),
				"(",
				...(rawStatement.initializer == null ? [] : this.getValueExpression(rawStatement.initializer)), " ", "of", " ",
				...this.getValueExpression(rawStatement.expression),
				")", "{",
				...this.getValueExpression(rawStatement.statement),
				"}"
			];
		}

		if (isForInStatement(rawStatement)) {
			return [
				"for", "(",
				...(rawStatement.initializer == null ? [] : this.getValueExpression(rawStatement.initializer)), " ", "in", " ",
				...this.getValueExpression(rawStatement.expression), ")", "{",
				...this.getValueExpression(rawStatement.statement),
				"}"
			];
		}

		if (isForStatement(rawStatement)) {
			return [
				"for", "(",
				...(rawStatement.initializer == null ? [] : this.getValueExpression(rawStatement.initializer)), ";",
				...(rawStatement.condition == null ? [] : this.getValueExpression(rawStatement.condition)), ";",
				...(rawStatement.incrementor == null ? [] : this.getValueExpression(rawStatement.incrementor)), ")", "{",
				...this.getValueExpression(rawStatement.statement),
				"}"
			];
		}

		if (isThrowStatement(rawStatement)) {
			return [tokenSerializer.marshalToken(rawStatement.kind, rawStatement), " ", ...this.getValueExpression(rawStatement.expression)];
		}

		if (isBreakStatement(rawStatement)) {
			return [tokenSerializer.marshalToken(rawStatement.kind, rawStatement)];
		}

		if (isContinueStatement(rawStatement)) {
			return [tokenSerializer.marshalToken(rawStatement.kind, rawStatement)];
		}

		if (isDoStatement(rawStatement)) {
			return [tokenSerializer.marshalToken(rawStatement.kind, rawStatement), "{", ...this.getValueExpression(rawStatement.expression), "}"];
		}

		if (isDefaultClause(rawStatement)) {
			const arr: InitializationValue = ["default", ":", "{"];
			rawStatement.statements.forEach(statement => {
				const value = this.getValueExpression(statement);
				value.forEach(part => arr.push(part));
			});
			arr.push("}");
			return arr;
		}

		if (isWhileStatement(rawStatement)) {
			return ["while", "(", ...this.getValueExpression(rawStatement.expression), ")", "{", ...this.getValueExpression(rawStatement.statement), "}"];
		}

		if (isCaseClause(rawStatement)) {
			const arr: InitializationValue = ["case", " ", ...this.getValueExpression(rawStatement.expression), ":", "{"];
			rawStatement.statements.forEach(statement => {
				const value = this.getValueExpression(statement);
				value.forEach(part => arr.push(part));
			});
			arr.push("}");
			return arr;
		}

		if (isCaseBlock(rawStatement)) {
			const arr: InitializationValue = [];
			rawStatement.clauses.forEach(block => {
				const value = this.getValueExpression(block);
				value.forEach(part => arr.push(part));
			});
			return arr;
		}

		if (isSwitchStatement(rawStatement)) {
			return ["switch", "(", ...this.getValueExpression(rawStatement.expression), ")", "{", ...this.getValueExpression(rawStatement.caseBlock), "}"];
		}

		if (isFirstNode(rawStatement)) {
			const arr: InitializationValue = [];
			// TODO: Are you sure that FirstNodes are always separated by a dot and is type expressions?
			const left = this.getValueExpression(rawStatement.left).map(exp => exp instanceof BindingIdentifier ? exp.name : exp);
			const right = this.getValueExpression(rawStatement.right).map(exp => exp instanceof BindingIdentifier ? exp.name : exp);

			left.forEach(item => arr.push(item));
			arr.push(".");
			right.forEach(item => arr.push(item));
			return arr;
		}

		if (isBinaryExpression(rawStatement)) {
			const arr: InitializationValue = [];

			const left = this.getValueExpression(rawStatement.left);
			const operator = this.getValueExpression(rawStatement.operatorToken);
			const right = this.getValueExpression(rawStatement.right);

			left.forEach(item => arr.push(item));
			operator.forEach(item => {
				arr.push(" ");
				arr.push(item);
				arr.push(" ");
			});
			right.forEach(item => arr.push(item));
			return arr;
		}

		if (isLabeledStatement(rawStatement)) {
			return [...this.getValueExpression(rawStatement.label), ":", ...this.getValueExpression(rawStatement.statement)];
		}

		if (isConditionalExpression(rawStatement)) {
			const arr: InitializationValue = [];
			const condition = this.getValueExpression(rawStatement.condition);
			const question = this.getValueExpression(rawStatement.questionToken);
			const colon = this.getValueExpression(rawStatement.colonToken);
			const whenTrue = this.getValueExpression(rawStatement.whenTrue);
			const whenFalse = this.getValueExpression(rawStatement.whenFalse);

			condition.forEach(item => arr.push(item));
			question.forEach(item => arr.push(item));
			whenTrue.forEach(item => arr.push(item));
			colon.forEach(item => arr.push(item));
			whenFalse.forEach(item => arr.push(item));
			return arr;
		}

		if (isCallExpression(rawStatement) || isNewExpression(rawStatement)) {
			const left = this.getValueExpression(rawStatement.expression);
			const arr: InitializationValue = [];
			if (isNewExpression(rawStatement)) {
				arr.push("new");
				arr.push(" ");
			}
			left.forEach(part => arr.push(part));
			arr.push("(");
			const args = rawStatement.arguments;

			if (args != null) args.forEach((arg, index) => {
				const value = this.getValueExpression(arg);
				value.forEach(item => {
					arr.push(item);
				});
				if (index !== args.length - 1) arr.push(",");
			});
			arr.push(")");
			return arr;
		}

		if (isObjectLiteralExpression(rawStatement)) {
			const obj: InitializationValue = ["{"];
			rawStatement.properties.forEach((property, index) => {
				let didAddMembers: boolean = false;

				if (isSpreadAssignment(property)) {
					obj.push("...");
					const exp = this.getValueExpression(property.expression);
					exp.forEach(item => obj.push(item));
					if (exp.length > 0) didAddMembers = true;
				}

				else if (isShorthandPropertyAssignment(property)) {
					const name = nameGetter.getName(property.name);
					obj.push(name);
					obj.push(":");
					obj.push(new BindingIdentifier(name, property.name));
					didAddMembers = true;
				}

				else {

					if (isPropertyAssignment(property)) {
						if (property.name == null) return;

						// Check if the property name is computed (.eg. [key]: "foo").
						if (isComputedPropertyName(property.name)) {
							obj.push("[");
							didAddMembers = true;

							const exp = this.getValueExpression(property.name.expression);
							exp.forEach(item => obj.push(item));
							if (exp.length > 0) didAddMembers = true;
							obj.push("]");

						} else {
							// Otherwise, just push the name of it.
							obj.push(nameGetter.getNameOfMember(property.name, true, true));
							didAddMembers = true;
						}

						obj.push(":");
						const value = this.getValueExpression(property.initializer);
						value.forEach(item => obj.push(item));
					}

					else if (isMethodDeclaration(property)) {
						const value = this.getValueExpression(property);
						value.forEach(item => obj.push(item));
						if (value.length > 0) didAddMembers = true;
					}

				}
				if (didAddMembers && index !== rawStatement.properties.length - 1) obj.push(",");
			});
			obj.push("}");
			return obj;
		}

		if (isArrayLiteralExpression(rawStatement)) {
			const arr: InitializationValue = ["["];
			rawStatement.elements.forEach((element, index) => {
				const value = this.getValueExpression(element);
				value.forEach(part => arr.push(part));
				const lastPart = value[value.length - 1];
				if (index !== rawStatement.elements.length - 1 && lastPart !== "...") arr.push(",");
			});

			arr.push("]");
			return arr;
		}

		if (isTemplateExpression(rawStatement)) {

			const values: InitializationValue = [...this.getValueExpression(rawStatement.head)];

			rawStatement.templateSpans.forEach(span => {
				const content = this.getValueExpression(span);
				// Remove empty strings from the contents and add everything else to the value array.
				content.filter(item => !(typeof item === "string" && item.length < 1)).forEach(checkedItem => values.push(checkedItem));
			});

			return ["\`", ...values, "\`"];
		}

		if (isPropertyAccessExpression(rawStatement) || isElementAccessExpression(rawStatement)) {
			const arr: InitializationValue = [];
			const left = this.getValueExpression(rawStatement.expression);
			const right = isPropertyAccessExpression(rawStatement)
				? this.getValueExpression(rawStatement.name)
				: rawStatement.argumentExpression == null ? [] : ["[", ...this.getValueExpression(rawStatement.argumentExpression), "]"];

			const lastLeft = left[left.length - 1];
			const firstRight = right[0];
			if (this.shouldBeIndexedLookup(lastLeft, firstRight)) {
				right.splice(0, 1, firstRight == null ? "" : firstRight.toString());
			}

			if (isPropertyAccessExpression(rawStatement)) {
				right.forEach((part) => {
					if (!(part instanceof BindingIdentifier)) {
						arr.push(this.convertToIndexedLookup(part));
					} else {
						arr.push(part);
					}
				});

				return [...left, ...arr];
			}

			return [...left, ...right];

		}

		if (isConstructorDeclaration(rawStatement)) {
			const arr: InitializationValue = ["constructor"];
			arr.push("(");
			const args = rawStatement.parameters;
			if (args != null) args.forEach((arg, index) => {
				const value = this.getValueExpression(arg);
				value.forEach(item => {
					arr.push(item);
					if (index !== args.length - 1) arr.push(",");
				});
			});
			arr.push(")");
			arr.push("{");
			const body = rawStatement.body == null ? [] : this.getValueExpression(rawStatement.body);
			body.forEach(part => arr.push(part));
			arr.push("}");
			return arr;
		}

		if (isClassExpression(rawStatement) || isClassDeclaration(rawStatement)) {
			const name = rawStatement.name == null ? [] : [nameGetter.getNameOfMember(rawStatement.name, false, true)];

			// TODO: At this point, we always assume that the extends clause is an atomic reference to something,
			// TODO: For example: Foo extends Bar. But, an extends clause can be anything, for example: Foo extends Bar.Baz
			// TODO: Or even Foo extends class Bar {}. We need to be able to take this into account.
			// TODO: see https://github.com/wessberg/CodeAnalyzer/issues/5 for more info.
			const heritage = rawStatement.heritageClauses == null ? null : heritageClauseFormatter.format(rawStatement.heritageClauses).extendsClass;
			const heritageFormatted = heritage == null ? [] : [" ", "extends", " ", new BindingIdentifier(heritage.name, rawStatement)];
			const members: InitializationValue = ["{"];

			rawStatement.members.forEach(member => {
				const content = this.getValueExpression(member);
				// Remove empty strings from the contents and add everything else to the value array.
				content.forEach(part => members.push(part));
			});
			members.push("}");
			return ["class", " ", ...name, ...heritageFormatted, ...members];
		}

		if (isVariableDeclaration(rawStatement)) {
			const nameExpression: string[] = [];

			if (isObjectBindingPattern(rawStatement.name)) {
				nameExpression.push("{");
				const elements = rawStatement.name.elements;
				elements.forEach((binding, index) => {
					nameExpression.push(nameGetter.getName(binding));
					if (index !== elements.length - 1) nameExpression.push(",");
				});
				nameExpression.push("}");
			}

			else if (isArrayBindingPattern(rawStatement.name)) {
				nameExpression.push("[");
				const elements = rawStatement.name.elements;
				elements.forEach((binding, index) => {
					if (isOmittedExpression(binding)) nameExpression.push(",");
					else nameExpression.push(nameGetter.getName(binding));
					if (index !== elements.length - 1) nameExpression.push(",");
				});
				nameExpression.push("]");
			}

			else {
				nameExpression.push(<string>nameGetter.getNameOfMember(rawStatement.name, false, true));
			}

			const initializer = rawStatement.initializer == null ? [] : ["=", ...this.getValueExpression(rawStatement.initializer)];
			return [...nameExpression, ...initializer];
		}

		if (isVariableStatement(rawStatement)) {
			return this.getValueExpression(rawStatement.declarationList);
		}

		if (isParameterDeclaration(rawStatement)) {
			const name = this.getValueExpression(rawStatement.name);
			const initializer = rawStatement.initializer == null ? null : this.getValueExpression(rawStatement.initializer);
			const arr: InitializationValue = [...name];
			if (initializer != null) {
				arr.push("=");
				initializer.forEach(item => arr.push(item));
			}

			return arr;
		}

		if (isArrowFunction(rawStatement)) {
			const isAsync = rawStatement.modifiers == null ? false : rawStatement.modifiers.find(modifier => isAsyncKeyword(modifier)) != null;
			const arr: InitializationValue = [];
			if (isAsync) {
				arr.push("async");
				arr.push(" ");
			}
			arr.push("(");
			const equalsGreaterThanToken = this.getValueExpression(rawStatement.equalsGreaterThanToken);
			const body = this.getValueExpression(rawStatement.body);

			rawStatement.parameters.forEach((parameter, index) => {
				const value = this.getValueExpression(parameter);
				value.forEach(item => arr.push(item));
				if (index !== rawStatement.parameters.length - 1) arr.push(",");
			});

			arr.push(")");
			equalsGreaterThanToken.forEach(item => arr.push(item));

			if (isBlockDeclaration(rawStatement.body)) {
				arr.push("{");
				body.forEach(item => arr.push(item));
				arr.push("}");
			}
			else {
				body.forEach(item => arr.push(item));
			}

			return arr;
		}

		if (isFunctionExpression(rawStatement) || isFunctionDeclaration(rawStatement) || isMethodDeclaration(rawStatement) || isGetAccessorDeclaration(rawStatement) || isSetAccessorDeclaration(rawStatement)) {
			const arr: InitializationValue = isFunctionExpression(rawStatement) || isFunctionDeclaration(rawStatement) ? ["function", " "] : [];
			const body = rawStatement.body == null ? null : this.getValueExpression(rawStatement.body);
			const name = rawStatement.name;
			if (name != null) {
				if (isMethodDeclaration(rawStatement) || isGetAccessorDeclaration(rawStatement) || isSetAccessorDeclaration(rawStatement)) {
					const isStatic = rawStatement.modifiers == null ? false : rawStatement.modifiers.find(modifier => isStaticKeyword(modifier)) != null;
					const isAsync = rawStatement.modifiers == null ? false : rawStatement.modifiers.find(modifier => isAsyncKeyword(modifier)) != null;
					if (isStatic) {
						arr.push("static");
						arr.push(" ");
					}

					if (isAsync) {
						arr.push("async");
						arr.push(" ");
					}
				}
				if (isGetAccessorDeclaration(rawStatement)) arr.push("get", " ");
				if (isSetAccessorDeclaration(rawStatement)) arr.push("set", " ");
				arr.push(nameGetter.getNameOfMember(name, false, true));
			}

			arr.push("(");

			rawStatement.parameters.forEach((parameter, index) => {
				const value = this.getValueExpression(parameter);
				value.forEach(item => arr.push(item));
				if (index !== rawStatement.parameters.length - 1) arr.push(",");
			});
			arr.push(")");
			arr.push("{");
			if (body != null) body.forEach(item => arr.push(item));
			arr.push("}");
			return arr;
		}

		if (isBlockDeclaration(rawStatement)) {
			const arr: InitializationValue = [];
			rawStatement.statements.forEach(statement => {
				const value = this.getValueExpression(statement);
				value.forEach(item => arr.push(item));
				arr.push(";");
			});
			return arr;
		}

		if (isSpreadElement(rawStatement)) {
			return ["...", ...this.getValueExpression(rawStatement.expression)];
		}

		if (isParenthesizedExpression(rawStatement)) {
			return ["(", ...this.getValueExpression(rawStatement.expression), ")"];
		}

		if (isVoidExpression(rawStatement)) {
			return ["void", " ", ...this.getValueExpression(rawStatement.expression)];
		}

		if (isReturnStatement(rawStatement)) {
			return [tokenSerializer.marshalToken(rawStatement.kind, rawStatement), " ", ...(rawStatement.expression == null ? [] : this.getValueExpression(rawStatement.expression))];
		}

		if (isTokenObject(rawStatement)) {
			return [tokenSerializer.marshalToken(rawStatement.kind, rawStatement)];
		}

		if (isIdentifierObject(rawStatement)) {
			const name = nameGetter.getName(rawStatement);
			const value = nameGetter.getNameOfMember(rawStatement, true);

			if (name === GlobalObjectIdentifier || name === "window") return [name];
			return [value];
		}

		throw new TypeError(`${this.getValueExpression.name} could not extract a value for a statement of kind ${(<Identifier>rawStatement).kind == null ? "unknown" : SyntaxKind[(<Identifier>rawStatement).kind]} around here: ${sourceFilePropertiesGetter.getSourceFileProperties(rawStatement).fileContents.slice((<Identifier>rawStatement).pos, (<Identifier>rawStatement).end)}`);
	}

	/**
	 * Returns true if the current item should be converted to an indexed lookup.
	 * @param {ArbitraryValue} previous
	 * @param {ArbitraryValue} current
	 * @returns {boolean}
	 */
	private shouldBeIndexedLookup (previous: ArbitraryValue, current: ArbitraryValue): boolean {
		if ((previous instanceof BindingIdentifier) && current instanceof BindingIdentifier) return true;
		if (current instanceof BindingIdentifier && previous != null &&
			(
				previous === ")" || previous === "]"
			)
		) return true;

		return this.isIndexedLookup(previous);

	}

	/**
	 * Returns true if the given item is an indexed lookup.
	 * @param {ArbitraryValue} item
	 * @returns {boolean}
	 */
	private isIndexedLookup (item: ArbitraryValue): boolean {
		return typeof item === "string" && (item.startsWith("[") || item.endsWith("]"));
	}

	/**
	 * Normalizes an indexed lookup or a dotted lookup into an indexed one
	 * @param {ArbitraryValue} path
	 * @returns {string}
	 */
	private convertToIndexedLookup (path: ArbitraryValue): string {
		if (tokenPredicator.isOperatorLike(path)) return path == null ? "" : path.toString();

		if (typeof path === "string") {
			if (this.isIndexedLookup(path)) return path;
			return `["${path}"]`;
		}

		return `[${path}]`;
	}
}