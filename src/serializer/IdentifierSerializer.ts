import {SyntaxKind} from "typescript";
import {IMarshaller} from "@wessberg/marshaller";
import {ArbitraryValue, IClassDeclaration, ICodeAnalyzer, IdentifierMapKind, IEnumDeclaration, IFunctionDeclaration, IIdentifier, ILiteralValue, IParameter, IParametersBody, IVariableAssignment, NamespacedModuleMap, ParameterKind, ResolvedNamespacedModuleMap} from "../service/interface/ICodeAnalyzer";
import {IStringUtil} from "../util/interface/IStringUtil";
import {IIdentifierSerializer, SerializedReplacements, SerializedVersions} from "./interface/IIdentifierSerializer";
import {ICache} from "../cache/interface/ICache";
import {ICombinationUtil} from "../util/interface/ICombinationUtil";
import {isIClassDeclaration, isIEnumDeclaration, isIFunctionDeclaration, isIIdentifier, isILiteralValue, isIParameter, isIVariableAssignment, isNamespacedModuleMap} from "../predicate/PredicateFunctions";

export class IdentifierSerializer implements IIdentifierSerializer {

	constructor (private languageService: ICodeAnalyzer,
							 private cache: ICache,
							 private combinationUtil: ICombinationUtil,
							 private marshaller: IMarshaller,
							 private stringUtil: IStringUtil) {
	}

	public serializeIParameter (parameter: IParameter): SerializedVersions {
		const cached = this.cache.getCachedSerializedParameter(parameter);
		if (cached != null && !this.cache.cachedSerializedParameterNeedsUpdate(parameter)) return cached.content;

		const flattened = parameter.value.expression == null ? "undefined" : parameter.value.hasDoneFirstResolve()
			? parameter.value.resolved
			: parameter.value.resolve();

		// TODO: Remove the 'quoteIfNecessary' part?
		const value = <string>this.stringUtil.quoteIfNecessary(this.marshaller.marshal<ArbitraryValue, string>(flattened, ""));

		const versions = [value, `\`${value}\``];
		this.cache.setCachedSerializedParameter(parameter, versions);
		return versions;
	}

	public serializeIVariableAssignment (variableAssignment: IVariableAssignment): SerializedVersions {
		const cached = this.cache.getCachedSerializedVariable(variableAssignment);
		if (cached != null && !this.cache.cachedSerializedVariableNeedsUpdate(variableAssignment)) return cached.content;

		const flattened = variableAssignment.value.expression == null ? "undefined" : variableAssignment.value.hasDoneFirstResolve()
			? variableAssignment.value.resolved
			: variableAssignment.value.resolve();

		const value = <string>this.marshaller.marshal<ArbitraryValue, string>(flattened, "");
		const versions = [value, `\`${value}\``];
		this.cache.setCachedSerializedVariable(variableAssignment, versions);
		return versions;
	}

	public serializeIIdentifier (value: IIdentifier): SerializedVersions {
		if (isILiteralValue(value)) return this.serializeILiteralValue(value);
		if (isIParameter(value)) return this.serializeIParameter(value);
		if (isNamespacedModuleMap(value)) return this.serializeNamespacedModuleMap(value);
		if (isIClassDeclaration(value)) return this.serializeIClassDeclaration(value);
		if (isIVariableAssignment(value)) return this.serializeIVariableAssignment(value);
		if (isIEnumDeclaration(value)) return this.serializeIEnumDeclaration(value);
		if (isIFunctionDeclaration(value)) return this.serializeIFunctionDeclaration(value);

		throw new TypeError(`${this.constructor.name} could not serialize an identifier of kind ${IdentifierMapKind[value.___kind]}`);
	}

	public serialize (value: IIdentifier|ArbitraryValue): SerializedVersions {
		if (isIIdentifier(value)) return this.serializeIIdentifier(value);
		if (isNamespacedModuleMap(value)) return this.serializeNamespacedModuleMap(value);
		return this.serializeArbitrary(value);
	}

	public serializeILiteralValue (literal: ILiteralValue): SerializedVersions {
		const value = literal.value();
		if (isILiteralValue(value)) return this.serializeILiteralValue(value);
		if (isNamespacedModuleMap(value)) return this.serializeNamespacedModuleMap(value);
		else if (isIIdentifier(value)) return this.serializeIIdentifier(value);

		return this.serializeArbitrary(value);
	}

	public serializeArbitrary (value: ArbitraryValue): SerializedVersions {
		const val = <string>this.stringUtil.quoteIfNecessary(this.marshaller.marshal<ArbitraryValue, string>(value, ""));
		return [val, `\`${val}\``];
	}

	public serializeNamespacedModuleMap (map: NamespacedModuleMap): SerializedVersions {
		const newMap: ResolvedNamespacedModuleMap = {};
		const keys = Object.keys(map);

		// TODO: Combine all deep combinations of keys and their versions. The math is just so hard that I gave up for now.
		keys.forEach(key => {
			const value = map[key];
			const [firstVersion] = this.serializeIIdentifier(value);
			newMap[key] = firstVersion;
		});

		const value = <string>this.marshaller.marshal<ArbitraryValue, string>(newMap, "");
		return [value];
	}

	public serializeIClassDeclaration (classDeclaration: IClassDeclaration): SerializedVersions {
		const cached = this.cache.getCachedSerializedClass(classDeclaration);
		if (cached != null && !this.cache.cachedSerializedClassNeedsUpdate(classDeclaration)) return cached.content;
		const parent = classDeclaration.heritage == null || classDeclaration.heritage.extendsClass == null ? null : classDeclaration.heritage.extendsClass.resolve();

		let str = "";
		if (parent != null) str += this.serializeIClassDeclaration(parent);
		str += `class ${classDeclaration.name}`;

		const replacements: SerializedReplacements = {};

		if (classDeclaration.heritage != null && classDeclaration.heritage.extendsClass != null) {
			str += ` extends ${classDeclaration.heritage.extendsClass.name}`;
		}
		str += "{\n";

		const ctor = classDeclaration.constructor;
		if (ctor != null) {

			str += "constructor(";
			const [parameters] = this.serializeIParameterBody(ctor.parameters);
			str += parameters;
			str += ") {";

			const value = ctor.value;

			const resolvedConstructorBody = value.hasDoneFirstResolve() ? value.resolved : value.resolve(true);
			if (resolvedConstructorBody != null) {

				// If the method had a return statement before, but doesn't anymore after it has been resolved, re-add a return statement.
				replacements[<string>"constructor"] = <string>this.marshaller.marshal(resolvedConstructorBody, "");
				str += this.addPlaceholder("constructor");
			}

			str += "}\n";
		}

		for (const propKey of Object.keys(classDeclaration.props)) {
			const prop = classDeclaration.props[propKey];
			const value = prop.value;
			const resolvedProp = this.stringUtil.quoteIfNecessary(value.hasDoneFirstResolve() ? value.resolved : value.resolve(true));

			// Add a getter.
			if (prop.modifiers.has("static")) {
				str += " static";
			}

			str += ` get ${prop.name} () {`;
			const hasReturnStatement = resolvedProp == null ? false : this.languageService.statementsIncludeKind(this.languageService.toAST(resolvedProp.toString()), SyntaxKind.ReturnStatement, true);

			replacements[prop.name] = <string>this.marshaller.marshal(resolvedProp, "");

			str += hasReturnStatement ? `${this.addPlaceholder(prop.name)}` : `if (this._${prop.name} === undefined) {this._${prop.name} = ${this.addPlaceholder(prop.name)};} return this._${prop.name};`;
			str += "}\n";

			// Add a setter
			if (prop.modifiers.has("static")) {
				str += " static";
			}
			str += ` set ${prop.name} (val) {this._${prop.name} = val;}\n`;
		}

		for (const methodKey of Object.keys(classDeclaration.methods)) {

			const method = classDeclaration.methods[methodKey];
			const value = method.value;

			if (method.modifiers.has("static")) {
				str += " static";
			}

			if (method.modifiers.has("async")) {
				str += " async";
			}

			str += ` ${method.name}`;
			str += "(";
			// TODO: Also factor these into the combinations
			const [serialized] = this.serializeIParameterBody(method.parameters);
			str += serialized;
			str += ") {";
			const resolvedMethodBody = value.hasDoneFirstResolve() ? value.resolved : value.resolve(true);
			if (resolvedMethodBody != null) {
				const ast = this.languageService.toAST(resolvedMethodBody.toString());
				const hasReturnStatement = this.languageService.statementsIncludeKind(ast, SyntaxKind.ReturnStatement, true);

				replacements[method.name] = <string>this.marshaller.marshal(resolvedMethodBody, "");

				// If the method had a return statement before, but doesn't anymore after it has been resolved, re-add a return statement.
				str += !hasReturnStatement && method.returnStatement.startsAt >= 0 ? `return (${this.addPlaceholder(method.name)})` : `${this.addPlaceholder(method.name)}`;
			}
			str += "}\n\n";
		}

		str += "}";

		const versions = this.exchangeReplacements(str, replacements);
		this.cache.setCachedSerializedClass(classDeclaration, versions);
		return versions;

	}
	public serializeIEnumDeclaration (enumDeclaration: IEnumDeclaration): SerializedVersions {
		const cached = this.cache.getCachedSerializedEnum(enumDeclaration);
		if (cached != null && !this.cache.cachedSerializedEnumNeedsUpdate(enumDeclaration)) return cached.content;

		const value = <string>this.marshaller.marshal<ArbitraryValue, string>(enumDeclaration.members, "");
		const versions = [value];

		this.cache.setCachedSerializedEnum(enumDeclaration, versions);
		return versions;
	}

	public serializeIParameterBody (parameterBody: IParametersBody): SerializedVersions {
		let str = "";
		const replacements: SerializedReplacements = {};

		parameterBody.parametersList.forEach((parameter, index) => {
			let serializedName: string = "";
			if (parameter.parameterKind === ParameterKind.STANDARD) {
				serializedName = <string>parameter.name[0];
			}
			else if (parameter.parameterKind === ParameterKind.OBJECT_BINDING) {
				serializedName = `{${parameter.name.join(",")}}`;
			}
			else if (parameter.parameterKind === ParameterKind.ARRAY_BINDING) {
				serializedName = `[${parameter.name.join(",")}]`;
			}

			str += serializedName;

			// TODO: Remove 'quoteIfNecessary'?
			const parameterInitializationValue = <string>this.stringUtil.quoteIfNecessary(parameter.value.hasDoneFirstResolve() ? parameter.value.resolved : parameter.value.resolve(true));
			if (parameterInitializationValue != null) {
				str += ` = `;

				replacements[serializedName] = parameterInitializationValue;
				str += this.addPlaceholder(serializedName);
			}
			if (index !== parameterBody.parametersList.length - 1) str += ", ";
		});

		return this.exchangeReplacements(str, replacements);
	}
	public serializeIFunctionDeclaration (functionDeclaration: IFunctionDeclaration): SerializedVersions {
		const cached = this.cache.getCachedSerializedFunction(functionDeclaration);
		if (cached != null && !this.cache.cachedSerializedFunctionNeedsUpdate(functionDeclaration)) return cached.content;

		let flattened = functionDeclaration.value.expression == null ? undefined : functionDeclaration.value.hasDoneFirstResolve()
			? functionDeclaration.value.resolved
			: functionDeclaration.value.resolve();

		const replacements: SerializedReplacements = {};
		let str = `function ${functionDeclaration.name}(`;

		// TODO: Remove 'quoteIfNecessary'?
		const value = <string>this.stringUtil.quoteIfNecessary(<string>this.marshaller.marshal<ArbitraryValue, string>(flattened, ""));

		// TODO: Also factor these into the combinations
		const [parameters] = this.serializeIParameterBody(functionDeclaration.parameters);
		str += parameters;
		str += ") {";
		const hasReturnStatement = value == null ? false : this.languageService.statementsIncludeKind(this.languageService.toAST(value.toString()), SyntaxKind.ReturnStatement, true);
		replacements[functionDeclaration.name] = value;
		str += hasReturnStatement ? this.addPlaceholder(functionDeclaration.name) : `return (${this.addPlaceholder(functionDeclaration.name)})`;
		str += "}";

		const versions = this.exchangeReplacements(str, replacements);
		this.cache.setCachedSerializedFunction(functionDeclaration, versions);
		return versions;
	}

	private addPlaceholder (identifier: string): string {
		const wrapSpacing = "__________";
		const uniqueName = "serializeReplacement";
		return `${wrapSpacing}${uniqueName}${wrapSpacing}${identifier}${wrapSpacing}`;
	}

	private replacePlaceholder (identifier: string, inString: string, replacements: SerializedReplacements, quoted: boolean): string {
		return inString.replace(new RegExp(this.addPlaceholder(identifier), "g"), quoted ? `\`${replacements[identifier]}\`` : replacements[identifier]);
	};

	private exchangeReplacements (str: string, replacements: SerializedReplacements): SerializedVersions {
		// Setup replacements
		const keys = Object.keys(replacements);
		const versions: string[] = [];

		// Create the base version
		let baseString: string = `${str}`;
		keys.forEach(key => baseString = this.replacePlaceholder(key, baseString, replacements, false));
		versions.push(baseString);

		// Create the variations.
		const combinations = this.combinationsFromKeys(keys);
		combinations.forEach(combination => {
			let variation: string = `${str}`;
			keys.forEach((key, index) => variation = this.replacePlaceholder(key, variation, replacements, combination.includes(index)));
			versions.push(variation);
		});
		return versions;
	}

	private combinationsFromKeys (keys: string[]): number[][] {
		const indexes = keys.map((_, index) => index);
		return this.combinationUtil.allCombinations(indexes);
	}
}