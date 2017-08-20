import {ICodeAnalyzer} from "./i-code-analyzer";
import {IInterfaceType} from "@wessberg/type";
import {InterfaceDeclaration, NodeArray, Statement} from "typescript";
import {interfaceTypeService} from "../services";

/**
 * A service that can analyze your code in great detail ahead of time.
 */
export class CodeAnalyzer implements ICodeAnalyzer {
	/**
	 * Gets all IInterfaceTypes for the given file
	 * @param {string} file
	 * @returns {IInterfaceType[]}
	 */
	public getInterfacesForFile (file: string): IInterfaceType[] {
		return interfaceTypeService.getInterfacesForFile(file);
	}

	/**
	 * Gets all IInterfaceTypes for the given statement
	 * @param {InterfaceDeclaration} statement
	 * @returns {IInterfaceType[]}
	 */
	public getInterfacesForStatement (statement: InterfaceDeclaration): IInterfaceType[] {
		return interfaceTypeService.getInterfacesForStatement(statement);
	}

	/**
	 * Gets all IInterfaceTypes for the given Statements
	 * @param {NodeArray<Statement>} statements
	 * @returns {IInterfaceType[]}
	 */
	public getInterfacesForStatements (statements: NodeArray<Statement>): IInterfaceType[] {
		return interfaceTypeService.getInterfacesForStatements(statements);
	}
}