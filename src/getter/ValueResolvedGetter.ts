import {GlobalObject, GlobalObjectIdentifier} from "@wessberg/globalobject";
import {IMarshaller} from "@wessberg/marshaller";
import {Expression, Node, Statement} from "typescript";
import {BindingIdentifier} from "../model/BindingIdentifier";
import {ITokenPredicator} from "../predicate/interface/ITokenPredicator";
import {isICallExpression, isIClassDeclaration, isIEnumDeclaration, isIFunctionDeclaration, isILiteralValue, isIParameter, isIVariableAssignment} from "../predicate/PredicateFunctions";
import {IIdentifierSerializer} from "../serializer/interface/IIdentifierSerializer";
import {ArbitraryValue, ICodeAnalyzer, InitializationValue, INonNullableValueable, NAMESPACE_NAME, NonNullableArbitraryValue} from "../service/interface/ICodeAnalyzer";
import {ITracer} from "../tracer/interface/ITracer";
import {IFlattenOptions, IValueResolvedGetter} from "./interface/IValueResolvedGetter";
import {ICombinationUtil} from "../util/interface/ICombinationUtil";
import {IBindingIdentifier} from "../model/interface/IBindingIdentifier";

export class ValueResolvedGetter implements IValueResolvedGetter {
	private static readonly FUNCTION_OUTER_SCOPE_NAME: string = "__outer__";

	constructor (private languageService: ICodeAnalyzer,
							 private marshaller: IMarshaller,
							 private tracer: ITracer,
							 private identifierSerializer: IIdentifierSerializer,
							 private tokenPredicator: ITokenPredicator,
							 private combinationUtil: ICombinationUtil) {
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

		let [setup, flattened, options] = this.flattenValueExpression(valueable.expression, from, scope, insideThisScope);
		let computed: ArbitraryValue = flattened;

		if (process.env.npm_config_debug) console.log("flattened:", flattened);

		if (options.shouldCompute) {
			computed = this.attemptComputation(setup, flattened);
		}

		if (process.env.npm_config_debug) console.log("computed:", computed);
		const takenResult = takeKey == null || computed == null ? computed : computed[<keyof NonNullableArbitraryValue>takeKey];

		valueable.resolving = false;
		return [takenResult, flattened];
	}

	private attemptComputationLongListStrategy (setup: string[][], flattened: string, position: number = 0): ArbitraryValue {
		let highest = 0;
		setup.forEach(declaration => {
			declaration.forEach((_, index) => {
				if (index > highest) highest = index;
			});
		});
		const joinedSetup = setup.map(declaration => declaration[position > declaration.length ? declaration.length - 1 : position]).join("\n");
		if (position > highest) throw TypeError(`A computation failed for:\n${joinedSetup}${flattened}`);
		try {
			return this.computeValueResolved(joinedSetup, flattened);
		} catch (ex) {
			return this.attemptComputationLongListStrategy(setup, flattened, position + 1);
		}
	}

	private attemptComputationShortListStrategy (setup: string[][], flattened: string): ArbitraryValue {
		// This is a VERY time consuming operation if there are many possible combinations, even though it is elegant.
		const combinations = this.combinationUtil.getPossibleCombinationsOfMultiDimensionalArray(setup);
		if (combinations.length === 0) return this.computeValueResolved("", flattened);

		for (const combination of (combinations || setup)) {
			const joined = combination.join("\n");
			try {
				return this.computeValueResolved(joined, flattened);
			} catch (ex) {
			}
		}
		throw TypeError(`A computation failed for:\n${setup}${flattened}`);
	}

	private attemptComputation (setup: string[][], flattened: string): ArbitraryValue {
		const consistentSetup = setup.length > 0 ? setup : [[""]];
		let count = 0;
		const limit = 30;
		setup.map(declaration => declaration.forEach(() => count++));
		return count >= limit ? this.attemptComputationLongListStrategy(consistentSetup, flattened) : this.attemptComputationShortListStrategy(consistentSetup, flattened);
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

	private flattenBoundPart (part: BindingIdentifier, from: Statement|Expression|Node, scope: string|null, insideComputedThisScope: boolean = false, expression: ArbitraryValue[], index: number, options: IFlattenOptions, substitution = this.tracer.traceIdentifier(part.name, from, scope)): string[] {

		const isRecursive = part.name === scope;

		let variations: string[] = [];
		const name = this.normalizeBindingIdentifierName(part, insideComputedThisScope);

		if (isILiteralValue(substitution)) {
			const versions = this.identifierSerializer.serializeILiteralValue(substitution);
			variations = versions.map(version => `var ${name} = (${part.name} === undefined ? ${version} : ${part.name});`);
		}

		else if (isICallExpression(substitution) && substitution.identifier === "require") {

			const imports = this.languageService.getImportDeclarationsForFile(substitution.filePath, true);
			const firstArgument = substitution.arguments.argumentsList[0];
			const requirePath = firstArgument.value.hasDoneFirstResolve() ? firstArgument.value.resolved : firstArgument.value.resolve();
			const importMatch = imports.find(importDeclaration => !(importDeclaration.source instanceof BindingIdentifier) && (importDeclaration.source.relativePath === requirePath || importDeclaration.source.fullPath === requirePath));
			if (importMatch != null) {
				const properBinding = importMatch.bindings[NAMESPACE_NAME];
				if (properBinding != null) {
					const intermediates = this.flattenBoundPart(properBinding, from, scope, insideComputedThisScope, expression, index, options);
					const requireShim = `\nvar require = () => ${NAMESPACE_NAME}\n`;
					return intermediates.map(intermediate => `${intermediate}${requireShim}`);
				}
			}
		}

		else if (isIParameter(substitution)) {
			const versions = this.identifierSerializer.serializeIParameter(substitution);
			variations = versions.map(version => `var ${name} = (${part.name} === undefined ? ${version} : ${part.name});`);
			options.shouldCompute = false;
			options.forceNoQuoting = true;
		}

		else if (isIVariableAssignment(substitution)) {
			const versions = this.identifierSerializer.serializeIVariableAssignment(substitution);
			variations = versions.map(version => `var ${name} = (${part.name} === undefined ? ${version} : ${part.name});`);
		}

		else if (isIClassDeclaration(substitution)) {
			const versions = this.identifierSerializer.serializeIClassDeclaration(substitution);
			const variableName = part.name === "super" ? substitution.name : name;
			if (part.name === "super") options.shouldCompute = false;
			variations = versions.map(version => `var ${variableName} = (${variableName} === undefined ? ${part.name === "this" ? "new" : ""} ${version} : ${variableName});`);
		}

		else if (isIEnumDeclaration(substitution)) {
			const versions = this.identifierSerializer.serializeIEnumDeclaration(substitution);
			variations = versions.map(version => `var ${name} = (${part.name} === undefined ? ${version} : ${part.name});`);
		}

		else if (isIFunctionDeclaration(substitution)) {
			if (isRecursive) {
				variations = [`${ValueResolvedGetter.FUNCTION_OUTER_SCOPE_NAME};`];
			}
			else {
				const versions = this.identifierSerializer.serializeIFunctionDeclaration(substitution);
				variations = versions.map(version => `var ${name} = (${part.name} === undefined ? ${`(${version})`} : ${part.name});`);
			}
		}

		else {
			// The identifier could not be found. Assume that it is part of the environment.
			variations = []; // [`${part.name};`];
			if (process.env.npm_config_debug) console.log(`Assuming that '${part.name}' is part of the global environment...`);
			// throw new TypeError(`${this.flattenValueExpression.name} could not flatten a substitution for identifier: ${part.name} in scope: ${scope}`);
		}

		return variations;
	}

	private flattenValueExpression (valueExpression: InitializationValue, from: Statement|Expression|Node, scope: string|null, insideComputedThisScope: boolean = false): [string[][], string, IFlattenOptions] {
		let val: string = "";
		let setup: string[][] = [];

		const options: IFlattenOptions = {
			shouldCompute: true,
			forceNoQuoting: false
		};

		valueExpression.forEach((part, index) => {
			if (part instanceof BindingIdentifier) {

				const setupVariations = this.flattenBoundPart(part, from, scope, insideComputedThisScope, valueExpression, index, options);
				setup.push(setupVariations);
				val += this.normalizeBindingIdentifierName(part, insideComputedThisScope);
			} else {
				if (part === "const" || part === "var" || part === "let") return;
				if (part === GlobalObject) val += GlobalObjectIdentifier;
				else if (this.tokenPredicator.isTokenLike(part)) val += <string>part;
				else val += this.marshaller.marshal<ArbitraryValue, string>(part, "");
			}
		});
		return [setup, val, options];
	}

	private normalizeBindingIdentifierName (name: IBindingIdentifier, insideComputedThisScope: boolean): string {
		return name.name === "this" && !insideComputedThisScope
			? "that"
			: name.name === "super" && !insideComputedThisScope ? "_super" : name.name;
	}

}