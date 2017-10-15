import {IConstructorService} from "./i-constructor-service";
import {ConstructorDeclaration, SyntaxKind} from "typescript";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {IUpdater} from "../../updater/i-updater-getter";
import {NodeService} from "../node/node-service";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IRemover} from "../../remover/i-remover-base";
import {IDecoratorService} from "../decorator/i-decorator-service";

/**
 * A class that helps with working with ConstructorDeclarations
 */
export class ConstructorService extends NodeService<ConstructorDeclaration> implements IConstructorService {
	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.Constructor];
	constructor (private formatter: IFormatter,
							 private updater: IUpdater,
							 private joiner: IJoiner,
							 astUtil: ITypescriptASTUtil,
							 remover: IRemover,
							 decoratorService: IDecoratorService) {
		super(decoratorService, remover, astUtil);
	}

	/**
	 * Appends some instructions to a ConstructorDeclaration
	 * @param {string} instructions
	 * @param {ConstructorDeclaration} constructor
	 * @returns {ConstructorDeclaration}
	 */
	public appendInstructions (instructions: string, constructor: ConstructorDeclaration): ConstructorDeclaration {
		// Generate a new Block from the instructions
		const newBlock = this.formatter.formatBlock(instructions);
		return this.updater.updateConstructorDeclarationBody(
			this.joiner.joinBlock(constructor.body, newBlock),
			constructor
		);
	}

}