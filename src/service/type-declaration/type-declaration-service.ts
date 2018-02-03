import {ITypeDeclarationService} from "./i-type-declaration-service";
import {InterfaceDeclaration, TypeLiteralNode} from "typescript";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {NodeService} from "../node/node-service";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {IRemover} from "../../remover/i-remover-base";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypeElementService} from "../type-element/i-type-element-service";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {IUpdater} from "../../updater/i-updater-getter";

/**
 * An abstract service for working with TypeDeclarations
 */
export abstract class TypeDeclarationService<T extends InterfaceDeclaration|TypeLiteralNode> extends NodeService<T> implements ITypeDeclarationService<T> {
	constructor (private readonly typeElementService: ITypeElementService,
							 joiner: IJoiner,
							 updater: IUpdater,
							 decoratorService: IDecoratorService,
							 languageService: ITypescriptLanguageService,
							 remover: IRemover,
							 astUtil: ITypescriptASTUtil) {
		super(decoratorService, languageService, joiner, updater, remover, astUtil);
	}

	/**
	 * Gets the names of all properties of a TypeDeclaration
	 * @param {InterfaceDeclaration | TypeLiteralNode} type
	 * @returns {string[]}
	 */
	public getPropertyNamesOfTypeDeclaration (type: T): string[] {
		return type.members
		// Only take those that has a name
			.filter(member => member.name != null)
			// Print the name for each of those
			.map(member => this.typeElementService.getName(member)!);
	}

	/**
	 * Gets the names of all required properties of a TypeDeclaration
	 * @param {InterfaceDeclaration | TypeLiteralNode} type
	 * @returns {string[]}
	 */
	public getRequiredPropertyNamesOfTypeDeclaration (type: T): string[] {
		return type.members
		// Only take those that has a name and is non-optional
			.filter(member => member.name != null && member.questionToken == null)
			// Print the name for each of those
			.map(member => this.typeElementService.getName(member)!);
	}

	/**
	 * Gets the names of all optional properties of a TypeDeclaration
	 * @param {InterfaceDeclaration | TypeLiteralNode} type
	 * @returns {string[]}
	 */
	public getOptionalPropertyNamesOfTypeDeclaration (type: T): string[] {
		return type.members
		// Only take those that has a name and IS optional
			.filter(member => member.name != null && member.questionToken != null)
			// Print the name for each of those
			.map(member => this.typeElementService.getName(member)!);
	}
}