import {IStringLiteralService} from "./i-string-literal-service";
import {LiteralService} from "../literal/literal-service";
import {StringLiteral} from "typescript";

/**
 * A service for working with StringLiterals
 */
export class StringLiteralService extends LiteralService<StringLiteral, string> implements IStringLiteralService {

	/**
	 * Gets the text of a StringLiteral
	 * @param {StringLiteral} literal
	 * @returns {string}
	 */
	public getText (literal: StringLiteral): string {
		return literal.text;
	}

	/**
	 * Gets the text of a StringLiteral
	 * @param {StringLiteral} literal
	 * @returns {string}
	 */
	public getNormalizedText (literal: StringLiteral): string {
		return this.getText(literal);
	}

}