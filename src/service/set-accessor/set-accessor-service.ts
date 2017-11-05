import {ISetAccessorService} from "./i-set-accessor-service";
import {SetAccessorDeclaration, SyntaxKind} from "typescript";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IUpdater} from "../../updater/i-updater-getter";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {IRemover} from "../../remover/i-remover-base";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypeNodeService} from "../type-node/i-type-node-service";
import {ClassFunctionLikeService} from "../class-function-like/class-function-like-service";
import {IPropertyNameService} from "../property-name/i-property-name-service";
import {IModifierService} from "../modifier/i-modifier-service";
import {INodeToCtorMapper} from "../../node-to-ctor-mapper/i-node-to-ctor-mapper-getter";

/**
 * A service that helps with working with SetAccessorDeclarations
 */
export class SetAccessorService extends ClassFunctionLikeService<SetAccessorDeclaration> implements ISetAccessorService {

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.SetAccessor];

	constructor (private joiner: IJoiner,
							 propertyNameService: IPropertyNameService,
							 typeNodeService: ITypeNodeService,
							 modifierService: IModifierService,
							 nodeToCtorMapper: INodeToCtorMapper,
							 remover: IRemover,
							 formatter: IFormatter,
							 updater: IUpdater,
							 decoratorService: IDecoratorService,
							 languageService: ITypescriptLanguageService,
							 astUtil: ITypescriptASTUtil) {
		super(typeNodeService, propertyNameService, modifierService, updater, formatter, nodeToCtorMapper, remover, decoratorService, languageService, astUtil);
	}

	/**
	 * Gets the name of the given SetAccessorDeclaration
	 * @param {SetAccessorDeclaration} setter
	 * @returns {string}
	 */
	public getName (setter: SetAccessorDeclaration): string {
		return this.propertyNameService.getName(setter.name);
	}

	/**
	 * Appends the provided instructions to the given setter
	 * @param {string} instructions
	 * @param {SetAccessorDeclaration} setter
	 * @returns {SetAccessorDeclaration}
	 */
	public appendInstructions (instructions: string, setter: SetAccessorDeclaration): SetAccessorDeclaration {
		// Generate a new Block from the instructions
		const newBlock = this.formatter.formatBlock(instructions);

		return this.updater.updateSetAccessorDeclarationBody(
			this.joiner.joinBlock(setter.body, newBlock),
			setter
		);
	}
}