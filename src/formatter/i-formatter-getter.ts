import {IFormatterBase} from "./i-formatter";
import {DIContainer} from "@wessberg/di";

export declare type IFormatter = IFormatterBase;

/**
 * Wrap it inside of a Proxy to escape circular dependencies
 * @type {IFormatter}
 */
export const wrappedIFormatter = <IFormatter> new Proxy({}, {
	/**
	 * Hook on to every 'get' call
	 * @param {IFormatterBase} _
	 * @param {string} key
	 * @returns {IFormatter}
	 */
	get (_: IFormatterBase, key: keyof IFormatterBase) {
		return DIContainer.get<IFormatterBase>()[key];
	}
});