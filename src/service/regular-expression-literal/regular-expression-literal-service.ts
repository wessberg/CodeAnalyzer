import {LiteralService} from "../literal/literal-service";
import {RegularExpressionLiteral} from "typescript";
import {IRegularExpressionLiteralService} from "./i-regular-expression-literal-service";

/**
 * A service for working with RegularExpressionLiterals
 */
export class RegularExpressionLiteralService extends LiteralService<RegularExpressionLiteral, RegExp> implements IRegularExpressionLiteralService {

	/**
	 * Gets the text of a RegularExpressionLiteral
	 * @param {RegularExpressionLiteral} literal
	 * @returns {string}
	 */
	public getText (literal: RegularExpressionLiteral): string {
		return literal.text;
	}

	/**
	 * Gets the text of a RegularExpressionLiteral
	 * @param {RegularExpressionLiteral} literal
	 * @returns {RegExp}
	 */
	public getNormalizedText (literal: RegularExpressionLiteral): RegExp {
		return new Function(`return ${this.getText(literal)}`)();
	}

}