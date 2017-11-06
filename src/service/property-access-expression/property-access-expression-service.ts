import {IPropertyAccessExpressionService} from "./i-property-access-expression-service";
import {PropertyAccessExpression, SyntaxKind} from "typescript";
import {IPrinter, ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {NodeService} from "../node/node-service";
import {IRemover} from "../../remover/i-remover-base";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {IUpdater} from "../../updater/i-updater-getter";

/**
 * A service for working with PropertyAccessExpressions
 */
export class PropertyAccessExpressionService extends NodeService<PropertyAccessExpression> implements IPropertyAccessExpressionService {
	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.PropertyAccessExpression];

	constructor (private printer: IPrinter,
							 joiner: IJoiner,
							 updater: IUpdater,
							 astUtil: ITypescriptASTUtil,
							 decoratorService: IDecoratorService,
							 languageService: ITypescriptLanguageService,
							 remover: IRemover) {
		super(decoratorService, languageService, joiner, updater, remover, astUtil);
	}

	/**
	 * Gets the name of the property in a PropertyAccessExpression
	 * @param {PropertyAccessExpression} expression
	 * @returns {string}
	 */
	public getPropertyName (expression: PropertyAccessExpression): string {
		return expression.name.text;
	}

	/**
	 * Gets the name of the identifier of a PropertyAccessExpression
	 * @param {PropertyAccessExpression} expression
	 * @returns {string}
	 */
	public getIdentifierName (expression: PropertyAccessExpression): string {
		return this.printer.print(expression.expression);
	}

}