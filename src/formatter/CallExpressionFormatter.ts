import {CallableFormatter} from "./CallableFormatter";
import {ICallExpressionFormatter} from "./interface/ICallExpressionFormatter";
import {ICallExpression, IdentifierMapKind} from "../service/interface/ISimpleLanguageService";
import {CallExpression} from "typescript";
import {IArgumentsFormatter} from "./interface/IArgumentsFormatter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {ITracer} from "../tracer/interface/ITracer";
import {IValueExpressionGetter} from "../getter/interface/IValueExpressionGetter";
import {IValueResolvedGetter} from "../getter/interface/IValueResolvedGetter";
import {INameGetter} from "../getter/interface/INameGetter";
import {ITypeExpressionGetter} from "../getter/interface/ITypeExpressionGetter";
import {ITokenSerializer} from "../serializer/interface/ITokenSerializer";
import {ITypeUtil} from "../util/interface/ITypeUtil";

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