import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IImportService} from "./i-import-service";
import {AstNode} from "../../type/ast-node/ast-node";

/**
 * A class that can generate imports
 */
export class ImportService implements IImportService {

	constructor (private languageService: ITypescriptLanguageService) {
	}

	/**
	 * Gets all imported files for the given file
	 * @param {string} file
	 * @returns {string[]}
	 */
	public getImportedFilesForFile (file: string): string[] {
		// Get the imports
		return this.languageService.getImportedFilesForFile(file);
	}

	/**
	 * Gets all imported files for the file holding the provided statement
	 * @param {AstNode} statement
	 * @returns {string[]}
	 */
	public getImportedFilesForStatementFile (statement: AstNode): string[] {
		return this.languageService.getImportedFilesForStatementFile(statement);
	}
}