import {ClassElement, SyntaxKind} from "typescript";
import {IClassElementFormatter} from "./i-class-element-formatter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {IFormattedClassElement} from "@wessberg/type";

/**
 * A class that can format the provided Class Element
 */
export class ClassElementFormatter extends FormattedExpressionFormatter implements IClassElementFormatter {

	/**
	 * Formats the given Block into an IFormattedBlock
	 * @param {Block} expression
	 * @returns {IFormattedBlock}
	 */
	public format (expression: ClassElement): IFormattedClassElement {
		return {
			...super.format(expression),
			static: expression.modifiers == null ? false : expression.modifiers.find(modifier => modifier.kind === SyntaxKind.StaticKeyword) != null
		};
	}
}