import {INodeService} from "../node/i-node-service";
import {LiteralExpression, NoSubstitutionTemplateLiteral, StringLiteral, TemplateExpression} from "typescript";

export interface ITemplateExpressionService extends INodeService<TemplateExpression> {
	stringify (expression: TemplateExpression|NoSubstitutionTemplateLiteral|StringLiteral|LiteralExpression): string;
}