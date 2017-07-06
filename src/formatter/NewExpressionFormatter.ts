import {NewExpression} from "typescript";
import {CallableFormatter} from "./CallableFormatter";
import {INewExpressionFormatter} from "./interface/INewExpressionFormatter";
import {argumentsFormatter, identifierUtil, mapper, sourceFilePropertiesGetter} from "../services";
import {IdentifierMapKind, INewExpression} from "../identifier/interface/IIdentifier";

export class NewExpressionFormatter extends CallableFormatter implements INewExpressionFormatter {

	/**
	 * Formats a NewExpression into an INewExpression.
	 * @param {NewExpression} statement
	 * @returns {INewExpression}
	 */
	public format (statement: NewExpression): INewExpression {

		const map: INewExpression = identifierUtil.setKind({
			...this.formatCallable(statement),
			___kind: IdentifierMapKind.NEW_EXPRESSION,
			startsAt: statement.pos,
			endsAt: statement.end,
			arguments: {
				startsAt: statement.arguments == null ? -1 : statement.arguments.pos,
				endsAt: statement.arguments == null ? -1 : statement.arguments.end,
				argumentsList: argumentsFormatter.format(statement)
			},
			type: this.formatTypeArguments(statement),
			filePath: sourceFilePropertiesGetter.getSourceFileProperties(statement).filePath
		}, IdentifierMapKind.NEW_EXPRESSION);

		mapper.set(map, statement);
		return map;
	}
}