import {IGetAccessorService} from "./i-get-accessor-service";
import {GetAccessorDeclaration, SyntaxKind} from "typescript";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IUpdater} from "../../updater/i-updater-getter";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {IRemover} from "../../remover/i-remover-base";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypeNodeService} from "../type-node/i-type-node-service";
import {ClassFunctionLikeService} from "../class-function-like/class-function-like-service";

/**
 * A service that helps with working with GetAccessorDeclarations
 */
export class GetAccessorService extends ClassFunctionLikeService<GetAccessorDeclaration> implements IGetAccessorService {

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.GetAccessor];

	constructor (private formatter: IFormatter,
							 private updater: IUpdater,
							 private joiner: IJoiner,
							 typeNodeService: ITypeNodeService,
							 remover: IRemover,
							 decoratorService: IDecoratorService,
							 languageService: ITypescriptLanguageService,
							 astUtil: ITypescriptASTUtil) {
		super(typeNodeService, remover, decoratorService, languageService, astUtil);
	}

	/**
	 * Appends the provided instructions to the given getter
	 * @param {string} instructions
	 * @param {GetAccessorDeclaration} getter
	 * @returns {GetAccessorDeclaration}
	 */
	public appendInstructions (instructions: string, getter: GetAccessorDeclaration): GetAccessorDeclaration {
		// Generate a new Block from the instructions
		const newBlock = this.formatter.formatBlock(instructions);

		return this.updater.updateGetAccessorDeclarationBody(
			this.joiner.joinBlock(getter.body, newBlock),
			getter
		);
	}
}