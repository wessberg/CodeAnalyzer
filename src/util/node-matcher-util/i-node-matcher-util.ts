import {NodeMatcherItem} from "./node-matcher-item";

export interface INodeMatcherUtil {
	match <T extends NodeMatcherItem> (node: T, matchWithin: Iterable<T>): T|undefined;
	matchIndex<T extends NodeMatcherItem> (node: T, matchWithin: Iterable<T>): number;
}