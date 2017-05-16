import {IMarshaller} from "@wessberg/marshaller";
import {isIClassDeclaration, isIEnumDeclaration, isIExportableIIdentifier, isIFunctionDeclaration, isIImportExportBinding, isIVariableAssignment, isNamespacedModuleMap} from "../predicate/PredicateFunctions";
import {ArbitraryValue, IClassDeclaration, IEnumDeclaration, IFunctionDeclaration, ImportExportBindingPayload, IParameter, IParametersBody, IVariableAssignment, NamespacedModuleMap, ResolvedNamespacedModuleMap} from "../service/interface/ICodeAnalyzer";
import {IStringUtil} from "../util/interface/IStringUtil";
import {IIdentifierSerializer} from "./interface/IIdentifierSerializer";

export class IdentifierSerializer implements IIdentifierSerializer {
	private static readonly FUNCTION_OUTER_SCOPE_NAME: string = "__outer__";

	constructor (private marshaller: IMarshaller,
							 private stringUtil: IStringUtil) {
	}

	public serializeIParameter (parameter: IParameter): string {
		const flattened = parameter.value.expression == null ? "undefined" : parameter.value.hasDoneFirstResolve()
			? parameter.value.resolved
			: parameter.value.resolve();
		return <string>this.marshaller.marshal<ArbitraryValue, string>(flattened, "");
	}

	public serializeIVariableAssignment (variableAssignment: IVariableAssignment): string {
		const flattened = variableAssignment.value.expression == null ? "undefined" : variableAssignment.value.hasDoneFirstResolve()
			? variableAssignment.value.resolved
			: variableAssignment.value.resolve();
		return <string>this.marshaller.marshal<ArbitraryValue, string>(flattened, "");
	}

	public serializeIImportExportBinding (payload: ImportExportBindingPayload): string {
		if (isIImportExportBinding(payload)) return this.serializeIImportExportBinding(payload.payload);
		if (isNamespacedModuleMap(payload)) return this.serializeNamespacedModuleMap(payload);
		if (!isIExportableIIdentifier(payload)) return <string>this.marshaller.marshal<ArbitraryValue, string>(payload, "");
		if (isIClassDeclaration(payload)) return this.serializeIClassDeclaration(payload, false);
		if (isIVariableAssignment(payload)) return this.serializeIVariableAssignment(payload);
		if (isIEnumDeclaration(payload)) return this.serializeIEnumDeclaration(payload);
		if (isIFunctionDeclaration(payload)) return this.serializeIFunctionDeclaration(payload);
		return <string>this.marshaller.marshal<ArbitraryValue, string>(payload, "");
	}

	public serializeNamespacedModuleMap (map: NamespacedModuleMap): string {
		const newMap: ResolvedNamespacedModuleMap = {};
		Object.keys(map).forEach(key => {
			const value = map[key];
			newMap[key] = this.serializeIImportExportBinding(value);
		});
		return <string>this.marshaller.marshal<ArbitraryValue, string>(newMap, "");
	}

	public serializeIClassDeclaration (classDeclaration: IClassDeclaration, statics: boolean): string {

		const map: { [key: string]: string|null|undefined } = {};

		for (const propKey of Object.keys(classDeclaration.props)) {
			if (statics && !classDeclaration.props[propKey].isStatic) continue;
			if (!statics && classDeclaration.props[propKey].isStatic) continue;

			const value = classDeclaration.props[propKey].value;
			map[propKey] = value.hasDoneFirstResolve() ? value.resolved : value.resolve();
		}

		for (const methodKey of Object.keys(classDeclaration.methods)) {
			if (statics && !classDeclaration.methods[methodKey].isStatic) continue;
			if (!statics && classDeclaration.methods[methodKey].isStatic) continue;

			const method = classDeclaration.methods[methodKey];
			const value = method.value;

			const returnsContent = method.returnStatement.startsAt >= 0;
			let resolvedValue = value.hasDoneFirstResolve() ? value.resolved : value.resolve(true);

			const type = this.marshaller.getTypeOf(this.marshaller.marshal(resolvedValue)) === "string";
			const hasReturnKeyword = method.returnStatement != null && method.returnStatement.contents != null && resolvedValue != null && resolvedValue.includes("return");

			if (type && resolvedValue != null && !hasReturnKeyword) {
				resolvedValue = <string>this.stringUtil.quoteIfNecessary(resolvedValue);
			}

			const bracketed = hasReturnKeyword ? `{${resolvedValue}}` : returnsContent ? `{return ${resolvedValue}}` : `${resolvedValue}`;

			const parameters = this.serializeIParameterBody(method.parameters);

			map[methodKey] = `(function ${IdentifierSerializer.FUNCTION_OUTER_SCOPE_NAME}(${parameters}) ${bracketed})`;
			console.log(bracketed);
		}

		return <string>this.marshaller.marshal<ArbitraryValue, string>(map, "");

	}

	public serializeIEnumDeclaration (enumDeclaration: IEnumDeclaration): string {
		return <string>this.marshaller.marshal<ArbitraryValue, string>(enumDeclaration.members, "");
	}

	public serializeIParameterBody (parameterBody: IParametersBody): string {
		let str = "";
		parameterBody.parametersList.forEach((parameter, index) => {
			str += parameter.name;

			if (parameter.value != null && parameter.value.expression != null) {
				const resolvedValue = parameter.value.hasDoneFirstResolve() ? parameter.value.resolved : parameter.value.resolve();
				str += `=${resolvedValue}`;
			}
			if (index !== parameterBody.parametersList.length - 1) str += ",";
		});
		return str;
	}

	public serializeIFunctionDeclaration (functionDeclaration: IFunctionDeclaration): string {
		let flattened = functionDeclaration.value.expression == null ? "undefined" : functionDeclaration.value.hasDoneFirstResolve()
			? functionDeclaration.value.resolved
			: functionDeclaration.value.resolve();

		if (this.marshaller.getTypeOf(this.marshaller.marshal(flattened)) === "string" && flattened != null && !(flattened.trim().startsWith("return"))) flattened = <string>this.stringUtil.quoteIfNecessary(flattened);
		return <string>this.marshaller.marshal<ArbitraryValue, string>(flattened, "");
	}
}