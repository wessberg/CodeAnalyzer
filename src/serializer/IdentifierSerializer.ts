import {IIdentifierSerializer} from "./interface/IIdentifierSerializer";
import {IFunctionDeclaration, IParametersBody, IEnumDeclaration, IClassDeclaration, IVariableAssignment, IParameter, ArbitraryValue} from "../service/interface/ISimpleLanguageService";
import {IMarshaller} from "@wessberg/marshaller";
import {IStringUtil} from "../util/interface/IStringUtil";

export class IdentifierSerializer implements IIdentifierSerializer {
	private static readonly FUNCTION_OUTER_SCOPE_NAME: string = "__outer__";

	constructor (private marshaller: IMarshaller,
							 private stringUtil: IStringUtil) {}

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

	public serializeIClassDeclaration (classDeclaration: IClassDeclaration, statics: boolean, identifier: string, scope: string | null): string {
		const map: { [key: string]: string | null | undefined } = {};

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

			const hasReturnStatement = method.returnStatement.startsAt >= 0;
			let resolvedValue = value.hasDoneFirstResolve() ? value.resolved : value.resolve();

			// We have a self-reference here. Since 'this' refers to the mapped object, we just need to return "this".
			if (identifier === "this" && scope === classDeclaration.name) return "this";

			if (this.marshaller.getTypeOf(this.marshaller.marshal(resolvedValue)) === "string" && resolvedValue != null && !(resolvedValue.trim().startsWith("return"))) resolvedValue = <string>this.stringUtil.quoteIfNecessary(resolvedValue);

			const startsWithReturn = hasReturnStatement && resolvedValue != null && resolvedValue.trim().startsWith("return");
			const bracketed = hasReturnStatement ? `{${startsWithReturn ? "" : "return"} ${resolvedValue}}` : resolvedValue;

			const parameters = this.serializeIParameterBody(method.parameters);

			map[methodKey] = `(function ${IdentifierSerializer.FUNCTION_OUTER_SCOPE_NAME}(${parameters}) ${bracketed})`;
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