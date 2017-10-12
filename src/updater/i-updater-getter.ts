import {DIContainer} from "@wessberg/di";
import {IUpdaterBase} from "./i-updater";

export declare type IUpdater = IUpdaterBase;

/**
 * Wrap it inside of a Proxy to escape circular dependencies
 * @type {IFormatter}
 */
export const wrappedIUpdater = <IUpdater> new Proxy({}, {
	/**
	 * Hook on to every 'get' call
	 * @param {IUpdaterBase} _
	 * @param {string} key
	 * @returns {IUpdater}
	 */
	get (_: IUpdaterBase, key: keyof IUpdaterBase) {return DIContainer.get<IUpdaterBase>()[key];}
});