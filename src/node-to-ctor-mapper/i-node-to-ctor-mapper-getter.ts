import {DIContainer} from "@wessberg/di";
import {INodeToCtorMapperBase} from "./i-node-to-ctor-mapper";

export declare type INodeToCtorMapper = INodeToCtorMapperBase;

/**
 * Wrap it inside of a Proxy to escape circular dependencies
 * @type {INodeToCtorMapperBase}
 */
export const wrappedINodeToCtorMapper = <INodeToCtorMapperBase> new Proxy({}, {
	/**
	 * Hook on to every 'get' call
	 * @param {INodeToCtorMapperBase} _
	 * @param {string} key
	 * @returns {INodeToCtorMapper}
	 */
	get (_: INodeToCtorMapperBase, key: keyof INodeToCtorMapperBase) {
		return DIContainer.get<INodeToCtorMapperBase>()[key];
	}
});