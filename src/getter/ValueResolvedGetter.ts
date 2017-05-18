import {GlobalObject, GlobalObjectIdentifier} from "@wessberg/globalobject";
import {IMarshaller} from "@wessberg/marshaller";
import {Expression, Node, Statement, SyntaxKind} from "typescript";
import {BindingIdentifier} from "../model/BindingIdentifier";
import {ITokenPredicator} from "../predicate/interface/ITokenPredicator";
import {isICallExpression, isIClassDeclaration, isIEnumDeclaration, isIFunctionDeclaration, isIImportExportBinding, isIParameter, isIVariableAssignment} from "../predicate/PredicateFunctions";
import {IIdentifierSerializer, ReplacementPositions} from "../serializer/interface/IIdentifierSerializer";
import {ArbitraryValue, ICodeAnalyzer, InitializationValue, INonNullableValueable, NAMESPACE_NAME, NonNullableArbitraryValue} from "../service/interface/ICodeAnalyzer";
import {ITracer} from "../tracer/interface/ITracer";
import {IFlattenOptions, IValueResolvedGetter} from "./interface/IValueResolvedGetter";

export class ValueResolvedGetter implements IValueResolvedGetter {
	private static readonly FUNCTION_OUTER_SCOPE_NAME: string = "__outer__";

	constructor (private languageService: ICodeAnalyzer,
							 private marshaller: IMarshaller,
							 private tracer: ITracer,
							 private identifierSerializer: IIdentifierSerializer,
							 private tokenPredicator: ITokenPredicator) {
	}

	/**
	 * Replaces BindingIdentifiers with actual values and flattens valueExpressions into concrete values.
	 * @param {INonNullableValueable} valueable
	 * @param {Statement|Expression|Node} from
	 * @param {string|null} scope
	 * @param {string|number} [takeKey]
	 * @param {boolean} [insideThisScope=false]
	 * @returns {ArbitraryValue}
	 */
	public getValueResolved (valueable: INonNullableValueable, from: Statement|Expression|Node, scope: string|null, takeKey?: string|number, insideThisScope: boolean = false): [ArbitraryValue, ArbitraryValue] {
		if (valueable.resolving) return [null, null];

		valueable.resolving = true;

		let [setup, setupAdditionPositions, flattened, options] = this.flattenValueExpression(valueable.expression, from, scope, insideThisScope);
		let computed: ArbitraryValue = flattened;

		if (options.shouldCompute) {
			try {
				computed = this.computeValueResolved(setup, flattened);
				// console.log("flattened:", setup, flattened);
			} catch (ex) {
				const keys = Object.keys(setupAdditionPositions);
				for (const key of keys) {
					try {
						const [replacementStart, replacementEnd] = setupAdditionPositions[key];
						if (replacementStart === -1) break;

						const setupBefore = setup.slice(0, replacementStart);
						const setupMiddle = setup.slice(replacementStart, replacementEnd);
						const setupAfter = setup.slice(replacementEnd);
						setup = `${setupBefore}\`${setupMiddle}\`${setupAfter}`;
						// console.log("flattened:", setup, flattened);
						computed = this.computeValueResolved(setup, flattened);
						break;
					} catch (ex) {
						// Fail softly. We want to proceed to the next iteration.
					}
				}

			}
		}

		// console.log("computed:", computed);
		const takenResult = takeKey == null || computed == null ? computed : computed[<keyof NonNullableArbitraryValue>takeKey];

		valueable.resolving = false;
		return [takenResult, flattened];
	}

	/**
	 * Computes/Evaluates the given expression to a concrete value.
	 * @param {string} scope
	 * @param {string} flattened
	 * @returns {ArbitraryValue}
	 */
	private computeValueResolved (scope: string, flattened: string): ArbitraryValue {
		try {
			return new Function(`${scope} return (${flattened})`)();
		} catch (ex) {
			return new Function(`${scope}${flattened}`)();
		}
	}

	private flattenBoundPart (part: BindingIdentifier, from: Statement|Expression|Node, scope: string|null, insideComputedThisScope: boolean = false, expression: ArbitraryValue[], index: number, options: IFlattenOptions): [string, ReplacementPositions] {

		const isRecursive = part.name === scope;
		const substitution = this.tracer.traceIdentifier(part.name, from, scope);
		let sub: string = "";
		const name = part.name === "this" && !insideComputedThisScope ? "that" : part.name;
		let replacements: ReplacementPositions = {};

		if (isICallExpression(substitution) && substitution.identifier === "require") {

			const imports = this.languageService.getImportDeclarationsForFile(substitution.filePath, true);
			const firstArgument = substitution.arguments.argumentsList[0];
			const requirePath = firstArgument.value.hasDoneFirstResolve() ? firstArgument.value.resolved : firstArgument.value.resolve();
			const importMatch = imports.find(importDeclaration => !(importDeclaration.source instanceof BindingIdentifier) && (importDeclaration.source.relativePath === requirePath || importDeclaration.source.fullPath === requirePath));
			if (importMatch != null) {
				const properBinding = importMatch.bindings[NAMESPACE_NAME];
				if (properBinding != null) {
					const [intermediate] = this.flattenBoundPart(properBinding, from, scope, insideComputedThisScope, expression, index, options);
					const requireShim = `\nvar require = () => ${NAMESPACE_NAME}\n`;
					return [`${intermediate}${requireShim}`, replacements];
				}
			}
		}

		if (isIParameter(substitution)) {
			const [initializedTo, replacementPositions] = this.identifierSerializer.serializeIParameter(substitution);
			sub += `var ${name} = (${part.name} === undefined ? ${initializedTo} : ${part.name})`;
			options.shouldCompute = false;
			options.forceNoQuoting = true;

			let offset = sub.indexOf(initializedTo);
			Object.keys(replacementPositions).forEach(key => {
				const [start, end] = replacementPositions[key];
				replacementPositions[key] = [start + offset, end + offset];
			});
			replacements = replacementPositions;
		}

		else if (isIVariableAssignment(substitution) || isIImportExportBinding(substitution)) {
			const [stringified, replacementPositions] = isIVariableAssignment(substitution) ? this.identifierSerializer.serializeIVariableAssignment(substitution) : this.identifierSerializer.serializeIImportExportBinding(substitution.payload);
			sub += `var ${name} = (${part.name} === undefined ? ${stringified} : ${part.name})`;

			let offset = sub.indexOf(stringified);
			Object.keys(replacementPositions).forEach(key => {
				const [start, end] = replacementPositions[key];
				replacementPositions[key] = [start + offset, end + offset];
			});
			replacements = replacementPositions;
		}

		else if (isIClassDeclaration(substitution)) {
			if (insideComputedThisScope) sub += "this";
			else {
				const [stringified, replacementPositions] = this.identifierSerializer.serializeIClassDeclaration(substitution);
				sub += `var ${name} = (${name} === undefined ? ${part.name === "this" ? "new" : ""} ${stringified} : ${name})`;

				let offset = sub.indexOf(stringified);
				Object.keys(replacementPositions).forEach(key => {
					const [start, end] = replacementPositions[key];
					replacementPositions[key] = [start + offset, end + offset];
				});
				replacements = replacementPositions;
			}
		}

		else if (isIEnumDeclaration(substitution)) {
			const [stringified, replacementPositions] = this.identifierSerializer.serializeIEnumDeclaration(substitution);
			sub += `var ${name} = (${part.name} === undefined ? ${stringified} : ${part.name})`;

			let offset = sub.indexOf(stringified);
			Object.keys(replacementPositions).forEach(key => {
				const [start, end] = replacementPositions[key];
				replacementPositions[key] = [start + offset, end + offset];
			});
			replacements = replacementPositions;
		}

		else if (isIFunctionDeclaration(substitution)) {
			if (isRecursive) {
				sub = ValueResolvedGetter.FUNCTION_OUTER_SCOPE_NAME;
			}
			else {
				const [stringified, replacementPositions] = this.identifierSerializer.serializeIFunctionDeclaration(substitution);
				const [parameters] = this.identifierSerializer.serializeIParameterBody(substitution.parameters);

				const hasReturnStatement = stringified == null ? false : this.languageService.statementsIncludeKind(this.languageService.toAST(stringified.toString()), SyntaxKind.ReturnStatement, true);
				const bracketed = hasReturnStatement ? `{${stringified}}` : `{return (${stringified})}`;
				sub += `var ${name} = (${part.name} === undefined ? ${`(function ${substitution.name}(${parameters}) ${bracketed})`} : ${part.name})`;

				let offset = sub.indexOf(stringified);
				Object.keys(replacementPositions).forEach(key => {
					const [start, end] = replacementPositions[key];
					replacementPositions[key] = [start + offset, end + offset];
				});
				replacements = replacementPositions;
			}
		}

		else {
			// The identifier could not be found. Assume that it is part of the environment.
			sub += part.name;
			console.log(`Assuming that '${part.name}' is part of the global environment...`);
			// throw new TypeError(`${this.flattenValueExpression.name} could not flatten a substitution for identifier: ${part.name} in scope: ${scope}`);
		}
		sub += ";";
		return [sub, replacements];
	}

	private flattenValueExpression (valueExpression: InitializationValue, from: Statement|Expression|Node, scope: string|null, insideComputedThisScope: boolean = false): [string, ReplacementPositions, string, IFlattenOptions] {
		let val: string = "";
		let setup: string = "";
		let setupAdditionPositions: ReplacementPositions = {};

		const options: IFlattenOptions = {
			shouldCompute: true,
			forceNoQuoting: false
		};

		valueExpression.forEach((part, index) => {
			if (part instanceof BindingIdentifier) {
				const [setupAddition, positions] = this.flattenBoundPart(part, from, scope, insideComputedThisScope, valueExpression, index, options);
				setupAdditionPositions = positions;
				setup += `${setupAddition}\n`;
				val += part.name === "this" && !insideComputedThisScope ? "that" : part.name;
			} else {
				if (part === "const" || part === "var" || part === "let") return;
				if (part === GlobalObject) val += GlobalObjectIdentifier;
				else if (this.tokenPredicator.isTokenLike(part)) val += <string>part;
				else val += this.marshaller.marshal<ArbitraryValue, string>(part, "");
			}
		});
		return [setup, setupAdditionPositions, val, options];
	}

}