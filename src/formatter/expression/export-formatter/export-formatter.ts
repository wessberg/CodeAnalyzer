import {ExportDeclaration, NamedExports} from "typescript";
import {IExportFormatter} from "./i-export-formatter";
import {FormattedExpressionKind, FormattedModuleBinding, IFormattedExport} from "@wessberg/type";
import {ModuleFormatter} from "../module-formatter/module-formatter";

/**
 * A class that can format the provided ExportDeclaration
 */
export class ExportFormatter extends ModuleFormatter implements IExportFormatter {

	/**
	 * Formats the given ExportDeclaration into an IFormattedModule
	 * @param {FunctionLike} expression
	 * @returns {ImportDeclaration|ExportDeclaration}
	 */
	public format (expression: ExportDeclaration): IFormattedExport {
		const result: IFormattedExport = {
			...super.format(expression),
			path: expression.moduleSpecifier == null ? null : this.unquoteModuleSpecifier(this.astUtil.takeName(expression.moduleSpecifier)),
			expressionKind: FormattedExpressionKind.EXPORT,
			bindings: this.handleNamed(expression.exportClause)
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedExport
	 * @param {IFormattedExport} formatted
	 * @returns {string}
	 */
	protected stringify (formatted: IFormattedExport): string {
		let str = "export ";

		// Add all of the bindings
		str += `{ ${formatted.bindings.map(binding => binding.toString()).join(", ")} }`;

		// Add the export path, if it is provided
		if (formatted.path != null) {
			str += ` from "${formatted.path}"`;
		}
		return str;
	}

	/**
	 * Handles named export bindings
	 * @param {NamedExports?} exports
	 * @returns {FormattedModuleBinding[]}
	 */
	private handleNamed (exports: NamedExports|undefined): FormattedModuleBinding[] {
		if (exports == null) return [];
		const formatter = this.moduleBindingFormatter();

		return exports.elements.map(element => formatter.format(element));
	}
}