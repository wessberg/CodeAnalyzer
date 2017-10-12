import {DIContainer} from "@wessberg/di";
import {IJoinerBase} from "./i-joiner";

export declare type IJoiner = IJoinerBase;

/**
 * Wrap it inside of a Proxy to escape circular dependencies
 * @type {IFormatter}
 */
export const wrappedIJoiner = <IJoiner> new Proxy({}, {
	/**
	 * Hook on to every 'get' call
	 * @param {IJoinerBase} _
	 * @param {string} key
	 * @returns {IJoiner}
	 */
	get (_: IJoinerBase, key: keyof IJoinerBase) {return DIContainer.get<IJoinerBase>()[key];}
});