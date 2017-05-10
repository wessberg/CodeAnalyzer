import {ICallableFormatter} from "./interface/ICallableFormatter";
import {ArbitraryValue, ICallable, INonNullableValueable, ITypeable, IValueable, TypeExpression} from "../interface/ISimpleLanguageService";
import {CallExpression, NewExpression, SyntaxKind} from "typescript";
import {isIdentifierObject, isLiteralExpression, isPropertyAccessExpression} from "../PredicateFunctions";
import {IValueExpressionGetter} from "../getter/interface/IValueExpressionGetter";
import {IValueResolvedGetter} from "../getter/interface/IValueResolvedGetter";
import {INameGetter} from "../getter/interface/INameGetter";
import {ITracer} from "../tracer/interface/ITracer";
import {serializeTypeExpression, takeTypeBindings} from "../Util";
import {ITypeExpressionGetter} from "../getter/interface/ITypeExpressionGetter";

export abstract class CallableFormatter implements ICallableFormatter {

	constructor (private tracer: ITracer,
							 private valueExpressionGetter: IValueExpressionGetter,
							 private valueResolvedGetter: IValueResolvedGetter,
							 private nameGetter: INameGetter,
							 private typeExpressionGetter: ITypeExpressionGetter) {}

	/**
	 * Formats the callable identifier and property path (if any) of a given CallExpression or NewExpression and returns an ICallable.
	 * @param {CallExpression|NewExpression} statement
	 * @returns {ICallable}
	 */
	protected formatCallable (statement: CallExpression | NewExpression): ICallable {
		const exp = statement.expression;
		let property: ArbitraryValue = null;
		let identifier: ArbitraryValue = null;

		if (isIdentifierObject(exp)) {
			identifier = this.nameGetter.getNameOfMember(exp, false, true);
		}

		if (isPropertyAccessExpression(exp)) {

			// The left-hand side of the expression might be a literal (for example, "hello".toString()).
			if (isLiteralExpression(exp.expression)) {
				const that = this;
				const scope = this.tracer.traceThis(exp.expression);
				const value: IValueable = {
					expression: this.valueExpressionGetter.getValueExpression(exp.expression),
					resolved: undefined,
					hasDoneFirstResolve () {return value.resolved !== undefined;},
					resolving: false,
					resolve () {
						value.resolved = value.expression == null ? null : that.valueResolvedGetter.getValueResolved(<INonNullableValueable>value, exp.expression, scope);
						return value.resolved;
					}
				};
				property = value.resolve();
			} else {
				// The left-hand side is simply an identifier.
				property = this.nameGetter.getNameOfMember(exp.expression);
			}
			identifier = this.nameGetter.getNameOfMember(exp.name, false, true);
		}

		if (identifier == null) {
			throw new TypeError(`${this.formatCallable.name} could not format a CallExpression|NewExpression with an expression of kind ${SyntaxKind[exp.kind]}`);
		}
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
	protected formatTypeArguments (statement: CallExpression | NewExpression): ITypeable {
		const typeExpressions = statement.typeArguments == null ? null : statement.typeArguments.map(typeArg => this.typeExpressionGetter.getTypeExpression(typeArg));
		let typeExpression: TypeExpression = [];
		if (typeExpressions != null) {
			typeExpressions.forEach((typeExp, index) => {
				typeExp.forEach(part => typeExpression.push(part));
				if (index !== typeExpressions.length - 1) typeExpression.push(", ");
			});
		}
		const typeFlattened = typeExpression == null || typeExpression.length < 1 ? null : serializeTypeExpression(typeExpression);
		const typeBindings = typeExpression == null || typeExpression.length < 1 ? null : takeTypeBindings(typeExpression);

		return {
			expression: typeExpression.length < 1 ? null : typeExpression,
			flattened: typeFlattened,
			bindings: typeBindings
		};
	}
}