import {IMethodService} from "./i-method-service";
import {isReturnStatement, MethodDeclaration, ReturnStatement, SyntaxKind} from "typescript";
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
 * A service that helps with working with MethodDeclarations
 */
export class MethodService extends ClassFunctionLikeService<MethodDeclaration> implements IMethodService {
	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.MethodDeclaration];

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
	 * Takes the ReturnStatement of a MethodDeclaration's body, if it has any
	 * @param {MethodDeclaration} method
	 * @returns {ReturnStatement}
	 */
	public takeReturnStatement (method: MethodDeclaration): ReturnStatement|undefined {
		return method.body == null ? undefined : <ReturnStatement|undefined> method.body.statements.find(statement => isReturnStatement(statement));
	}

	/**
	 * Appends the provided instructions to the provided instruction
	 * @param {string} instructions
	 * @param {MethodDeclaration} method
	 * @returns {MethodDeclaration}
	 */
	public appendInstructions (instructions: string, method: MethodDeclaration): MethodDeclaration {
		// Generate a new Block from the instructions
		const newBlock = this.formatter.formatBlock(instructions);

		return this.updater.updateMethodDeclarationBody(
			this.joiner.joinBlock(method.body, newBlock),
			method
		);
	}
}