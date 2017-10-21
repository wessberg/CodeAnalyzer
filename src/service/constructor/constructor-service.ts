import {IConstructorService} from "./i-constructor-service";
import {ConstructorDeclaration, SyntaxKind} from "typescript";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {IUpdater} from "../../updater/i-updater-getter";
import {NodeService} from "../node/node-service";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IRemover} from "../../remover/i-remover-base";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {IParameterService} from "../parameter/i-parameter-service";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";

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
							 private parameterService: IParameterService,
							 astUtil: ITypescriptASTUtil,
							 remover: IRemover,
							 languageService: ITypescriptLanguageService,
							 decoratorService: IDecoratorService) {
		super(decoratorService, languageService, remover, astUtil);
	}

	/**
	 * Gets the names of the types of all parameters, respecting original index positions
	 * @param {ConstructorDeclaration} constructor
	 * @returns {string[]}
	 */
	public getParameterTypeNames (constructor: ConstructorDeclaration): (string|undefined)[] {
		return constructor.parameters.map(parameter => this.parameterService.getTypeName(parameter));
	}

	/**
	 * Gets the names of the types of all parameters, respecting original index positions.
	 * If a parameter has an initializer, it forces the type to 'undefined.
	 * @param {ConstructorDeclaration} constructor
	 * @returns {string[]}
	 */
	public getNonInitializedTypeNames (constructor: ConstructorDeclaration): (string|undefined)[] {
		return constructor.parameters
			.map(parameter => this.parameterService.hasInitializer(parameter) ? undefined : this.parameterService.getTypeName(parameter));
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