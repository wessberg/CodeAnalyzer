/*tslint:disable*/
import {ITypeDetector} from "@wessberg/typedetector";

interface GenericArrayProxyObserver<T> {
	[key: string]: T;
}

interface GenericArrayHolder<T> {
	[key: string]: T;
}

interface IPropMutationOwner<T> {
	[key: string]: T;
}

interface IProxyObserverConsumer {
	
}

declare enum PropMutationKind {
	SPLICE
}

declare type TargetValue = any;

class SuperClass {
	async onChange (a: any, b: any, c: any, d: any, e: any, f: any) {
		console.log(a,b,c,d,e,f);
	}
	
	protected normalizeKey (key: any) {
		return key;
	}
	
	protected determineKey (key: any, value: any) {
		return key + value;
	}
}

export class ArrayProxyObserverHandler extends SuperClass {

	constructor (private typeDetector: ITypeDetector) {
		super();
	}

	public async onChange<T extends GenericArrayProxyObserver<T>> (consumer: T, target: T[keyof T] | null, key: number, prop: keyof T, value: TargetValue[], root?: IPropMutationOwner<T>): Promise<void> {
		return await super.onChange(consumer, target, key, prop, value, root);
	}

	public async onDeleteProperty<T extends GenericArrayProxyObserver<T>> (consumer: T, target: T[keyof T] | null, key: number, prop: keyof T, root?: IPropMutationOwner<T>): Promise<void> {
		const value = (<GenericArrayHolder<T>>target)[key];
		const normalized = <number>this.normalizeKey(key);
		// For pure garbage collection-related purposes. TS doesn't like it.
		// target[normalized] = null;
		if (this.typeDetector.isNumber(normalized)) (<T[]>(<any>target)).splice(normalized, 1);
		return this.onChange(consumer, target, key, prop, <any>value, root);
	}

	public determineKind (): PropMutationKind {
		return PropMutationKind.SPLICE;
	}

	public shouldIgnore<T extends IProxyObserverConsumer> (target: T[keyof T] | null, key: PropertyKey, value?: TargetValue): boolean {
		const normalized = this.determineKey(key, value);
		if (!this.typeDetector.isNumber(normalized)) return false;

		return key === "length" && target != null && (<GenericArrayHolder<T>>target)[normalized] === undefined;
	}

}
/*tslint:enable*/