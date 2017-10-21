import {ComputedPropertyName} from "typescript";

export interface IComputedPropertyNameService {
	getExpression (computedPropertyName: ComputedPropertyName): string;
}