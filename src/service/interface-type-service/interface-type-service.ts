import {IInterfaceTypeService} from "./i-interface-type-service";
import {IFormattedInterfaceType} from "@wessberg/type";
import {createNodeArray, InterfaceDeclaration, NodeArray, Statement, SyntaxKind} from "typescript";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {InterfaceTypeFormatterGetter} from "../../formatter/type/interface-type-formatter/interface-type-formatter-getter";

/**
 * A class that can generate IInterfaceTypes
 */
export class InterfaceTypeService implements IInterfaceTypeService {
	/**
	 * The Set of supported SyntaxKinds
	 * @type {Set<SyntaxKind>}
	 */
	public readonly supportedKinds: Set<SyntaxKind> = new Set([SyntaxKind.InterfaceDeclaration]);

	constructor (private astUtil: ITypescriptASTUtil,
							 private languageService: ITypescriptLanguageService,
							 private interfaceTypeFormatter: InterfaceTypeFormatterGetter) {
	}

	/**
	 * Gets all IInterfaceTypes for the given file
	 * @param {string} file
	 * @returns {IFormattedInterfaceType[]}
	 */
	public getInterfacesForFile (file: string): IFormattedInterfaceType[] {
		return this.getInterfacesForStatements(this.languageService.addFile({path: file}));
	}

	/**
	 * Gets all IInterfaceTypes for the given statement
	 * @param {InterfaceDeclaration} statement
	 * @returns {IFormattedInterfaceType[]}
	 */
	public getInterfacesForStatement (statement: InterfaceDeclaration): IFormattedInterfaceType[] {
		return this.getInterfacesForStatements(createNodeArray([statement]));
	}

	/**
	 * Gets all IInterfaceTypes for the given Statements
	 * @param {NodeArray<Statement>} statements
	 * @returns {IFormattedInterfaceType[]}
	 */
	public getInterfacesForStatements (statements: NodeArray<Statement>): IFormattedInterfaceType[] {
		const filtered = this.astUtil.filterStatements<InterfaceDeclaration>(statements, this.supportedKinds, true);
		return filtered.map(statement => this.interfaceTypeFormatter().format(statement));
	}

}