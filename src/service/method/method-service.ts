import {IMethodService} from "./i-method-service";
import {isReturnStatement, MethodDeclaration, ReturnStatement, SyntaxKind} from "typescript";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IUpdater} from "../../updater/i-updater-getter";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {IRemover} from "../../remover/i-remover-base";
import {NodeService} from "../node/node-service";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypeNodeService} from "../type-node/i-type-node-service";

/**
 * A service that helps with working with MethodDeclarations
 */
export class MethodService extends NodeService<MethodDeclaration> implements IMethodService {

	/**
	 * Takes the ReturnStatement of a MethodDeclaration's body, if it has any
	 * @param {MethodDeclaration} method
	 * @returns {ReturnStatement}
	 */
	public takeReturnStatement (method: MethodDeclaration): ReturnStatement|undefined {
		return method.body == null ? undefined : <ReturnStatement|undefined> method.body.statements.find(statement => isReturnStatement(statement));
	}

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.MethodDeclaration];

	constructor (private formatter: IFormatter,
							 private updater: IUpdater,
							 private joiner: IJoiner,
							 private typeNodeService: ITypeNodeService,
							 remover: IRemover,
							 decoratorService: IDecoratorService,
							 languageService: ITypescriptLanguageService,
							 astUtil: ITypescriptASTUtil) {
		super(decoratorService, languageService, remover, astUtil);
	}

	/**
	 * Returns true if the provided method is optional
	 * @param {MethodDeclaration} method
	 * @returns {boolean}
	 */
	public isOptional (method: MethodDeclaration): boolean {
		return method.questionToken != null;
	}

	/**
	 * Gets the type of the MethodDeclaration
	 * @param {MethodDeclaration} method
	 * @returns {string}
	 */
	public getTypeName (method: MethodDeclaration): string|undefined {
		if (method.type == null) return undefined;
		return this.typeNodeService.getNameOfType(method.type);
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