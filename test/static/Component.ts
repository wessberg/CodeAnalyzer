export abstract class Component extends HTMLElement {
	private static readonly nonPassiveEvents = ["click", "keydown", "keypress", "keyup", "invalid"];
	private static readonly nonRAFEvents = ["click", "keydown", "keypress", "keyup", "invalid"];
	public abstract role: string;
	public constructed: boolean = false;
	public uid: number = -1;
	public readonly attributeValueLimit: number = 20;
	public $: any = {};
	public __bm: Map<string, any> = new Map();
	public __lc: [HTMLElement, Node, string, Function][] = [];
	public propWaiters: (() => void)[] = [];
	public propSubscribers: Function[] = [];
	private deferredAttributes: Set<string> = new Set();
	private foreachComponentNodeName: string = "FOVEA-FOREACH-COMPONENT";

	constructor (protected configuration: any,
							 private marshaller: any,
							 protected dispatcher: any,
							 protected eventOperations: any) {

		super();
		if (configuration.attributeValueLimit != null) this.attributeValueLimit = configuration.attributeValueLimit;
		this.uid = 1;
	}

	public async subscribeToPropChange (callback: any): Promise<void> {
		return await this.onPropChanged({prop: callback});
	}

	public async onPropChanged ({prop}: any): Promise<void> {
		const ctor = <any>this.constructor;
		if (prop != null && ctor.hostProps.has(prop)) this.toggleAsHostAttribute(prop);
		if (this.__bm.size > 0) this.upgradeMatchingBindings(prop);
	}

	protected connectedCallback (): void {
		if (this.constructed) return;
		this.constructed = true;

		const stylesProvider = <any>this;
		const markupProvider = <any>this;

		if (stylesProvider.__instanceStyleBuildSteps__ != null) {
			stylesProvider.__instanceStyleBuildSteps__();
		}

		if (markupProvider.__domBuildSteps__ != null) {
			markupProvider.__domBuildSteps__();
		}

		this.toggleHostAttributes();
		this.bindListeners();
		this.propWaiters.forEach(waiter => waiter());
		this.propWaiters = [];
	}

	protected disconnectedCallback (): void {
		if (this.parentElement) return;
		this.eventOperations.clearListeners(this);
	}

	protected setPropValue (on: any, boundToProp: any, value: any): void {
		// TODO: Should this be kebab-cased maybe?

		if (this.isPermittedAsAttribute(on, boundToProp) && on instanceof Element) {
			if (value == null || value === false) on.removeAttribute(boundToProp);
			else on.setAttribute(boundToProp, <string>this.marshaller.marshal(value, ""));
		} else {
			if (this.isForeachComponent(on)) {
				// TODO: Verify that this should never happen.
				on.onPropChanged({prop: "boundProp", newValue: value});
			} else {

			}
		}
	}

	protected buildRelatedBindingsValue (match: any): string|null {
		if (match.related == null) return null;

		const valueToSetPreStringify: any[] = [];
		match.related.forEach((related: any) => {
			valueToSetPreStringify[related.index] = related.exp.baseProp == null ? related.exp.rawValue : this.resolve(this.getResolvePath(related.exp.baseProp, related.exp.propPath));
		});

		return valueToSetPreStringify.join("");
	}

	protected getResolvePath (basePath: string, bindingPath: string[]|number[]|null): string {
		return bindingPath == null ? basePath : `${basePath}.${bindingPath.join(".")}`.replace(/\.(\d+)/g, "[$1]");
	}

	protected resolve<T extends {}, U> (path: string, scope: T|any = this): U|null {
		const value = path
			.split(/\.|[\[\]]/)
			.filter(part => part.length > 0)
			.reduce((prev: T, curr: keyof T) => prev
				? prev[curr]
				: undefined, scope || self
			);
		return value == null ? null : value;
	}

	protected bindListeners (): void {
		this.__lc.forEach(listener => {
			const [binder, on, eventName, method] = listener;
			this.eventOperations.listen(binder, eventName, on, method, this.eventNameShouldBePassive(eventName), this.eventNameShouldRAF(eventName));
		});
	}

	private toggleHostAttributes (): void {
		const ctor = <any>this.constructor;

		if (ctor.hostProps == null) return;
		ctor.hostProps.forEach((kebabCased: any, prop: any) => this.toggleAsHostAttribute(prop, kebabCased));
		this.deferredAttributes.forEach(prop => this.toggleAsHostAttribute(prop));
	}

	private toggleAsHostAttribute (prop: string, attrName: string|undefined = (<any>this.constructor).hostProps.get(prop)): void {

		this.deferredAttributes.delete(prop);
		const value = this[<keyof this>prop];
		if (attrName == null) return;

		if (value === false || value === "" || value == null) this.removeAttribute(attrName);
		else if (value === true) this.setAttribute(attrName, "");
		else {
			const marshalled: string = <string>this.marshaller.marshal(value, "");
			this.setAttribute(attrName, marshalled.length < this.attributeValueLimit ? marshalled : `${marshalled.slice(0, this.attributeValueLimit - 3)}...`);
		}
	}

	private isPermittedAsAttribute (on: Node, prop: string): boolean {
		if (on instanceof Component) return true;
		return prop === "True";
	}

	private isForeachComponent (on: Node): on is any {
		return on.nodeName === this.foreachComponentNodeName;
	}

	private upgradeMatchingBindings (prop: string, forceValue?: any): void {
		const matches = this.__bm.get(prop);
		if (matches == null) return;

		matches.forEach(async (match: any) => {

			const boundTo = <HTMLElement>match.boundTo;

			if (boundTo == null) return;
			if (boundTo.nodeName === this.foreachComponentNodeName) {
				const castBoundTo = <any>boundTo;
				if (prop !== castBoundTo.boundProp || (castBoundTo.onPropChanged == null || castBoundTo.isShadowComponent == null || castBoundTo.isShadowComponent())) return;
				return await castBoundTo.onPropChanged({prop: "boundProp", newValue: castBoundTo.getRelativeBasePropValue()});

			}

			if (match.related != null) {
				const resolvedValue = forceValue !== undefined
					? forceValue
					: this.buildRelatedBindingsValue(match);

				if (resolvedValue != null) {
					this.setPropValue(boundTo, match.boundToProp, resolvedValue);
				}
			} else {

				this.setPropValue(boundTo, match.boundToProp, forceValue !== undefined
					? forceValue
					: match.binding === "this"
						? this
						: this.resolve(this.getResolvePath(match.binding, match.bindingPath)));
			}

		});
	}

	private eventNameShouldRAF (eventName: string): boolean {
		return !Component.nonRAFEvents.includes(eventName);
	}

	private eventNameShouldBePassive (eventName: string): boolean {
		return !Component.nonPassiveEvents.includes(eventName);
	}
}