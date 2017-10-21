import {ILiteralService} from "./i-literal-service";
import {LiteralExpression} from "typescript";

/**
 * A service for working with LiteralExpressions
 */
export abstract class LiteralService<T extends LiteralExpression, U> implements ILiteralService<T, U> {

	/**
	 * Gets the normalized text of a LiteralExpression
	 * @template T, U
	 * @param {T} literal
	 * @returns {U}
	 */
	public abstract getNormalizedText (literal: T): U;

	/**
	 * Gets the text of a LiteralExpression
	 * @template T
	 * @param {T} literal
	 * @returns {string}
	 */
	public abstract getText (literal: T): string;
}
