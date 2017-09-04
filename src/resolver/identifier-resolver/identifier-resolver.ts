import {IIdentifierResolver} from "./i-identifier-resolver";
import {FormattedExpression} from "@wessberg/type";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {AstMapperGetter} from "../../mapper/ast-mapper/ast-mapper-getter";
import {ImportServiceGetter} from "../../service/import-service/import-service-getter";
import {DefinitionInfo, ScriptElementKind} from "typescript";
import {ClassServiceGetter} from "../../service/class-service/class-service-getter";
import {FunctionServiceGetter} from "../../service/function-service/function-service-getter";

/**
 * A class that can resolve any identifier
 */
export class IdentifierResolver implements IIdentifierResolver {
	constructor (private astMapper: AstMapperGetter,
							 private importService: ImportServiceGetter,
							 private languageService: ITypescriptLanguageService,
							 private classService: ClassServiceGetter,
							 private functionService: FunctionServiceGetter) {
	}

	/**
	 * Resolves the given identifier
	 * @param {IFormattedIdentifier} identifier
	 * @returns {FormattedExpression}
	 */
	public resolve (identifier: FormattedExpression): FormattedExpression|null {
		// Fetch all imported paths and add them to the Language Service first
		const imports = this.addDependencies(identifier);

		// Get the definition
		const definition = this.getDefinitionForIdentifier(identifier);
		if (definition == null) return null;

		// Check the dependencies first
		this.checkDependencies(imports, definition);

		// Get the matching formatted expression
		return this.astMapper().getFormattedExpressionForFileAtPosition(definition.fileName, definition.textSpan.start);
	}

	/**
	 * Checks all dependencies for relevant expressions.
	 * For example, if Typescript informs that an identifier is a class
	 * we want to make sure that the class has been parsed by the CodeAnalyzer
	 * so that it can be properly resolved
	 * @param {string[]} paths
	 * @param {DefinitionInfo} definition
	 */
	private checkDependencies (paths: string[], definition: DefinitionInfo): void {

		new Set([...paths, definition.fileName]).forEach(path => {
			switch (definition.kind) {

				case ScriptElementKind.classElement:
					// Check the file for classes unless it is already being checked
					this.classService().getClassesForFile(path);
					break;

				case ScriptElementKind.functionElement:
					// Check the file for functions unless it is already being checked
					this.functionService().getFunctionsForFile(path);
					break;
			}
		});
	}

	/**
	 * Adds all the dependencies of the file containing the provided identifier to the language service
	 * @param {FormattedExpression} identifier
	 * @returns {string[]}
	 */
	private addDependencies (identifier: FormattedExpression): string[] {
		const imports = this.importService().getImportedFilesForFile(identifier.file);

		// Return the normalized file paths
		return imports.filter(path => {
			const pathInfo = this.languageService.getPathInfo(path);

			// Only add the file if it needs an update
			if (pathInfo.needsUpdate) this.languageService.addFile(pathInfo);

			// Include the file if it needs an update
			return pathInfo.needsUpdate;
		});
	}

	/**
	 * Gets the definition for a formatted expression
	 * @param {FormattedExpression} identifier
	 * @returns {DefinitionInfo}
	 */
	private getDefinitionForIdentifier (identifier: FormattedExpression): DefinitionInfo|null {
		const rawDefinitions = this.languageService.getDefinitionAtPosition(identifier.file, identifier.startsAt);
		if (rawDefinitions == null) return null;

		// Return the first definition
		return rawDefinitions[0];
	}

}