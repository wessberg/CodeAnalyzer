import {CallExpression} from "typescript";
import {CallableFormatter} from "./CallableFormatter";
import {ICallExpressionFormatter} from "./interface/ICallExpressionFormatter";
import {argumentsFormatter, identifierUtil, mapper, sourceFilePropertiesGetter} from "../services";
import {ICallExpression, IdentifierMapKind} from "../identifier/interface/IIdentifier";

export class CallExpressionFormatter extends CallableFormatter implements ICallExpressionFormatter {

	/**
	 * Formats a CallExpression into an ICallExpression.
	 * @param {CallExpression} statement
	 * @returns {ICallExpression}
	 */
	public format (statement: CallExpression): ICallExpression {
		const map: ICallExpression = identifierUtil.setKind({
			...this.formatCallable(statement),
			___kind: IdentifierMapKind.CALL_EXPRESSION,
			startsAt: statement.pos,
			endsAt: statement.end,
			arguments: {
				startsAt: statement.arguments.pos,
				endsAt: statement.arguments.end,
				argumentsList: argumentsFormatter.format(statement)
			},
			type: this.formatTypeArguments(statement),
			filePath: sourceFilePropertiesGetter.getSourceFileProperties(statement).filePath
		}, IdentifierMapKind.CALL_EXPRESSION);

		mapper.set(map, statement);
		return map;
	}
}