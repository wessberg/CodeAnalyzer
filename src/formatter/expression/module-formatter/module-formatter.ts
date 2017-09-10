import {ExportDeclaration, ImportDeclaration} from "typescript";
import {IModuleFormatter} from "./i-module-formatter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {IFormattedModule} from "@wessberg/type";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {ModuleBindingFormatterGetter} from "../module-binding/module-binding-formatter-getter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class that can format the provided ImportDeclaration or ExportDeclaration
 */
export abstract class ModuleFormatter extends FormattedExpressionFormatter implements IModuleFormatter {
	constructor (protected astUtil: ITypescriptASTUtil,
							 protected astMapper: AstMapperGetter,
							 protected moduleBindingFormatter: ModuleBindingFormatterGetter) {
		super();
	}

	/**
	 * Formats the given ImportDeclaration or ExportDeclaration into an IFormattedModule
	 * @param {FunctionLike} expression
	 * @returns {ImportDeclaration|ExportDeclaration}
	 */
	public format (expression: ImportDeclaration|ExportDeclaration): IFormattedModule {
		return {
			...super.format(expression),
			bindings: []
		};
	}

	/**
	 * Unquotes a module specifier
	 * @param {string} moduleSpecifier
	 * @returns {string}
	 */
	protected unquoteModuleSpecifier (moduleSpecifier: string): string {
		const regex = /["'`]/;
		let firstCharIndex = 0;
		const firstChar = moduleSpecifier[firstCharIndex];
		let lastCharIndex = moduleSpecifier.length - 1;
		const lastChar = moduleSpecifier[lastCharIndex];
		if (regex.test(firstChar)) firstCharIndex++;
		if (regex.test(lastChar)) lastCharIndex--;
		return moduleSpecifier.slice(firstCharIndex, lastCharIndex + 1);
	}
}