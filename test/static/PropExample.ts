/*tslint:disable*/
declare type IPropObserverConsumer = any;
declare type IPropWaitersHost = any;

export declare type PropConsumer = IPropObserverConsumer&HTMLElement&IPropWaitersHost&{ isConnected: boolean };

export function prop<T extends PropConsumer> (model: T, prop: string): void {

	Object.defineProperty(model, prop, {
		get: function () {
			return (<T>this)[<keyof T>`_${prop}`];
		},
		set: async function (value: T[keyof T]) {
			const self = <T>this;
			const current = self[<keyof T>`_${prop}`];
			if (value !== current) {
				const normalizedValue = self.onBeforePropChanged != null ? self.onBeforePropChanged({prop, newValue: value}) : value;
				self[<keyof T>`_${prop}`] = normalizedValue;
				if (!self.isConnected) {
					self.propWaiters.push(() => {
						self.onPropChanged({prop, newValue: normalizedValue, oldValue: current});
						self.propSubscribers.forEach((subscriber: Function) => subscriber(prop, normalizedValue, current));
					});
				} else {
					await self.onPropChanged({prop, newValue: normalizedValue, oldValue: current});
					self.propSubscribers.forEach((subscriber: Function) => subscriber(prop, normalizedValue, current));
				}
			}
		},
		enumerable: true,
		configurable: false
	});
}
/*tslint:enable*/