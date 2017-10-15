import {TypeDeclarationService} from "../type-declaration/type-declaration-service";
import {InterfaceDeclaration, SyntaxKind} from "typescript";
import {IInterfaceDeclarationService} from "./i-interface-declaration-service";

/**
 * A service for working with InterfaceDeclarations
 */
export class InterfaceDeclarationService extends TypeDeclarationService<InterfaceDeclaration> implements IInterfaceDeclarationService {

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.InterfaceDeclaration];

	/**
	 * Returns the name of an InterfaceDeclaration
	 * @param {InterfaceDeclaration} type
	 * @returns {string}
	 */
	public getName (type: InterfaceDeclaration): string {
		return type.name.text;
	}
}