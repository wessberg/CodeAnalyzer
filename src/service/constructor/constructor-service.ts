import {IConstructorService} from "./i-constructor-service";
import {Block, ConstructorDeclaration, createBlock, isCallExpression, isExpressionStatement, NodeArray, ParameterDeclaration, SyntaxKind} from "typescript";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {IUpdater} from "../../updater/i-updater-getter";
import {NodeService} from "../node/node-service";
import {isSuperExpression, ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IRemover} from "../../remover/i-remover-base";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {IParameterService} from "../parameter/i-parameter-service";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IParameterCtor} from "../../light-ast/ctor/parameter/i-parameter-ctor";
import {IPlacement} from "../../placement/i-placement";

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
							 private parameterService: IParameterService,
							 updater: IUpdater,
							 joiner: IJoiner,
							 astUtil: ITypescriptASTUtil,
							 remover: IRemover,
							 languageService: ITypescriptLanguageService,
							 decoratorService: IDecoratorService) {
		super(decoratorService, languageService, joiner, updater, remover, astUtil);
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

	/**
	 * Prepends some instructions to a ConstructorDeclaration. If it contains a 'super()' call, it will place
	 * the instructions immediately after that one.
	 * @param {string} instructions
	 * @param {ConstructorDeclaration} constructor
	 * @returns {ConstructorDeclaration}
	 */
	public prependInstructions (instructions: string, constructor: ConstructorDeclaration): ConstructorDeclaration {
		// Generate a new Block from the instructions
		const newBlock = this.formatter.formatBlock(instructions);

		// Generate a combined block
		let combinedBlock: Block;

		// Take the first node of the statements of the body
		const firstNode = constructor.body == null ? undefined : constructor.body.statements[0];

		// Check if there is a super expression (such as 'super()') contained within the first statement of the existing body
		const firstNodeContainsSuperExpression = firstNode == null ? false : isExpressionStatement(firstNode) && isCallExpression(firstNode.expression) && isSuperExpression(firstNode.expression.expression);

		// If it has a super expression, create a block from joining the two blocks, but by placing the new statements immediately after the super expression
		if (firstNodeContainsSuperExpression) {
			combinedBlock = createBlock(this.joiner.joinStatementNodeArrays(
				newBlock.statements,
				constructor.body == null ? undefined : constructor.body.statements,
				{position: "AFTER", node: firstNode}));
		}

		// Otherwise, simply join the two blocks together
		else {
			combinedBlock = this.joiner.joinBlock(newBlock, constructor.body);
		}

		return this.updater.updateConstructorDeclarationBody(
			combinedBlock,
			constructor
		);
	}

	/**
	 * Adds a Parameter to the provided ConstructorDeclaration
	 * @param {IParameterCtor} parameter
	 * @param {ConstructorDeclaration} constructor
	 * @param {IPlacement} [placement]
	 * @returns {ConstructorDeclaration}
	 */
	public addParameter (parameter: IParameterCtor, constructor: ConstructorDeclaration, placement?: IPlacement): ConstructorDeclaration {
		const formatted = this.formatter.formatParameter(parameter);
		return this.updater.updateConstructorDeclarationParameters(
			<NodeArray<ParameterDeclaration>> this.joiner.joinDeclarationNodeArrays(formatted, constructor.parameters, placement),
			constructor
		);
	}

}