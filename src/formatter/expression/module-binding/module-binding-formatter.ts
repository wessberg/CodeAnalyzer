import {IModuleBindingFormatter} from "./i-module-binding-formatter";
import {ExportSpecifier, Identifier, ImportSpecifier, isIdentifier, isNamespaceExportDeclaration, isNamespaceImport, NamespaceExportDeclaration, NamespaceImport} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {FormattedExpressionKind, FormattedModuleBinding, ModuleBindingKind} from "@wessberg/type";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";

/**
 * A class that can format FormattedModuleBindings
 */
export class ModuleBindingFormatter extends FormattedExpressionFormatter implements IModuleBindingFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the given PropertyName into a FormattedPropertyName
	 * @param {PropertyName} expression
	 * @returns {FormattedPropertyName}
	 */
	public format (expression: NamespaceImport|NamespaceExportDeclaration|ImportSpecifier|ExportSpecifier|Identifier): FormattedModuleBinding {

		const base = {
			...super.format(expression)
		};

		let result: FormattedModuleBinding;

		// If it is an identifier, we have to do with a default import/export
		if (isIdentifier(expression)) {
			result = {
				...base,
				kind: ModuleBindingKind.DEFAULT,
				expressionKind: FormattedExpressionKind.MODULE_BINDING,
				name: this.astUtil.takeName(expression)
			};
		}

		// We have to do with a namespace import/export (such as 'import * as Foo from ""')
		else if (isNamespaceImport(expression) || isNamespaceExportDeclaration(expression)) {
			result = {
				...base,
				kind: ModuleBindingKind.NAMESPACE,
				expressionKind: FormattedExpressionKind.MODULE_BINDING,
				name: this.astUtil.takeName(expression.name)
			};
		}

		// We have to do with a named import/export (such as an element of 'import {A, B, C} from "' )
		else {
			const name = this.astUtil.takeName(expression.name);
			const propertyName = expression.propertyName == null ? name : this.astUtil.takeName(expression.propertyName);
			result = {
				...base,
				kind: ModuleBindingKind.NAMED,
				expressionKind: FormattedExpressionKind.MODULE_BINDING,
				propertyName,
				name
			};
		}

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the FormattedModuleBinding
	 * @param {FormattedPropertyName} formatted
	 * @returns {string}
	 */
	private stringify (formatted: FormattedModuleBinding): string {
		switch (formatted.kind) {
			case ModuleBindingKind.NAMESPACE:
				return `* as ${formatted.name}`;
			case ModuleBindingKind.DEFAULT:
				return formatted.name;
			case ModuleBindingKind.NAMED:
				return `${formatted.propertyName}${formatted.name === formatted.propertyName ? "" : ` as ${formatted.name}`}`;
		}
	}

}