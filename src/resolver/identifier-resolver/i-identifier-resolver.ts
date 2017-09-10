import {FormattedExpression} from "@wessberg/type";

export interface IIdentifierResolver {
	resolve (identifier: FormattedExpression): FormattedExpression|undefined;
}