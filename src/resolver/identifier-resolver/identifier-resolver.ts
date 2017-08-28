import {IIdentifierResolver} from "./i-identifier-resolver";
import {FormattedExpression} from "@wessberg/type";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {AstMapperGetter} from "../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class that can resolve any identifier
 */
export class IdentifierResolver implements IIdentifierResolver {
	constructor (private astMapper: AstMapperGetter,
							 private languageService: ITypescriptLanguageService) {}

	/**
	 * Resolves the given identifier
	 * @param {IFormattedIdentifier} identifier
	 * @returns {FormattedExpression}
	 */
	public resolve (identifier: FormattedExpression): FormattedExpression|null {
		const rawDefinitions = this.languageService.getDefinitionAtPosition(identifier.file, identifier.startsAt);
		if (rawDefinitions == null) return null;

		// Take the first definition
		const [firstDefinition] = rawDefinitions;
		return this.astMapper().getFormattedExpressionForFileAtPosition(firstDefinition.fileName, firstDefinition.textSpan.start);
	}

}