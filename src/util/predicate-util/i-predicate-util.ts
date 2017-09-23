import {Node} from "typescript";

export interface IPredicateUtil {
	/*tslint:disable:no-any*/
	isObject (item: any): item is {[key: string]: any};
	isNode (item: any): item is Node;
	/*tslint:enable:no-any*/
}