import {BinaryExpression, ExpressionStatement} from "typescript";
import {IMutationDeclaration} from "../../service/interface/ICodeAnalyzer";

export interface IMutationFormatter {
	format (statement: BinaryExpression|ExpressionStatement): IMutationDeclaration|null;
}