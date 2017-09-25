import {SourceFile, Node, NodeArray} from "typescript";

export interface IPrinter {
	print (sourceFile: SourceFile): string;
	stringify (node: Node|NodeArray<Node>): string;
}