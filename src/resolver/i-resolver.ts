import {Identifier, Node, SourceFile} from "typescript";

export interface IResolverBase {
	resolve (identifier: Identifier|string, sourceFile: SourceFile): Node|undefined;
}