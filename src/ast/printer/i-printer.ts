import {SourceFile, Node} from "typescript";

export interface IPrinter {
	print (sourceFile: SourceFile): string;
	stringify (node: Node): string;
}