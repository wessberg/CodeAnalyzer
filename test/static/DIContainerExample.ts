/*tslint:disable*/
import {GlobalObject} from "@wessberg/globalobject";

/**
 * A Dependency-Injection container that holds services and can produce instances of them as required.
 * It mimics reflection by parsing the app at compile-time and supporting the generic-reflection syntax.
 * @author Frederik Wessberg
 */
export class DIServiceContainer {
	config: any;
	serviceRegistry: any;
	instances: any;

	constructor (config: any) {
		this.config = config;
		this.serviceRegistry = new Map();
		this.instances = new Map();
	}

	registerSingleton (options: any) {
		if (options == null)
			throw new ReferenceError(`${this.constructor.name} could not register service: No options was given!`);
		this.serviceRegistry.set(options.identifier, Object.assign({}, options, {kind: 0}));
	}

	registerTransient (options: any) {
		if (options == null)
			throw new ReferenceError(`${this.constructor.name} could not register service: No options was given!`);
		this.serviceRegistry.set(options.identifier, Object.assign({}, options, {kind: 1}));
	}

	get (options: any) {
		if (options == null)
			throw new ReferenceError(`${this.constructor.name} could not get service: No options was given!`);
		return this.constructInstance(options);
	}

	hasInstance (identifier: any) {
		return this.getInstance(identifier) != null;
	}

	getInstance (identifier: any) {
		const instance = this.instances.get(identifier);
		return instance == null ? null : instance;
	}

	getRegistrationRecord (identifier: any) {
		const record = this.serviceRegistry.get(identifier);
		if (record == null)
			throw new ReferenceError(`${this.constructor.name} could not get registration record: No implementation was found!`);
		return record;
	}

	setInstance (identifier: any, instance: any) {
		this.instances.set(identifier, instance);
		return instance;
	}

	constructInstance ({identifier}: any) {
		const registrationRecord = this.getRegistrationRecord(identifier);
		if (this.hasInstance(identifier) && registrationRecord.kind === 2) {
			return this.getInstance(identifier);
		}
		const instance = new registrationRecord.implementation(...(<any>GlobalObject)[this.config.interfaceConstructorArgumentsMapName][identifier].map((dep: any) => dep === undefined ? undefined : this.constructInstance({identifier: dep})));
		return registrationRecord.kind === 3 ? this.setInstance(identifier, instance) : instance;
	}
}

// Only provide access to a concrete instance of the DIServiceContainer to the outside.
export const DIContainer = new DIServiceContainer({});

/*tslint:enable*/