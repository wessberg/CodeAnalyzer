import {IFormattedExpressionFormatter} from "./i-formatted-expression-formatter";
import {FormattedExpressionKind, IFormattedExpression} from "@wessberg/type";
import {AstNode} from "../../../type/ast-node/ast-node";

/**
 * A class that can format any kind of expression
 */
export abstract class FormattedExpressionFormatter implements IFormattedExpressionFormatter {

	/**
	 * Formats the given expression into an IFormattedExpression
	 * @param {Statement|Expression|Declaration|Node} expression
	 * @returns {IFormattedExpression}
	 */
	public format (expression: AstNode): IFormattedExpression {
		const sourceFile = expression.getSourceFile();
		return {
			file: sourceFile == null ? "" : sourceFile.fileName,
			expressionKind: FormattedExpressionKind.EXPRESSION,
			startsAt: expression.pos === -1 ? -1 : expression.pos + this.getRemainingStartShift(expression),
			endsAt: expression.end
		};
	}

	/**
	 * Gets the amount of characters that should be shifted from the beginning
	 * of the text string. // The 'startsAt' must be shifted a bit since it will take whitespace into account. This breaks stuff such as resolving identifier values
	 * @param {AstNode} expression
	 * @returns {number}
	 */
	private getRemainingStartShift (expression: AstNode): number {
		const text = expression.getSourceFile().text.slice(expression.pos, expression.end);
		if (text.length === 0) return 0;
		let count = 0;
		let current = text;

		while (current.startsWith(" ") || current.startsWith("\t") || current.startsWith("\n") || current.startsWith("\r")) {
			current = current.slice(1);
			count++;
		}
		return count;
	}
}