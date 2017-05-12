import {GlobalObject, GlobalObjectIdentifier} from "@wessberg/globalobject";
import {IMarshaller} from "@wessberg/marshaller";
import {Expression, Node, Statement} from "typescript";
import {BindingIdentifier} from "../model/BindingIdentifier";
import {ITokenPredicator} from "../predicate/interface/ITokenPredicator";
import {isIClassDeclaration, isIEnumDeclaration, isIFunctionDeclaration, isIImportExportBinding, isIParameter, isIVariableAssignment} from "../predicate/PredicateFunctions";
import {IIdentifierSerializer} from "../serializer/interface/IIdentifierSerializer";
import {ArbitraryValue, InitializationValue, INonNullableValueable, NonNullableArbitraryValue} from "../service/interface/ISimpleLanguageService";
import {ITracer} from "../tracer/interface/ITracer";
import {IStringUtil} from "../util/interface/IStringUtil";
import {IValueResolvedGetter} from "./interface/IValueResolvedGetter";

export class ValueResolvedGetter implements IValueResolvedGetter {
	private static readonly GLOBAL_OBJECT_MUTATIONS: Set<string> = new Set();
	private static readonly FUNCTION_OUTER_SCOPE_NAME: string = "__outer__";

	constructor (private marshaller: IMarshaller,
							 private tracer: ITracer,
							 private identifierSerializer: IIdentifierSerializer,
							 private tokenPredicator: ITokenPredicator,
							 private stringUtil: IStringUtil) {}

	/**
	 * Replaces BindingIdentifiers with actual values and flattens valueExpressions into concrete values.
	 * @param {INonNullableValueable} valueable
	 * @param {Statement|Expression|Node} from
	 * @param {string|null} scope
	 * @param {string|number} [takeKey]
	 * @returns {ArbitraryValue}
	 */
	public getValueResolved (valueable: INonNullableValueable, from: Statement | Expression | Node, scope: string | null, takeKey?: string | number): string | null {
		if (valueable.resolving) return null;

		valueable.resolving = true;
		// console.log("valueExpression:", valueable.expression);
		const [flattened, shouldCompute] = this.flattenValueExpression(valueable.expression, from, scope);

		// console.log("flattened:", flattened);
		let result = shouldCompute ? this.computeValueResolved(flattened) : flattened;
		valueable.resolving = false;
		// console.log("computed:", result);
		const takenResult = takeKey == null || result == null ? result : result[<keyof NonNullableArbitraryValue>takeKey];
		this.clearGlobalMutations();
		return <string>this.marshaller.marshal<ArbitraryValue, string>(takenResult, "");
	}

	private clearGlobalMutations (): void {
		ValueResolvedGetter.GLOBAL_OBJECT_MUTATIONS.forEach(mutation => {
			delete GlobalObject[<keyof Window>mutation];
		});
		ValueResolvedGetter.GLOBAL_OBJECT_MUTATIONS.clear();
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
			return new Function(flattened)();
		}
	}

	private flattenValueExpression (valueExpression: InitializationValue, from: Statement | Expression | Node, scope: string | null): [string, boolean] {
		let val: string = "";

		const [hadNewExpression, expression] = this.convertNewExpressionToObjectLiteral(valueExpression);
		let shouldCompute: boolean = true;
		let forceNoQuoting: boolean = false;

		expression.forEach((part, index) => {
			if (part instanceof BindingIdentifier) {
				const isRecursive = part.name === scope;

				const substitution = this.tracer.traceIdentifier(part.name, from, scope);
				let sub: string;

				if (isIParameter(substitution)) {
					const initializedTo = this.identifierSerializer.serializeIParameter(substitution);
					sub = `(${part.name} === undefined ? ${initializedTo} : ${part.name})`;
					shouldCompute = false;
					forceNoQuoting = true;
				}

				else if (isIVariableAssignment(substitution) || isIImportExportBinding(substitution)) {
					const stringified = isIVariableAssignment(substitution) ? this.identifierSerializer.serializeIVariableAssignment(substitution) : this.identifierSerializer.serializeIImportExportBinding(substitution);
					const probableType = this.marshaller.getTypeOf(this.marshaller.marshal(stringified));
					if (
						probableType === "object" ||
						probableType === "function"
					) sub = stringified;
					else {
						const previousPart = index === 0 ? "" : expression[index - 1];
						const nextPart = index === expression.length - 1 ? "" : expression[index + 1];
						const requiresIdentifier = this.tokenPredicator.throwsIfPrimitive(previousPart) || this.tokenPredicator.throwsIfPrimitive(nextPart);
						const stringifiedNormalized = this.marshaller.getTypeOf(this.marshaller.marshal(stringified)) === "string" ? <string>this.stringUtil.quoteIfNecessary(stringified) : stringified;
						if (requiresIdentifier) sub = `${GlobalObjectIdentifier}.${part.name}`;
						else sub = `(${GlobalObjectIdentifier}.${part.name} = ${GlobalObjectIdentifier}.${part.name} === undefined ? ${stringifiedNormalized} : ${GlobalObjectIdentifier}.${part.name})`;
						forceNoQuoting = true;
						ValueResolvedGetter.GLOBAL_OBJECT_MUTATIONS.add(part.name);
					}
				}

				else if (isIClassDeclaration(substitution)) {
					const statics = part.name !== "this" && part.name === substitution.name && !hadNewExpression;
					sub = this.identifierSerializer.serializeIClassDeclaration(substitution, statics, part.name, scope);
				}

				else if (isIEnumDeclaration(substitution)) {
					sub = this.identifierSerializer.serializeIEnumDeclaration(substitution);
				}

				else if (isIFunctionDeclaration(substitution)) {
					if (isRecursive) {
						sub = ValueResolvedGetter.FUNCTION_OUTER_SCOPE_NAME;
						forceNoQuoting = true;
					}
					else {
						const stringified = this.identifierSerializer.serializeIFunctionDeclaration(substitution);
						const hasReturnStatement = substitution.returnStatement.startsAt >= 0;
						const startsWithReturn = hasReturnStatement && stringified.trim().startsWith("return");
						const bracketed = hasReturnStatement ? `{${startsWithReturn ? "" : "return"} ${stringified}}` : stringified;
						const parameters = this.identifierSerializer.serializeIParameterBody(substitution.parameters);
						sub = `(function ${ValueResolvedGetter.FUNCTION_OUTER_SCOPE_NAME}(${parameters}) ${bracketed})`;
					}
				}

				else {
					// The identifier could not be found. Assume that it is part of the environment.
					sub = part.name;
					forceNoQuoting = true;
					console.log(`Assuming that '${part.name}' is part of the global environment...`);
					// throw new TypeError(`${this.flattenValueExpression.name} could not flatten a substitution for identifier: ${part.name} in scope: ${scope}`);
				}

				if (!forceNoQuoting && this.marshaller.getTypeOf(this.marshaller.marshal(sub)) === "string") sub = <string>this.stringUtil.quoteIfNecessary(sub);
				val += sub;
			} else {
				if (this.tokenPredicator.isTokenLike(part)) val += <string>part;
				else val += this.marshaller.marshal<ArbitraryValue, string>(part, "");
			}
		});
		return [val, shouldCompute];
	}

	private convertNewExpressionToObjectLiteral (valueExpression: InitializationValue): [boolean, InitializationValue] {
		const newExp: InitializationValue = [];
		let newExpressionInProgress = false;
		let hadNewExpression = false;
		valueExpression.forEach((part) => {
			if (part === "new") {
				newExpressionInProgress = true;
				hadNewExpression = true;
			}
			if (newExpressionInProgress && (part === ";")) {
				newExpressionInProgress = false;
			}
			if (!newExpressionInProgress || part instanceof BindingIdentifier) {
				newExp.push(part);
			}
		});
		return [hadNewExpression, hadNewExpression ? newExp : valueExpression];
	}
}