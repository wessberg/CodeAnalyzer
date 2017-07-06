import {BinaryExpression, Expression, ExpressionStatement, Node, Statement} from "typescript";
import {IMutationDeclaration} from "../../identifier/interface/IIdentifier";

export interface IMutationGetter {
	getForFile (fileName: string, deep?: boolean): IMutationDeclaration[];
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): IMutationDeclaration[];
	get (statement: BinaryExpression|ExpressionStatement): IMutationDeclaration|null;
}