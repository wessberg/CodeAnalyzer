import {Node} from "typescript";
export interface INodeMatcherUtil {
	match (node: Node, matchWithin: Node[]): Node|undefined;
	matchIndex (node: Node, matchWithin: Node[]): number;
}