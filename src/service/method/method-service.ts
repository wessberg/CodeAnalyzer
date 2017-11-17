import {IMethodService} from "./i-method-service";
import {Block, isCallExpression, isExpressionStatement, isReturnStatement, MethodDeclaration, NodeArray, ParameterDeclaration, ReturnStatement, SyntaxKind, createBlock} from "typescript";
import {ClassFunctionLikeService} from "../class-function-like/class-function-like-service";
import {IPlacement} from "../../placement/i-placement";
import {IParameterCtor} from "../../light-ast/ctor/parameter/i-parameter-ctor";
import {isSuperExpression} from "@wessberg/typescript-ast-util";

/**
 * A service that helps with working with MethodDeclarations
 */
export class MethodService extends ClassFunctionLikeService<MethodDeclaration> implements IMethodService {
	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.MethodDeclaration];

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

	/**
	 * Prepends some instructions to a ConstructorDeclaration. If it contains a 'super()' call, it will place
	 * the instructions immediately after that one.
	 * @param {string} instructions
	 * @param {ConstructorDeclaration} method
	 * @returns {ConstructorDeclaration}
	 */
	public prependInstructions (instructions: string, method: MethodDeclaration): MethodDeclaration {
		// Generate a new Block from the instructions
		const newBlock = this.formatter.formatBlock(instructions);

		// Generate a combined block
		let combinedBlock: Block;

		// Take the first node of the statements of the body
		const firstNode = method.body == null ? undefined : method.body.statements[0];

		// Check if there is a super expression (such as 'super()') contained within the first statement of the existing body
		const firstNodeContainsSuperExpression = firstNode == null ? false : isExpressionStatement(firstNode) && isCallExpression(firstNode.expression) && isSuperExpression(firstNode.expression.expression);

		// If it has a super expression, create a block from joining the two blocks, but by placing the new statements immediately after the super expression
		if (firstNodeContainsSuperExpression) {
			combinedBlock = createBlock(this.joiner.joinStatementNodeArrays(
				newBlock.statements,
				method.body == null ? undefined : method.body.statements,
				{position: "AFTER", node: firstNode}));
		}

		// Otherwise, simply join the two blocks together
		else {
			combinedBlock = this.joiner.joinBlock(newBlock, method.body);
		}

		return this.updater.updateMethodDeclarationBody(
			combinedBlock,
			method
		);
	}

	/**
	 * Adds a Parameter to the provided MethodDeclaration
	 * @param {IParameterCtor} parameter
	 * @param {MethodDeclaration} method
	 * @param {IPlacement} [placement]
	 * @returns {MethodDeclaration}
	 */
	public addParameter (parameter: IParameterCtor, method: MethodDeclaration, placement?: IPlacement): MethodDeclaration {
		const formatted = this.formatter.formatParameter(parameter);
		return this.updater.updateMethodDeclarationParameters(
			<NodeArray<ParameterDeclaration>> this.joiner.joinDeclarationNodeArrays(formatted, method.parameters, placement),
			method
		);
	}
}