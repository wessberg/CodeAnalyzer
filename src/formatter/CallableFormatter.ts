import {CallExpression, NewExpression, ParenthesizedExpression} from "typescript";
import {INameGetter} from "../getter/interface/INameGetter";
import {ITypeExpressionGetter} from "../getter/interface/ITypeExpressionGetter";
import {isArrowFunction, isBinaryExpression, isCallExpression, isElementAccessExpression, isFunctionExpression, isIdentifierObject, isLiteralExpression, isNewExpression, isParenthesizedExpression, isPropertyAccessExpression, isSuperExpression} from "../predicate/PredicateFunctions";
import {ITokenSerializer} from "../serializer/interface/ITokenSerializer";
import {ArbitraryValue, ICallable, ITypeable, TypeExpression} from "../service/interface/ICodeAnalyzer";
import {ITypeUtil} from "../util/interface/ITypeUtil";
import {ICallableFormatter} from "./interface/ICallableFormatter";
import {Config} from "../static/Config";
import {IValueableFormatter} from "./interface/IValueableFormatter";

export abstract class CallableFormatter implements ICallableFormatter {

	constructor (private valueableFormatter: IValueableFormatter,
							 private nameGetter: INameGetter,
							 private typeExpressionGetter: ITypeExpressionGetter,
							 private tokenSerializer: ITokenSerializer,
							 private typeUtil: ITypeUtil) {
	}

	/**
	 * Formats the callable identifier and property path (if any) of a given CallExpression or NewExpression and returns an ICallable.
	 * @param {CallExpression|NewExpression|ParenthesizedExpression} statement
	 * @returns {ICallable}
	 */
	protected formatCallable (statement: CallExpression|NewExpression|ParenthesizedExpression): ICallable {
		let property: ArbitraryValue = null;
		let identifier: ArbitraryValue = null;

		const exp = statement.expression;

		if (isIdentifierObject(exp)) {
			identifier = this.nameGetter.getNameOfMember(exp, false, true);
		}

		if (isFunctionExpression(exp)) {
			identifier = this.nameGetter.getNameOfMember(exp, false, true);
		}

		if (isNewExpression(exp)) {
			identifier = this.nameGetter.getNameOfMember(exp, false, true);
		}

		if (isSuperExpression(exp)) {
			identifier = this.nameGetter.getNameOfMember(exp, false, true);
		}

		if (isParenthesizedExpression(exp)) {
			return this.formatCallable(exp);
		}

		if (isArrowFunction(exp)) {
			identifier = Config.name.anonymous;
			const value = this.valueableFormatter.format(exp);
			property = value.hasDoneFirstResolve() ? value.resolved : value.resolve();
		}

		else if (isPropertyAccessExpression(exp) || isElementAccessExpression(exp)) {

			// The left-hand side of the expression might be a literal (for example, "hello".toString()).
			if (isLiteralExpression(exp.expression)) {
				const value = this.valueableFormatter.format(exp.expression);
				property = value.hasDoneFirstResolve() ? value.resolved : value.resolve();
			} else {
				try {
					// The left-hand side is simply an identifier.
					property = this.nameGetter.getNameOfMember(exp.expression);
				} catch (ex) {
					// It might be more complex than that - such as a ConditionalExpression
					const value = this.valueableFormatter.format(exp.expression);
					property = value.hasDoneFirstResolve() ? value.resolved : value.resolve();
				}
			}

			identifier = isPropertyAccessExpression(exp)
				? this.nameGetter.getNameOfMember(exp.name, false, true)
				: exp.argumentExpression == null
					? null
					: isBinaryExpression(exp.argumentExpression)
						? this.valueableFormatter.format(exp)
						: this.nameGetter.getNameOfMember(exp.argumentExpression, false, true);

		}

		else if (isBinaryExpression(exp)) {
			const formatted = this.valueableFormatter.format(exp);
			identifier = formatted.expression;
		}

		else if (isCallExpression(exp)) {
			const callable = this.formatCallable(exp);
			identifier = callable.identifier;
			property = callable.property;
		}

		// TODO: Consider re-adding error handling here

		return {
			property,
			identifier
		};
	}

	/**
	 * Formats the typeArguments given to a CallExpression or a NewExpression and returns an ITypeable.
	 * @param {CallExpression|NewExpression} statement
	 * @returns {ITypeable}
	 */
	protected formatTypeArguments (statement: CallExpression|NewExpression): ITypeable {
		const typeExpressions = statement.typeArguments == null ? null : statement.typeArguments.map(typeArg => this.typeExpressionGetter.getTypeExpression(typeArg));
		let typeExpression: TypeExpression = [];
		if (typeExpressions != null) {
			typeExpressions.forEach((typeExp, index) => {
				typeExp.forEach(part => typeExpression.push(part));
				if (index !== typeExpressions.length - 1) typeExpression.push(", ");
			});
		}
		const typeFlattened = typeExpression == null || typeExpression.length < 1 ? null : this.tokenSerializer.serializeTypeExpression(typeExpression);
		const typeBindings = typeExpression == null || typeExpression.length < 1 ? null : this.typeUtil.takeTypeBindings(typeExpression);

		return {
			expression: typeExpression.length < 1 ? null : typeExpression,
			flattened: typeFlattened,
			bindings: typeBindings
		};
	}
}