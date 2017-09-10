import {ImportClause, ImportDeclaration, isNamespaceImport, NamedImportBindings} from "typescript";
import {IImportFormatter} from "./i-import-formatter";
import {FormattedExpressionKind, FormattedModuleBinding, IFormattedDefaultModuleBinding, IFormattedImport, IFormattedNamedModuleBinding, IFormattedNamespaceModuleBinding, ModuleBindingKind} from "@wessberg/type";
import {ModuleFormatter} from "../module-formatter/module-formatter";

/**
 * A class that can format the provided ImportDeclaration
 */
export class ImportFormatter extends ModuleFormatter implements IImportFormatter {

	/**
	 * Formats the given ImportDeclaration into an IFormattedModule
	 * @param {FunctionLike} expression
	 * @returns {ImportDeclaration|ExportDeclaration}
	 */
	public format (expression: ImportDeclaration): IFormattedImport {
		const result: IFormattedImport = {
			...super.format(expression),
			path: this.unquoteModuleSpecifier(this.astUtil.takeName(expression.moduleSpecifier)),
			expressionKind: FormattedExpressionKind.IMPORT,
			bindings: this.handleClause(expression.importClause)
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedImport
	 * @param {IFormattedImport} formatted
	 * @returns {string}
	 */
	protected stringify (formatted: IFormattedImport): string {
		let str = "import ";

		// Add all bindings
		const defaultBinding = <IFormattedDefaultModuleBinding|undefined> formatted.bindings.find(binding => binding.kind === ModuleBindingKind.DEFAULT);
		const namespaceBinding = <IFormattedNamespaceModuleBinding|undefined> formatted.bindings.find(binding => binding.kind === ModuleBindingKind.NAMESPACE);
		const namedBindings = <IFormattedNamedModuleBinding[]> formatted.bindings.filter(binding => binding.kind === ModuleBindingKind.NAMED);

		// Add the default binding (e.g. import Foo...)
		if (defaultBinding != null) {
			str += defaultBinding.toString();
		}

		// Add the namespace binding (e.g. import * as Foo)
		if (namespaceBinding != null) {
			// If preceded by a default binding, add a ',' before the namespace import
			if (defaultBinding != null) str += ", ";

			// Stringify the namespace
			str += namespaceBinding.toString();
		}

		// If the import has any named bindings
		if (namedBindings.length > 0) {
			// If preceded by a default binding or a namespace binding, add a ',' before the named imports
			if (defaultBinding != null || namespaceBinding != null) str += ", ";

			// Add all of the named bindings
			str += `{ ${namedBindings.map(binding => binding.toString()).join(", ")} }`;
		}

		// Add the import path
		str += ` from "${formatted.path}"`;

		return str;
	}

	/**
	 * Handles named import bindings
	 * @param {NamedImportBindings?} exports
	 * @returns {FormattedModuleBinding[]}
	 */
	private handleNamed (exports: NamedImportBindings|undefined): FormattedModuleBinding[] {
		if (exports == null) return [];
		const bindings: FormattedModuleBinding[] = [];
		const formatter = this.moduleBindingFormatter();

		// If the named binding is a namespace
		if (isNamespaceImport(exports)) {
			bindings.push(formatter.format(exports));
		}

		// If the named binding is a group of named imports
		else {
			bindings.push(...exports.elements.map(element => formatter.format(element)));
		}

		return bindings;
	}

	/**
	 * Handles an Import Clause or a group of NamedExports
	 * @param {ts.ImportClause} clause
	 * @returns {FormattedModuleBinding[]}
	 */
	private handleClause (clause: ImportClause|undefined): FormattedModuleBinding[] {
		if (clause == null) return [];
		const bindings: FormattedModuleBinding[] = [];
		const formatter = this.moduleBindingFormatter();

		// If it has a name, we have a default import
		if (clause.name != null) {
			bindings.push(formatter.format(clause.name));
		}
		// Add all named or namespace imports
		bindings.push(...this.handleNamed(clause.namedBindings));
		return bindings;
	}
}