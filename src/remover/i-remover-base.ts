import {DIContainer} from "@wessberg/di";
import {IRemoverBase} from "./i-remover";

export declare type IRemover = IRemoverBase;

/**
 * Wrap it inside of a Proxy to escape circular dependencies
 * @type {IFormatter}
 */
export const wrappedIRemover = <IRemover> new Proxy({}, {
	/**
	 * Hook on to every 'get' call
	 * @param {IRemoverBase} _
	 * @param {string} key
	 * @returns {IRemover}
	 */
	get (_: IRemoverBase, key: keyof IRemoverBase) {return DIContainer.get<IRemoverBase>()[key];}
});