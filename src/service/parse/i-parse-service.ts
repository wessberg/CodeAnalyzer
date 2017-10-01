import {Block, Node, NodeArray, TypeNode, TypeParameterDeclaration} from "typescript";

export interface IParseService {
	parse<T extends Node = Node> (expression: string): NodeArray<T>;
	parseOne<T extends Node = Node> (expression: string): T;
	parseType (type: string): TypeNode;
	parseBlock (block: string): Block;
	parseTypeParameterDeclaration (type: string): TypeParameterDeclaration;
}