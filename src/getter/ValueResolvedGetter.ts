import "../shim/browser";
import {Expression, Node, Statement} from "typescript";
import {BindingIdentifier} from "../model/BindingIdentifier";
import {isICallExpression, isIClassDeclaration, isIEnumDeclaration, isIFunctionDeclaration, isIIdentifier, isILiteralValue, isIParameter, isIVariableAssignment, isNamespacedModuleMap} from "../predicate/PredicateFunctions";
import {ITracedExpressionsFormatterOptions, IValueResolvedGetter} from "./interface/IValueResolvedGetter";
import {config} from "../static/Config";
import {mapper, marshaller, tokenPredicator, tracer} from "../services";
import {ArbitraryValue, IdentifierMapKind, IIdentifier, INonNullableValueable, NonNullableArbitraryValue} from "../identifier/interface/IIdentifier";
import {Config} from "@wessberg/environment";

/**
 * A class that can (or at least attempts to) resolve/compute a value for any kind of ValueExpression.
 * This is useful for performing partial code evaluation ahead of time.
 */
export class ValueResolvedGetter implements IValueResolvedGetter {

	/**
	 * Replaces BindingIdentifiers with actual values and flattens valueExpressions into concrete values.
	 * @param {INonNullableValueable} valueable
	 * @param {Statement|Expression|Node} from
	 * @param {string|number} [takeKey]
	 * @returns {ArbitraryValue}
	 */
	public getValueResolved (valueable: INonNullableValueable, from: Statement|Expression|Node, takeKey?: string|number): [ArbitraryValue, ArbitraryValue] {
		if (valueable.resolving) return [null, null];
		valueable.resolving = true;

		const exps = this.flattenValueExpressions(valueable.expression, from);
		const joined = exps.map(part => typeof part === "string" ? part : marshaller.marshal(part)).join("");
		const computed = this.attemptComputation(joined);
		const takenResult = takeKey == null || computed == null ? computed : computed[<keyof NonNullableArbitraryValue>takeKey];
		valueable.resolving = false;
		return [takenResult, joined];
	}

	/**
	 * Converts the traced identifier to value expressions.
	 * @param {IIdentifier} traced
	 * @param {Statement | Expression | Node} from
	 * @param {BindingIdentifier} identifier
	 * @param {string} scope
	 * @param {boolean} isSignature
	 * @param {ArbitraryValue} [next]
	 * @returns {ArbitraryValue[]}
	 */
	private getExpressionsFromTracedIdentifier ({traced, from, identifier, scope, isSignature, next}: ITracedExpressionsFormatterOptions): ArbitraryValue[] {

		if (isILiteralValue(traced)) {
			const val = traced.value();

			const arr: ArbitraryValue[] = [];
			val.forEach((part, index) => {

				if (isIIdentifier(part)) {
					const partNext = index === val.length - 1 ? undefined : val[index + 1];
					const mappedFrom = mapper.get(traced);
					const value = this.getExpressionsFromTracedIdentifier({traced: part, from: mappedFrom == null ? from : mappedFrom, identifier, scope, isSignature, next: partNext});
					value.forEach(item => arr.push(item));
				}

				else if (part instanceof BindingIdentifier) {
					const expressions = this.flattenValueExpressions([part], part.location);
					expressions.forEach(item => arr.push(item));
				}

				else {
					arr.push(part);
				}
			});
			return arr;
		}

		if (isNamespacedModuleMap(traced)) {
			const keys = Object.keys(traced);
			const arr: ArbitraryValue[] = ["{"];
			keys.forEach((key, index) => {
				arr.push(key);
				arr.push(":");
				const value = traced[key];
				const partNext = index === keys.length - 1 ? undefined : traced[keys[index + 1]];
				const expression = this.getExpressionsFromTracedIdentifier({traced: <IIdentifier>value, from, identifier, scope, isSignature, next: partNext});
				expression.forEach(part => arr.push(part));
				if (index !== keys.length - 1) arr.push(",");
			});
			arr.push("}");
			return arr;
		}

		if (isIVariableAssignment(traced)) {
			if (next != null && tokenPredicator.throwsIfPrimitive(next)) return [traced.name];

			if (traced.value.expression == null) return [traced.name];
			if (traced.value.expression.some(part => part instanceof BindingIdentifier && (part.name === "this" || part.name === "super"))) {
				return [traced.name];
			}

			const mappedFrom = mapper.get(traced);
			const exp = this.flattenValueExpressions(traced.value.expression, mappedFrom == null ? from : mappedFrom);
			return ["(", "(", ")", "=>", "{", "try", "{", traced.name, ";", "return", " ", traced.name, ";", "}", "catch", "(", "e", ")", "{", "return", "(", ...exp, ")", "}", "}", ")", "(", ")"];
		}

		if (isIParameter(traced)) {
			if (isSignature) {
				const mappedFrom = mapper.get(traced);
				const initializer = traced.value.expression == null ? [] : this.flattenValueExpressions(traced.value.expression, mappedFrom == null ? from : mappedFrom);
				const assignment = initializer.length > 0 ? ["="] : [];
				return [...traced.nameFormatted, ...assignment, ...initializer];
			} else {
				return [traced.name.find(part => part === identifier.name)];
			}
		}

		if (isIClassDeclaration(traced)) {
			const newExpression = (identifier.name === "this" || identifier.name === "super") ? ["new", " "] : [];
			const newExpressionOutro = (identifier.name === "this" || identifier.name === "super") && next !== "{" && next !== "(" ? ["(", ")"] : [];
			if (traced.value.expression == null) return [];
			const mappedFrom = mapper.get(traced);
			return [...newExpression, ...this.flattenValueExpressions(traced.value.expression, mappedFrom == null ? from : mappedFrom), ...newExpressionOutro];
		}

		if (isIEnumDeclaration(traced)) {
			return [traced.members];
		}

		if (isIFunctionDeclaration(traced)) {
			const parameters: ArbitraryValue[] = [];
			traced.parameters.parametersList.forEach((parameter, index) => {
				const partNext = index === traced.parameters.parametersList.length - 1 ? undefined : traced.parameters.parametersList[index + 1];
				const exp = this.getExpressionsFromTracedIdentifier({traced: parameter, from, identifier, scope, isSignature: true, next: partNext});
				exp.forEach(part => parameters.push(part));
				if (index !== traced.parameters.parametersList.length - 1) parameters.push(",");
			});

			const mappedFrom = mapper.get(traced);
			return ["function", " ", traced.name, "(", ...parameters, ")", "{", ...(traced.value.expression == null ? [] : this.flattenValueExpressions(traced.value.expression, mappedFrom == null ? from : mappedFrom)), "}"];
		}

		if (isICallExpression(traced)) {
			// TODO: If it is a 'require' expression, we want to trace the module in a different way.
			const mappedFrom = mapper.get(traced);
			const newIdentifier = Array.isArray(traced.identifier) ? this.flattenValueExpressions(traced.identifier, mappedFrom == null ? from : mappedFrom) : [traced.identifier];

			let expression: ArbitraryValue[] = [...newIdentifier];
			if (traced.property != null) {
				const property = Array.isArray(traced.property) ? this.flattenValueExpressions(traced.property, mappedFrom == null ? from : mappedFrom) : [`"${traced.property}"`];
				expression = [...expression, "[", ...property, "]"];
			}

			expression.push("(");
			traced.arguments.argumentsList.forEach((arg, index) => {
				const expressions = arg.value.expression == null ? [] : this.flattenValueExpressions(arg.value.expression, mappedFrom == null ? from : mappedFrom);
				expressions.forEach(exp => expression.push(exp));
				if (index !== traced.arguments.argumentsList.length - 1) expressions.push(",");
			});
			expression.push(")");
			return expression;
		}

		throw new TypeError(`${this.constructor.name} could not get expressions for an IIdentifier of kind ${IdentifierMapKind[traced.___kind]}`);
	}

	/**
	 * Resolves and gets all value expressions recursively for the given identifier.
	 * @param {BindingIdentifier} identifier
	 * @param {string} scope
	 * @param {ArbitraryValue} next
	 * @returns {ArbitraryValue[]}
	 */
	private getExpressionsFromIdentifier (identifier: BindingIdentifier, scope: string, next: ArbitraryValue|undefined): ArbitraryValue[] {

		// If the identifier is the scope itself, return a reference to it.
		if (scope === identifier.name) return [identifier.name];
		const thisScope = tracer.traceThis(identifier.location);

		if ((identifier.name === "this" || identifier.name === "super") && (scope === thisScope)) return [identifier.name];

		// This will sometimes happen if the scope is determined from a built-in class and thus is unknown.
		if (scope === config.name.global && thisScope !== config.name.global) return [identifier.name];

		const traced = tracer.traceIdentifier(identifier.name, identifier.location);
		if (isIIdentifier(traced)) return this.getExpressionsFromTracedIdentifier({traced, from: identifier.location, identifier, scope, isSignature: false, next});

		if (Config.DEBUG) console.log(`Assuming that '${identifier.name}' is part of the global environment...`);
		return [identifier.name];
	}

	/**
	 * Handles an expression by recursively resolving and flattening and it to value expressions.
	 * @param {ArbitraryValue} expression
	 * @param {string} scope
	 * @param {ArbitraryValue} next
	 * @returns {ArbitraryValue[]}
	 */
	private handleValueExpression (expression: ArbitraryValue, scope: string, next: ArbitraryValue|undefined): ArbitraryValue[] {
		if (expression instanceof BindingIdentifier) {
			return this.getExpressionsFromIdentifier(expression, scope, next);
		} else {
			if (typeof expression === "string" && (expression === "let" || expression === "const")) return ["var"];
			return [expression];
		}
	}

	/**
	 * Flattens all the given value expressions. Those that are BindingIdentifiers will be resolved and flattened to value expressions.
	 * @param {ArbitraryValue[]} expressions
	 * @param {Statement | Expression | Node} from
	 * @returns {ArbitraryValue[]}
	 */
	private flattenValueExpressions (expressions: ArbitraryValue[], from: Statement|Expression|Node): ArbitraryValue[] {
		const merged: ArbitraryValue[] = [];
		const scope = tracer.traceBlockScopeName(from);

		expressions.forEach((expression, index) => {
			const next = index === expressions.length - 1 ? undefined : expressions[index + 1];
			this.handleValueExpression(expression, scope, next).forEach(exp => merged.push(exp));
		});
		return merged;
	}

	/**
	 * Attempts to compute a value for the given stringified expression.
	 * @param {string} flattened
	 * @returns {ArbitraryValue}
	 */
	private attemptComputation (flattened: string): ArbitraryValue {
		return this.computeValueResolved(flattened);
	}

	/**
	 * Computes/Evaluates the given expression to a concrete value.
	 * @param {string} flattened
	 * @returns {ArbitraryValue}
	 */
	private computeValueResolved (flattened: string): ArbitraryValue {
		try {
			return new Function(`return (${flattened})`)();
		} catch (ex) {
			try {
				return new Function(`${flattened}`)();
			} catch (ex) {
				const reason = `A computation failed for:\n${flattened}. Reason: ${ex.message}`;
				if (Config.DEBUG) console.error(reason);
				return null;
				// if (Config.DEBUG) throw TypeError(reason);
				// else return null;
			}
		}
	}
}