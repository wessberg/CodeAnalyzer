import {NewExpression} from "typescript";
import {INameGetter} from "../getter/interface/INameGetter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {ITypeExpressionGetter} from "../getter/interface/ITypeExpressionGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {ITokenSerializer} from "../serializer/interface/ITokenSerializer";
import {IdentifierMapKind, INewExpression} from "../service/interface/ICodeAnalyzer";
import {ITypeUtil} from "../util/interface/ITypeUtil";
import {CallableFormatter} from "./CallableFormatter";
import {IArgumentsFormatter} from "./interface/IArgumentsFormatter";
import {INewExpressionFormatter} from "./interface/INewExpressionFormatter";
import {IValueableFormatter} from "./interface/IValueableFormatter";

export class NewExpressionFormatter extends CallableFormatter implements INewExpressionFormatter {

	constructor (private mapper: IMapper,
							 private argumentsFormatter: IArgumentsFormatter,
							 private sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 valueableFormatter: IValueableFormatter,
							 nameGetter: INameGetter,
							 typeExpressionGetter: ITypeExpressionGetter,
							 tokenSerializer: ITokenSerializer,
							 typeUtil: ITypeUtil) {
		super(valueableFormatter, nameGetter, typeExpressionGetter, tokenSerializer, typeUtil);
	}

	/**
	 * Formats a NewExpression into an INewExpression.
	 * @param {NewExpression} statement
	 * @returns {INewExpression}
	 */
	public format (statement: NewExpression): INewExpression {

		const map: INewExpression = {
			...this.formatCallable(statement),
			___kind: IdentifierMapKind.NEW_EXPRESSION,
			originalStatement: statement,
			startsAt: statement.pos,
			endsAt: statement.end,
			arguments: {
				startsAt: statement.arguments == null ? -1 : statement.arguments.pos,
				endsAt: statement.arguments == null ? -1 : statement.arguments.end,
				argumentsList: this.argumentsFormatter.format(statement)
			},
			type: this.formatTypeArguments(statement),
			filePath: this.sourceFilePropertiesGetter.getSourceFileProperties(statement).filePath
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.NEW_EXPRESSION,
			enumerable: false
		});
		this.mapper.set(map, statement);
		return map;
	}
}