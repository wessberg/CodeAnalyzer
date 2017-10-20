export interface IObjectBindingElementCtor {
	name: string;
	propertyName: string|null|undefined;
	initializer: string|null|undefined;
	isRestSpread: boolean;
}