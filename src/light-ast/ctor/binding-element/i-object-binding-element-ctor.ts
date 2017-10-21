export interface IObjectBindingElementCtor {
	name: string;
	propertyName: string|null;
	initializer: string|null;
	isRestSpread: boolean;
}