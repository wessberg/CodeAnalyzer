import {CallExpression} from "typescript";
import {INameGetter} from "../getter/interface/INameGetter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {ITypeExpressionGetter} from "../getter/interface/ITypeExpressionGetter";
import {IValueExpressionGetter} from "../getter/interface/IValueExpressionGetter";
import {IValueResolvedGetter} from "../getter/interface/IValueResolvedGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {ITokenSerializer} from "../serializer/interface/ITokenSerializer";
import {ICallExpression, IdentifierMapKind} from "../service/interface/ISimpleLanguageService";
import {ITracer} from "../tracer/interface/ITracer";
import {ITypeUtil} from "../util/interface/ITypeUtil";
import {CallableFormatter} from "./CallableFormatter";
import {IArgumentsFormatter} from "./interface/IArgumentsFormatter";
import {ICallExpressionFormatter} from "./interface/ICallExpressionFormatter";

export class CallExpressionFormatter extends CallableFormatter implements ICallExpressionFormatter {

	constructor (private mapper: IMapper,
							 private argumentsFormatter: IArgumentsFormatter,
							 private sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 tracer: ITracer,
							 valueExpressionGetter: IValueExpressionGetter,
							 valueResolvedGetter: IValueResolvedGetter,
							 nameGetter: INameGetter,
							 typeExpressionGetter: ITypeExpressionGetter,
							 tokenSerializer: ITokenSerializer,
							 typeUtil: ITypeUtil) {
		super(tracer, valueExpressionGetter, valueResolvedGetter, nameGetter, typeExpressionGetter, tokenSerializer, typeUtil);
	}

	/**
	 * Formats a CallExpression into an ICallExpression.
	 * @param {CallExpression} statement
	 * @returns {ICallExpression}
	 */
	public format (statement: CallExpression): ICallExpression {
		const map: ICallExpression = {
			...this.formatCallable(statement),
			___kind: IdentifierMapKind.CALL_EXPRESSION,
			startsAt: statement.pos,
			endsAt: statement.end,
			arguments: {
				startsAt: statement.arguments.pos,
				endsAt: statement.arguments.end,
				argumentsList: this.argumentsFormatter.format(statement)
			},
			type: this.formatTypeArguments(statement),
			filePath: this.sourceFilePropertiesGetter.getSourceFileProperties(statement).filePath
		};

		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.CALL_EXPRESSION,
			enumerable: false
		});
		this.mapper.set(map, statement);
		return map;
	}
}