import {INotImplementedFormatter} from "./i-not-implemented-formatter";
import {Expression, ExpressionWithTypeArguments, SyntaxKind} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {FormattedExpressionKind, IFormattedNotImplemented} from "@wessberg/type";

/**
 * A class that can format 'NotImplemented' expressions. These are placeholders until expressions of a
 * given SyntaxKind is implemented
 */
export class NotImplementedFormatter extends FormattedExpressionFormatter implements INotImplementedFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the given Expression into an IFormattedNotImplemented
	 * @param {Expression|ExpressionWithTypeArguments} expression
	 * @returns {IFormattedNotImplemented}
	 */
	public format (expression: Expression|ExpressionWithTypeArguments): IFormattedNotImplemented {

		const result: IFormattedNotImplemented = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.NOT_IMPLEMENTED,
			syntaxKind: SyntaxKind[expression.kind]
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify();
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedNotImplemented
	 * @returns {string}
	 */
	private stringify (): string {
		return "<<NOT IMPLEMENTED>>";
	}

}