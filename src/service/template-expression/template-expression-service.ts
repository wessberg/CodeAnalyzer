import {NodeService} from "../node/node-service";
import {isNoSubstitutionTemplateLiteral, isStringLiteral, LiteralExpression, NoSubstitutionTemplateLiteral, StringLiteral, SyntaxKind, TemplateExpression, TemplateHead, TemplateMiddle, TemplateSpan, TemplateTail} from "typescript";
import {ITemplateExpressionService} from "./i-template-expression-service";

/**
 * A service for working with TemplateExpressions
 */
export class TemplateExpressionService extends NodeService<TemplateExpression> implements ITemplateExpressionService {

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.TemplateExpression, SyntaxKind.NoSubstitutionTemplateLiteral];

	/**
	 * Stringifies the provided TemplateExpression
	 * @param {TemplateExpression|NoSubstitutionTemplateLiteral|LiteralExpression} node
	 * @returns {string}
	 */
	public stringify (node: TemplateExpression|NoSubstitutionTemplateLiteral|StringLiteral|LiteralExpression): string {
		// If it is a simple template string with substitutions, everything is available on the "text" property
		if (isNoSubstitutionTemplateLiteral(node) || isStringLiteral(node)) {
			return node.text;
		}

		// Otherwise, build up the string
		return `${this.stringifyTemplateHead(node.head)}${node.templateSpans.map(span => this.stringifyTemplateSpan(span)).join("")}`;
	}

	/**
	 * Stringifies the provided TemplateSpan
	 * @param {TemplateSpan} node
	 * @returns {string}
	 */
	private stringifyTemplateSpan (node: TemplateSpan): string {
		return `\${${node.expression.getFullText()}}${node.literal.kind === SyntaxKind.TemplateTail ? this.stringifyTemplateTail(node.literal) : this.stringifyTemplateMiddle(node.literal)}`;
	}

	/**
	 * Stringifies the provided TemplateHead
	 * @param {TemplateHead} node
	 * @returns {string}
	 */
	private stringifyTemplateHead (node: TemplateHead): string {
		return node.text;
	}

	/**
	 * Stringifies the provided TemplateMiddle
	 * @param {TemplateMiddle} node
	 * @returns {string}
	 */
	private stringifyTemplateMiddle (node: TemplateMiddle): string {
		return node.text;
	}

	/**
	 * Stringifies the provided TemplateTail
	 * @param {TemplateTail} node
	 * @returns {string}
	 */
	private stringifyTemplateTail (node: TemplateTail): string {
		return node.text;
	}
}