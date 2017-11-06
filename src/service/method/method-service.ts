import {IMethodService} from "./i-method-service";
import {isReturnStatement, MethodDeclaration, ReturnStatement, SyntaxKind} from "typescript";
import {ClassFunctionLikeService} from "../class-function-like/class-function-like-service";

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
}