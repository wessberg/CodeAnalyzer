import {IMethodService} from "./i-method-service";
import {MethodDeclaration} from "typescript";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IUpdater} from "../../updater/i-updater-getter";
import {IJoiner} from "../../joiner/i-joiner-getter";

/**
 * A service that helps with working with MethodDeclarations
 */
export class MethodService implements IMethodService {
	constructor (private formatter: IFormatter,
							 private updater: IUpdater,
							 private joiner: IJoiner) {}

	/**
	 * Appends the provided instructions to the provided instruction
	 * @param {string} instructions
	 * @param {MethodDeclaration} method
	 * @returns {MethodDeclaration}
	 */
	public appendInstructionsToMethod (instructions: string, method: MethodDeclaration): MethodDeclaration {
		// Generate a new Block from the instructions
		const newBlock = this.formatter.formatBlock(instructions);

		return this.updater.updateMethodDeclarationBody(
			method.body == null ? newBlock : this.joiner.joinBlock(method.body, newBlock),
			method
		);
	}

}