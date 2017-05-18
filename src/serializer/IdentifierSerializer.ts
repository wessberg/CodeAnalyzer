import {SyntaxKind} from "typescript";
import {IMarshaller} from "@wessberg/marshaller";
import {isIClassDeclaration, isIEnumDeclaration, isIExportableIIdentifier, isIFunctionDeclaration, isIImportExportBinding, isIVariableAssignment, isNamespacedModuleMap} from "../predicate/PredicateFunctions";
import {ArbitraryValue, IClassDeclaration, ICodeAnalyzer, IEnumDeclaration, IFunctionDeclaration, ImportExportBindingPayload, IParameter, IParametersBody, IVariableAssignment, NamespacedModuleMap, ParameterKind, ResolvedNamespacedModuleMap} from "../service/interface/ICodeAnalyzer";
import {IStringUtil} from "../util/interface/IStringUtil";
import {IIdentifierSerializer, ReplacementPositions} from "./interface/IIdentifierSerializer";

export class IdentifierSerializer implements IIdentifierSerializer {
	// private static readonly FUNCTION_OUTER_SCOPE_NAME: string = "__outer__";

	constructor (private languageService: ICodeAnalyzer,
							 private marshaller: IMarshaller,
							 private stringUtil: IStringUtil) {
	}

	public serializeIParameter (parameter: IParameter): [string, ReplacementPositions] {
		const flattened = parameter.value.expression == null ? "undefined" : parameter.value.hasDoneFirstResolve()
			? parameter.value.resolved
			: parameter.value.resolve();

		const replacementPositions: ReplacementPositions = {};
		const value = <string>this.stringUtil.quoteIfNecessary(this.marshaller.marshal<ArbitraryValue, string>(flattened, ""));
		parameter.name.forEach(key => {
			if (key != null) {
				replacementPositions[key] = [0, value.length];
			}
		});
		return [value, replacementPositions];
	}

	public serializeIVariableAssignment (variableAssignment: IVariableAssignment): [string, ReplacementPositions] {
		const flattened = variableAssignment.value.expression == null ? "undefined" : variableAssignment.value.hasDoneFirstResolve()
			? variableAssignment.value.resolved
			: variableAssignment.value.resolve();

		const replacementPositions: ReplacementPositions = {};
		const value = <string>this.marshaller.marshal<ArbitraryValue, string>(flattened, "");
		replacementPositions[variableAssignment.name] = [0, value.length];
		return [value, replacementPositions];
	}

	public serializeIImportExportBinding (payload: ImportExportBindingPayload): [string, ReplacementPositions] {
		if (isIImportExportBinding(payload)) return this.serializeIImportExportBinding(payload.payload);
		if (isNamespacedModuleMap(payload)) return this.serializeNamespacedModuleMap(payload);
		if (!isIExportableIIdentifier(payload)) {

			const replacementPositions: ReplacementPositions = {};
			const value = <string>this.stringUtil.quoteIfNecessary(this.marshaller.marshal<ArbitraryValue, string>(payload, ""));
			replacementPositions[0] = [0, value.length];
			return [value, replacementPositions];
		}

		if (isIClassDeclaration(payload)) return this.serializeIClassDeclaration(payload);
		if (isIVariableAssignment(payload)) return this.serializeIVariableAssignment(payload);
		if (isIEnumDeclaration(payload)) return this.serializeIEnumDeclaration(payload);
		if (isIFunctionDeclaration(payload)) return this.serializeIFunctionDeclaration(payload);

		const replacementPositions: ReplacementPositions = {};
		const value = <string>this.stringUtil.quoteIfNecessary(this.marshaller.marshal<ArbitraryValue, string>(payload, ""));
		replacementPositions[0] = [0, value.length];
		return [value, replacementPositions];
	}

	public serializeNamespacedModuleMap (map: NamespacedModuleMap): [string, ReplacementPositions] {
		const newMap: ResolvedNamespacedModuleMap = {};
		Object.keys(map).forEach(key => {
			const value = map[key];
			const [serialized] = this.serializeIImportExportBinding(value);
			newMap[key] = serialized;
		});

		const replacementPositions: ReplacementPositions = {};
		const value = <string>this.marshaller.marshal<ArbitraryValue, string>(newMap, "");

		let cursor = 0;
		Object.keys(newMap).forEach(key => {
			const val = newMap[key];
			const index = value.indexOf(val, cursor);
			replacementPositions[key] = [index, index + val.length];
			cursor = index;
		});

		return [value, replacementPositions];
	}

	public serializeIClassDeclaration (classDeclaration: IClassDeclaration): [string, ReplacementPositions] {

		let str = `class ${classDeclaration.name}`;
		if (classDeclaration.heritage != null && classDeclaration.heritage.extendsClass != null) {
			str += ` extends ${classDeclaration.heritage.extendsClass.name}`;
		}
		str += "{\n";
		const replacementPositions: { [key: string]: [number, number] } = {};
		let offset = 0;

		const ctor = classDeclaration.constructor;
		if (ctor != null) {

			str += "constructor(";
			const [parameters] = this.serializeIParameterBody(ctor.parameters);
			str += parameters;
			str += ") {";

			const value = ctor.value;

			const resolvedConstructorBody = value.hasDoneFirstResolve() ? value.resolved : value.resolve(true);
			if (resolvedConstructorBody != null) {
				offset = str.length;
				const marshalled = <string>this.marshaller.marshal(resolvedConstructorBody, "");

				// If the method had a return statement before, but doesn't anymore after it has been resolved, re-add a return statement.
				str += marshalled;
				const index = str.indexOf(marshalled, offset);
				replacementPositions[ctor.name] = [index, index + marshalled.length];
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
			const marshalled = <string>this.marshaller.marshal(resolvedProp, "");

			offset = str.length;
			str += hasReturnStatement ? `${marshalled}` : `if (this._${prop.name} === undefined) {this._${prop.name} = ${marshalled};} return this._${prop.name};`;
			str += "}\n";
			const index = str.indexOf(marshalled, offset);
			replacementPositions[propKey] = [index, index + marshalled.length];

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
			const [serialized] = this.serializeIParameterBody(method.parameters);
			str += serialized;
			str += ") {";
			const resolvedMethodBody = value.hasDoneFirstResolve() ? value.resolved : value.resolve(true);
			if (resolvedMethodBody != null) {
				offset = str.length;
				const ast = this.languageService.toAST(resolvedMethodBody.toString());
				const hasReturnStatement = this.languageService.statementsIncludeKind(ast, SyntaxKind.ReturnStatement, true);

				const marshalled = <string>this.marshaller.marshal(resolvedMethodBody, "");
				// If the method had a return statement before, but doesn't anymore after it has been resolved, re-add a return statement.
				str += !hasReturnStatement && method.returnStatement.startsAt >= 0 ? `return (${marshalled})` : `${marshalled}`;
				const index = str.indexOf(marshalled, offset);
				replacementPositions[methodKey] = [index, index + marshalled.length];
			}
			str += "}\n\n";
		}

		str += "}";
		return [str, replacementPositions];

	}

	public serializeIEnumDeclaration (enumDeclaration: IEnumDeclaration): [string, ReplacementPositions] {

		const replacementPositions: ReplacementPositions = {};
		const value = <string>this.marshaller.marshal<ArbitraryValue, string>(enumDeclaration.members, "");
		replacementPositions[enumDeclaration.name] = [0, value.length];
		return [value, replacementPositions];
	}

	public serializeIParameterBody (parameterBody: IParametersBody): [string, ReplacementPositions] {
		let str = "";
		const replacementPositions: ReplacementPositions = {};

		let offset = 0;
		parameterBody.parametersList.forEach((parameter, index) => {
			if (parameter.parameterKind === ParameterKind.STANDARD) {
				str += parameter.name[0];
			}
			else if (parameter.parameterKind === ParameterKind.OBJECT_BINDING) {
				str += `{${parameter.name.join(",")}}`;
			}
			else if (parameter.parameterKind === ParameterKind.ARRAY_BINDING) {
				str += `[${parameter.name.join(",")}]`;
			}
			const parameterInitializationValue = <string>this.stringUtil.quoteIfNecessary(parameter.value.hasDoneFirstResolve() ? parameter.value.resolved : parameter.value.resolve(true));
			if (parameterInitializationValue != null) {
				str += ` = ${parameterInitializationValue}`;

				parameter.name.forEach(part => {
					if (part != null) {
						const index = str.indexOf(parameterInitializationValue, offset);
						replacementPositions[part] = [index, index + parameterInitializationValue.length];
						offset = index;
					}
				});
			}
			if (index !== parameterBody.parametersList.length - 1) str += ", ";
		});
		return [str, replacementPositions];
	}

	public serializeIFunctionDeclaration (functionDeclaration: IFunctionDeclaration): [string, ReplacementPositions] {
		let flattened = functionDeclaration.value.expression == null ? undefined : functionDeclaration.value.hasDoneFirstResolve()
			? functionDeclaration.value.resolved
			: functionDeclaration.value.resolve();

		const replacementPositions: ReplacementPositions = {};
		const value = <string>this.stringUtil.quoteIfNecessary(<string>this.marshaller.marshal<ArbitraryValue, string>(flattened, ""));
		replacementPositions[functionDeclaration.name] = [0, value.length];
		return [value, replacementPositions];
	}
}