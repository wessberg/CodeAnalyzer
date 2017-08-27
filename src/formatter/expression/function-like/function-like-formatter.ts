import {Block, FunctionLikeDeclaration} from "typescript";
import {IFunctionLikeFormatter} from "./i-function-like-formatter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {IFormattedFunctionLike} from "@wessberg/type";
import {TypeFormatterGetter} from "../../type/type-formatter/type-formatter-getter";
import {BlockFormatterGetter} from "../block/block-formatter-getter";

/**
 * A class that can format the provided FunctionLike
 */
export class FunctionLikeFormatter extends FormattedExpressionFormatter implements IFunctionLikeFormatter {
	constructor (private typeFormatter: TypeFormatterGetter,
							 private blockFormatter: BlockFormatterGetter) {
		super();
	}

	/**
	 * Formats the given FunctionLike into an IFormattedFunctionLike
	 * @param {FunctionLike} expression
	 * @returns {IFormattedFunctionLike}
	 */
	public format (expression: FunctionLikeDeclaration): IFormattedFunctionLike {
		return {
			...super.format(expression),
			type: this.typeFormatter().format(expression.type),
			body: expression.body == null ? null : this.blockFormatter().format(<Block>expression.body)
		};
	}
}