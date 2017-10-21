import {DIContainer} from "@wessberg/di";
import {IResolverBase} from "./i-resolver";

export declare type IResolver = IResolverBase;

/**
 * Wrap it inside of a Proxy to escape circular dependencies
 * @type {IFormatter}
 */
export const wrappedIResolver = <IResolver> new Proxy({}, {
	/**
	 * Hook on to every 'get' call
	 * @param {IResolverBase} _
	 * @param {string} key
	 * @returns {IResolver}
	 */
	get (_: IResolverBase, key: keyof IResolverBase) {
		return DIContainer.get<IResolverBase>()[key];
	}
});