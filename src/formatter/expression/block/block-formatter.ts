import {Block} from "typescript";
import {IBlockFormatter} from "./i-block-formatter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionKind, IFormattedBlock} from "@wessberg/type";
import {ExpressionFormatterGetter} from "../expression/expression-formatter-getter";

/**
 * A class that can format the provided block
 */
export class BlockFormatter extends FormattedExpressionFormatter implements IBlockFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private expressionFormatter: ExpressionFormatterGetter) {
		super();
	}

	/**
	 * Formats the given Block into an IFormattedBlock
	 * @param {Block} expression
	 * @returns {IFormattedBlock}
	 */
	public format (expression: Block): IFormattedBlock {
		const result: IFormattedBlock = {
			...super.format(expression),
			statements: expression.statements.map(statement => this.expressionFormatter().format(statement)),
			expressionKind: FormattedExpressionKind.BLOCK
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedBlock
	 * @param {IFormattedBlock} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IFormattedBlock): string {
		return formatted.statements.map(statement => statement.toString()).join(";");
	}

}