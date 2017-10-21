import {LiteralService} from "../literal/literal-service";
import {NumericLiteral} from "typescript";
import {INumericLiteralService} from "./i-numeric-literal-service";

/**
 * A service for working with NumericLiterals
 */
export class NumericLiteralService extends LiteralService<NumericLiteral, number> implements INumericLiteralService {

	/**
	 * Gets the text of a NumericLiteral
	 * @param {NumericLiteral} literal
	 * @returns {string}
	 */
	public getText (literal: NumericLiteral): string {
		return literal.text;
	}

	/**
	 * Gets the text of a NumericLiteral
	 * @param {NumericLiteral} literal
	 * @returns {number}
	 */
	public getNormalizedText (literal: NumericLiteral): number {
		return parseFloat(this.getText(literal));
	}

}