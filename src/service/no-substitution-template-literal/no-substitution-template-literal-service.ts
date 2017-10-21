import {LiteralService} from "../literal/literal-service";
import {NoSubstitutionTemplateLiteral} from "typescript";
import {INoSubstitutionTemplateLiteralService} from "./i-no-substitution-template-literal-service";

/**
 * A service for working with NoSubstitutionTemplateLiterals
 */
export class NoSubstitutionTemplateLiteralService extends LiteralService<NoSubstitutionTemplateLiteral, string> implements INoSubstitutionTemplateLiteralService {

	/**
	 * Gets the text of a NoSubstitutionTemplateLiteral
	 * @param {NoSubstitutionTemplateLiteral} literal
	 * @returns {string}
	 */
	public getText (literal: NoSubstitutionTemplateLiteral): string {
		return literal.text;
	}

	/**
	 * Gets the text of a NoSubstitutionTemplateLiteral
	 * @param {NoSubstitutionTemplateLiteral} literal
	 * @returns {string}
	 */
	public getNormalizedText (literal: NoSubstitutionTemplateLiteral): string {
		return this.getText(literal);
	}

}