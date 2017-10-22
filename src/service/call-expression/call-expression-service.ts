import {ICallExpressionService} from "./i-call-expression-service";
import {CallExpression, createNodeArray, createStatement, Expression, ExpressionStatement, isCallExpression, isExpressionStatement, isExpressionWithTypeArguments, isIdentifier, isPropertyAccessExpression, NodeArray, SourceFile, SyntaxKind} from "typescript";
import {IPrinter, ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {NodeService} from "../node/node-service";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {IRemover} from "../../remover/i-remover-base";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IUpdater} from "../../updater/i-updater-getter";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {PropertyAccessCallExpression} from "./property-access-call-expression";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ICallExpressionCtor} from "../../light-ast/ctor/call-expression/i-call-expression-ctor";
import {IPlacement} from "../../placement/i-placement";

/**
 * A class for working with CallExpressions
 */
export class CallExpressionService extends NodeService<CallExpression> implements ICallExpressionService {
	/**
	 * Returns an iterable of the stringified argument expressions
	 * @param {CallExpression} callExpression
	 * @returns {Iterable<string>}
	 */
	public getArguments (callExpression: CallExpression): Iterable<string> {
		return callExpression.arguments.map(arg => this.printer.print(arg));
	}

	/**
	 * Creates a new CallExpression
	 * @param {ICallExpressionCtor} options
	 * @returns {CallExpression}
	 */
	public createCallExpression (options: ICallExpressionCtor): CallExpression {
		return this.formatter.formatCallExpression(options);
	}

	/**
	 * Creates and adds a CallExpression to a SourceFile
	 * @param {ICallExpressionCtor} options
	 * @param {SourceFile} sourceFile
	 * @param {IPlacement} [placement]
	 * @returns {CallExpression}
	 */
	public createAndAddCallExpression (options: ICallExpressionCtor, sourceFile: SourceFile, placement?: IPlacement): CallExpression {
		const callExpression = this.createCallExpression(options);

		// Update the SourceFile to reflect the change
		this.updater.updateSourceFileStatements(
			this.joiner.joinStatementNodeArrays(createNodeArray([createStatement(callExpression)]), sourceFile.statements, placement),
			sourceFile
		);

		return callExpression;
	}

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.CallExpression];

	constructor (private printer: IPrinter,
							 private formatter: IFormatter,
							 private updater: IUpdater,
							 private joiner: IJoiner,
							 astUtil: ITypescriptASTUtil,
							 languageService: ITypescriptLanguageService,
							 decoratorService: IDecoratorService,
							 remover: IRemover) {
		super(decoratorService, languageService, remover, astUtil);
	}

	/**
	 * Returns true if an argument is provided to the CallExpression on the provided index
	 * @param {number} index
	 * @param {CallExpression} callExpression
	 * @returns {boolean}
	 */
	public hasArgumentOnIndex (index: number, callExpression: CallExpression): boolean {
		return callExpression.arguments[index] != null;

	}

	/**
	 * Sets the expression as an argument on the provided index position.
	 * It fills out any index positions in between the last given argument and the position to fill out
	 * with undefined
	 * @param {number} argumentIndex
	 * @param {string} expression
	 * @param {CallExpression} callExpression
	 * @returns {CallExpression}
	 */
	public setArgumentExpressionOnArgumentIndex (argumentIndex: number, expression: string, callExpression: CallExpression): CallExpression {
		// Make sure that the index is non-negative
		if (argumentIndex < 0) {
			throw new RangeError(`${this.constructor.name} could not set an argument expression on the provided argument index: ${argumentIndex}: It must be non-negative`);
		}

		// Format the argument expression
		const formatted = this.formatter.formatExpression(expression);

		// If the argument index is below the length, we can simply replace the element on the given index position
		if (argumentIndex < callExpression.arguments.length) {
			this.updater.replace(formatted, callExpression.arguments[argumentIndex]);
			return callExpression;
		}

		// Otherwise, we should append the expression on the provided index. Assign "undefined" as argument values in-between the
		// max item of the existing arguments and the argument index to assign to
		const amountOfElementsBetween = argumentIndex - callExpression.arguments.length;

		const newArguments: Expression[] = [];

		// For each place in-between, generate 'undefined' arguments
		for (let i = 0; i < amountOfElementsBetween; i++) {
			newArguments.push(this.formatter.formatExpression(`undefined`));
		}

		// Finally, append the new argument on the new position
		return this.updater.updateCallExpressionArguments(
			this.joiner.joinExpressionNodeArrays(createNodeArray([...newArguments, formatted]), callExpression.arguments),
			callExpression
		);
	}

	/**
	 * Gets the names of the Type arguments provided to a CallExpression
	 * @param {CallExpression} callExpression
	 * @returns {string[]}
	 */
	public getTypeArgumentNames (callExpression: CallExpression): string[] {
		return callExpression.typeArguments == null ? [] : callExpression.typeArguments.map(argument => isExpressionWithTypeArguments(argument) ? this.printer.print(argument.expression) : this.printer.print(argument));
	}

	/**
	 * Gets the CallExpressions on PropertyAccessExpressions matching the provided identifier and property
	 * @param {string} identifier
	 * @param {string} property
	 * @param {SourceFile} sourceFile
	 * @param {boolean} deep
	 * @returns {NodeArray<PropertyAccessCallExpression>}
	 */
	public getCallExpressionsOnPropertyAccessExpressionMatching (identifier: string, property: string|undefined, sourceFile: SourceFile, deep: boolean = true): NodeArray<PropertyAccessCallExpression> {
		const filtered = this.getAll(sourceFile, deep);
		return <NodeArray<PropertyAccessCallExpression>> createNodeArray(filtered.filter(callExpression => {
			if (!isPropertyAccessExpression(callExpression.expression)) return false;
			return isIdentifier(callExpression.expression.expression) && callExpression.expression.expression.text === identifier && property == null ? true : callExpression.expression.name.text === property;
		}));
	}

	/**
	 * Returns all CallExpressions where the base matches the provided Regular Expression
	 * @param {RegExp} match
	 * @param {SourceFile} sourceFile
	 * @param {boolean} deep
	 * @returns {NodeArray<CallExpression>}
	 */
	public getCallExpressionsMatching (match: RegExp, sourceFile: SourceFile, deep: boolean = true): NodeArray<CallExpression> {
		const filtered = this.getAll(sourceFile, deep);
		return createNodeArray(filtered.filter(callExpression => {
			return match.test(this.printer.print(callExpression.expression));
		}));
	}

	/**
	 * Gets all CallExpressions for the provided SourceFile
	 * @param {SourceFile} sourceFile
	 * @param {boolean} deep
	 * @returns {NodeArray<CallExpression>}
	 */
	public getAll (sourceFile: SourceFile, deep: boolean = true): NodeArray<CallExpression> {
		const match: NodeArray<CallExpression|ExpressionStatement> = this.astUtil.getFilteredStatements(sourceFile.statements, [SyntaxKind.CallExpression, SyntaxKind.ExpressionStatement], deep);

		// For all ExpressionStatements, check if their expressions are CallExpressions. If not, filter them out
		const filtered = match.filter(node => isExpressionStatement(node) ? isCallExpression(node.expression) : true);

		// Take all CallExpressions for all ExpressionStatements and otherwise return the CallExpressions. Make sure to deduplicate them
		return <NodeArray<CallExpression>> createNodeArray([...new Set(filtered.map(node => isExpressionStatement(node) ? node.expression : node))]);
	}
}