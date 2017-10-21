export interface ICallExpressionCtor {
	expression: string;
	typeArguments: Iterable<string>|null;
	arguments: Iterable<string>|null;
}