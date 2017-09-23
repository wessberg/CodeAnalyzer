import {Node} from "typescript";
export interface INodeMatcherUtil {
	match (node: Node, matchWithin: Node[]): Node|undefined;
}