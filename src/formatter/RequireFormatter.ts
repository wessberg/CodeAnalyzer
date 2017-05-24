import {CallExpression, ExternalModuleReference, VariableDeclaration, VariableDeclarationList, VariableStatement} from "typescript";
import {ICallExpression, ICodeAnalyzer, IdentifierMapKind, IRequire} from "../service/interface/ICodeAnalyzer";
import {IRequireFormatter} from "./interface/IRequireFormatter";
import {ICallExpressionFormatter} from "./interface/ICallExpressionFormatter";
import {IStringUtil} from "../util/interface/IStringUtil";
import {ModuleFormatter} from "./ModuleFormatter";
import {IFileLoader} from "@wessberg/fileloader";
import {isCallExpression, isExternalModuleReference, isICallExpression, isParenthesizedExpression, isVariableDeclaration, isVariableDeclarationList, isVariableStatement} from "../predicate/PredicateFunctions";
import {IValueableFormatter} from "./interface/IValueableFormatter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";

export class RequireFormatter extends ModuleFormatter implements IRequireFormatter {

	constructor (private languageService: ICodeAnalyzer,
							 private sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 private valueableFormatter: IValueableFormatter,
							 private callExpressionFormatter: ICallExpressionFormatter,
							 protected stringUtil: IStringUtil,
							 fileLoader: IFileLoader) {
		super(stringUtil, fileLoader);
	}
	/**
	 * Formats the given CallExpression and returns an IRequire.
	 * @param {CallExpression} statement
	 * @returns {IRequire}
	 */
	public format (statement: CallExpression|VariableStatement|VariableDeclaration|VariableDeclarationList|ExternalModuleReference|ICallExpression): IRequire|null {
		if (isICallExpression(statement)) return this.formatCallExpression(statement);
		else if (isExternalModuleReference(statement)) return this.formatExternalModuleReference(statement);
		else if (isCallExpression(statement)) return this.formatCallExpression(statement);
		else if (isVariableStatement(statement)) return this.formatVariableStatement(statement);
		else if (isVariableDeclaration(statement)) return this.formatVariableDeclaration(statement);
		else if (isVariableDeclarationList(statement)) return this.formatVariableDeclarationList(statement);
		return null;
	}

	private formatExternalModuleReference (statement: ExternalModuleReference): IRequire {
		const {filePath} = this.sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const {expression} = statement;
		if (expression == null) throw new ReferenceError(`${this.constructor.name} could not extract a require path for an ImportEquals expression!`);
		const value = this.valueableFormatter.format(expression);

		const relativePath = () => {
			const relative = this.stringUtil.stripQuotesIfNecessary(value.hasDoneFirstResolve()
				? value.resolved
				: value.resolve());

			if (relative == null || relative.toString().length < 1) {
				throw new TypeError(`${RequireFormatter.constructor.name} detected a require statement with an empty path in file: ${filePath} on index ${statement.pos}`);
			}
			return relative.toString();
		};

		const fullPath = () => {
			const relative = relativePath();
			return this.formatFullPathFromRelative(filePath, relative);
		};

		const payload = () => {
			const path = fullPath();
			return {
				___kind: IdentifierMapKind.LITERAL,
				startsAt: statement.pos,
				endsAt: statement.end,
				value: () => this.moduleToNamespacedObjectLiteral(this.languageService.getExportDeclarationsForFile(path, true))
			};
		};

		const map: IRequire = {
			___kind: IdentifierMapKind.REQUIRE_CALL,
			startsAt: statement.parent == null ? statement.pos : statement.parent.pos,
			endsAt: statement.parent == null ? statement.end : statement.parent.end,
			relativePath,
			fullPath,
			filePath,
			payload,
			arguments: {
				startsAt: statement.pos,
				endsAt: statement.end,
				argumentsList: []
			}
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.REQUIRE_CALL,
			enumerable: false
		});
		return map;
	}

	private formatVariableDeclaration (statement: VariableDeclaration): IRequire|null {
		const {initializer} = statement;
		if (initializer == null) return null;
		if (isCallExpression(initializer)) return this.formatCallExpression(initializer);
		if (isParenthesizedExpression(initializer) && isCallExpression(initializer.expression)) return this.formatCallExpression(initializer.expression);
		if (isVariableStatement(initializer)) return this.formatVariableStatement(initializer);
		if (isVariableDeclaration(initializer)) return this.formatVariableDeclaration(initializer);
		if (isVariableDeclarationList(initializer)) return this.formatVariableDeclarationList(initializer);
		return null;
	}

	private formatVariableDeclarationList (list: VariableDeclarationList): IRequire|null {
		for (const declaration of list.declarations) {
			const formatted = this.formatVariableDeclaration(declaration);
			if (formatted != null) return formatted;
		}
		return null;
	}

	private formatVariableStatement (statement: VariableStatement): IRequire|null {
		return this.formatVariableDeclarationList(statement.declarationList);
	}

	private formatCallExpression (statement: CallExpression|ICallExpression): IRequire|null {
		const formatted = isICallExpression(statement) ? statement : this.callExpressionFormatter.format(statement);
		if (formatted.identifier !== "require") return null;

		const firstArgumentValue = formatted.arguments.argumentsList[0].value;
		const relativePath = () => {
			const relative = this.stringUtil.stripQuotesIfNecessary(firstArgumentValue == null
				? ""
				: firstArgumentValue.hasDoneFirstResolve()
					? firstArgumentValue.resolved
					: firstArgumentValue.resolve());

			if (relative == null || relative.toString().length < 1) {
				throw new TypeError(`${RequireFormatter.constructor.name} detected a require statement with an empty path in file: ${formatted.filePath} on index ${formatted.startsAt}`);
			}
			return relative.toString();
		};

		const fullPath = () => {
			const relative = relativePath();
			return this.formatFullPathFromRelative(formatted.filePath, relative);
		};

		const payload = () => {
			const path = fullPath();
			return {
				___kind: IdentifierMapKind.LITERAL,
				startsAt: isICallExpression(statement) ? statement.startsAt : statement.pos,
				endsAt: isICallExpression(statement) ? statement.endsAt : statement.end,
				value: () => this.moduleToNamespacedObjectLiteral(this.languageService.getExportDeclarationsForFile(path, true))
			};
		};

		const map: IRequire = {
			___kind: IdentifierMapKind.REQUIRE_CALL,
			startsAt: isICallExpression(statement) ? statement.startsAt : statement.pos,
			endsAt: isICallExpression(statement) ? statement.endsAt : statement.end,
			relativePath,
			fullPath,
			filePath: formatted.filePath,
			payload,
			arguments: formatted.arguments
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.REQUIRE_CALL,
			enumerable: false
		});
		return map;
	}

}