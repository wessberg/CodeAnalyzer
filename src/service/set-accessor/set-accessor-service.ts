import {ISetAccessorService} from "./i-set-accessor-service";
import {SetAccessorDeclaration, SyntaxKind} from "typescript";
import {ClassFunctionLikeService} from "../class-function-like/class-function-like-service";

/**
 * A service that helps with working with SetAccessorDeclarations
 */
export class SetAccessorService extends ClassFunctionLikeService<SetAccessorDeclaration> implements ISetAccessorService {

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.SetAccessor];

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