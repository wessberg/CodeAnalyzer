import {DIContainer} from "@wessberg/di";
import {INodeToDictMapperBase} from "./i-node-to-dict-mapper";

export declare type INodeToDictMapper = INodeToDictMapperBase;

/**
 * Wrap it inside of a Proxy to escape circular dependencies
 * @type {INodeToDictMapperBase}
 */
export const wrappedINodeToDictMapper = <INodeToDictMapperBase> new Proxy({}, {
	/**
	 * Hook on to every 'get' call
	 * @param {INodeToDictMapperBase} _
	 * @param {string} key
	 * @returns {INodeToDictMapper}
	 */
	get (_: INodeToDictMapperBase, key: keyof INodeToDictMapperBase) {
		return DIContainer.get<INodeToDictMapperBase>()[key];
	}
});