import {IGetAccessorService} from "./i-get-accessor-service";
import {GetAccessorDeclaration, SyntaxKind} from "typescript";
import {ClassFunctionLikeService} from "../class-function-like/class-function-like-service";

/**
 * A service that helps with working with GetAccessorDeclarations
 */
export class GetAccessorService extends ClassFunctionLikeService<GetAccessorDeclaration> implements IGetAccessorService {

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {Iterable<SyntaxKind>}
	 */
	protected readonly ALLOWED_KINDS: Iterable<SyntaxKind> = [SyntaxKind.GetAccessor];

	/**
	 * Gets the name of the given GetAccessorDeclaration
	 * @param {GetAccessorDeclaration} getter
	 * @returns {string}
	 */
	public getName (getter: GetAccessorDeclaration): string {
		return this.propertyNameService.getName(getter.name);
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