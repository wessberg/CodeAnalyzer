import {ArrowFunction, ConstructorDeclaration, FunctionDeclaration, GetAccessorDeclaration, MethodDeclaration, SetAccessorDeclaration} from "typescript";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {isBlockDeclaration, isReturnStatement} from "../predicate/PredicateFunctions";
import {IFunctionLike, IMemberDeclaration, IParametersable, IValueable} from "../service/interface/ICodeAnalyzer";
import {IDecoratorsFormatter} from "./interface/IDecoratorsFormatter";
import {IFunctionLikeFormatter} from "./interface/IFunctionLikeFormatter";
import {IModifiersFormatter} from "./interface/IModifiersFormatter";
import {IParametersFormatter} from "./interface/IParametersFormatter";
import {IValueableFormatter} from "./interface/IValueableFormatter";

export abstract class FunctionLikeFormatter implements IFunctionLikeFormatter {

	constructor (protected sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 private decoratorsFormatter: IDecoratorsFormatter,
							 private modifiersFormatter: IModifiersFormatter,
							 private parametersFormatter: IParametersFormatter,
							 protected valueableFormatter: IValueableFormatter) {
	}

	/**
	 * Takes a ConstructorDeclaration, MethodDeclaration, FunctionDeclaration, ArrowFunction, GetAccessorDeclaration or SetAccessorDeclaration and returns an IMemberDeclaration.
	 * @param {ConstructorDeclaration|MethodDeclaration|FunctionDeclaration|ArrowFunction|SetAccessorDeclaration|GetAccessorDeclaration} declaration
	 * @returns {IMemberDeclaration}
	 */
	protected formatCallableMemberDeclaration (declaration: ConstructorDeclaration|MethodDeclaration|FunctionDeclaration|ArrowFunction|GetAccessorDeclaration|SetAccessorDeclaration): IMemberDeclaration&IParametersable {
		const fileContents = this.sourceFilePropertiesGetter.getSourceFileProperties(declaration).fileContents;
		const startsAt = declaration.pos;
		const endsAt = declaration.end;
		const body = declaration.body;
		const argumentsStartsAt = declaration.parameters.pos;
		const argumentsEndsAt = declaration.parameters.end;

		const bodyStartsAt = body == null ? -1 : body.pos;
		const bodyEndsAt = body == null ? -1 : body.end;
		const contents = fileContents.slice(startsAt, endsAt);
		const bodyContents = body == null ? null : fileContents.slice(bodyStartsAt, bodyEndsAt);

		return {
			startsAt,
			endsAt,
			contents,
			decorators: this.decoratorsFormatter.format(declaration),
			body: {
				startsAt: bodyStartsAt,
				endsAt: bodyEndsAt,
				contents: bodyContents
			},
			parameters: {
				startsAt: argumentsStartsAt,
				endsAt: argumentsEndsAt,
				parametersList: this.parametersFormatter.format(declaration)
			}
		};
	}

	/**
	 * Formats a ConstructorDeclaration, MethodDeclaration, FunctionDeclaration, ArrowFunction, GetAccessorDeclaration or SetAccessorDeclaration and returns what they have in common.
	 * @param {MethodDeclaration|FunctionDeclaration|ConstructorDeclaration|ArrowFunction|SetAccessorDeclaration|GetAccessorDeclaration} declaration
	 * @returns {IMemberDeclaration & IParametersable & IFunctionLike}
	 */
	protected formatFunctionLikeDeclaration (declaration: MethodDeclaration|FunctionDeclaration|ConstructorDeclaration|ArrowFunction|SetAccessorDeclaration|GetAccessorDeclaration): IFunctionLike {
		const fileContents = this.sourceFilePropertiesGetter.getSourceFileProperties(declaration).fileContents;
		let returnStatementStartsAt: number = -1;
		let returnStatementEndsAt: number = -1;
		let returnStatementContents: string|null = null;
		let value: IValueable|null = null;

		const body = declaration.body;
		if (body != null && isBlockDeclaration(body) && body.statements != null) {
			for (const bodyStatement of body.statements) {
				if (isReturnStatement(bodyStatement)) {
					if (bodyStatement.expression != null) {
						returnStatementStartsAt = bodyStatement.expression.pos;
						returnStatementEndsAt = bodyStatement.expression.end;
						returnStatementContents = fileContents.slice(returnStatementStartsAt, returnStatementEndsAt);
						value = this.valueableFormatter.format(bodyStatement.expression, undefined, undefined);
						break;
					}
				}
			}
		}

		return {
			...this.formatCallableMemberDeclaration(declaration),
			...{
				modifiers: this.modifiersFormatter.format(declaration),
				returnStatement: value == null ? null : {
					startsAt: returnStatementStartsAt,
					endsAt: returnStatementEndsAt,
					contents: returnStatementContents,
					value
				}
			}
		};
	}
}