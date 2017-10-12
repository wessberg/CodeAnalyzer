import {IConstructorService} from "./i-constructor-service";
import {ConstructorDeclaration} from "typescript";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {IUpdater} from "../../updater/i-updater-getter";

/**
 * A class that helps with working with ConstructorDeclarations
 */
export class ConstructorService implements IConstructorService {
	constructor (private formatter: IFormatter,
							 private updater: IUpdater,
							 private joiner: IJoiner) {}

	/**
	 * Appends some instructions to a ConstructorDeclaration
	 * @param {string} instructions
	 * @param {ConstructorDeclaration} constructor
	 * @returns {ConstructorDeclaration}
	 */
	public appendInstructionsToConstructor (instructions: string, constructor: ConstructorDeclaration): ConstructorDeclaration {
		// Generate a new Block from the instructions
		const newBlock = this.formatter.formatBlock(instructions);

		return this.updater.updateConstructorDeclarationBody(
			constructor.body == null ? newBlock : this.joiner.joinBlock(constructor.body, newBlock),
			constructor
		);
	}

}