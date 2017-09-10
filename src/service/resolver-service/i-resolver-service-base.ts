import {FormattedExpression} from "@wessberg/type";

export interface IResolverServiceBase {
	getDefinitionMatchingExpression (expression: FormattedExpression): FormattedExpression|undefined;
}