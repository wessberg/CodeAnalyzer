import {IDecoratorCtor} from "../decorator/i-decorator-ctor";
import {BindingNameCtor} from "../binding-name/binding-name-ctor";

export interface IParameterCtor {
	type: string|null;
	initializer: string|null;
	isRestSpread: boolean;
	isOptional: boolean;
	isReadonly: boolean;
	decorators: Iterable<IDecoratorCtor>|null;
	name: BindingNameCtor;
}