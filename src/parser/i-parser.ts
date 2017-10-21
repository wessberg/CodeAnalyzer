import {Block, Expression, Node, NodeArray, Statement, TypeNode, TypeParameterDeclaration} from "typescript";

export interface IParser {
	parse<T extends Node = Node> (expression: string): NodeArray<T>;
	parseExpression (expression: string): Expression;
	parseStatement (statement: string): Statement;
	parseOne<T extends Node = Node> (expression: string): T;
	parseType (type: string): TypeNode;
	parseBlock (block: string): Block;
	parseTypeParameterDeclaration (type: string): TypeParameterDeclaration;
}