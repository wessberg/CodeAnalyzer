import {BinaryExpression, ExpressionStatement} from "typescript";
import {IMutationDeclaration} from "../../identifier/interface/IIdentifier";

export interface IMutationFormatter {
	format (statement: BinaryExpression|ExpressionStatement): IMutationDeclaration|null;
}