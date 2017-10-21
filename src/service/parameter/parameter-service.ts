import {NodeService} from "../node/node-service";
import {ParameterDeclaration, SyntaxKind} from "typescript";
import {IParameterService} from "./i-parameter-service";
import {IPrinter, ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IRemover} from "../../remover/i-remover-base";
import {IDecoratorService} from "../decorator/i-decorator-service";

/**
 * A service for working with ParameterDeclarations
 */
export class ParameterService extends NodeService<ParameterDeclaration> implements IParameterService {

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.Parameter];

	constructor (private printer: IPrinter,
							 astUtil: ITypescriptASTUtil,
							 remover: IRemover,
							 decoratorService: IDecoratorService) {
		super(decoratorService, remover, astUtil);
	}

	/**
	 * Returns true if the ParameterDeclaration has a questionToken
	 * @param {ParameterDeclaration} parameter
	 * @returns {boolean}
	 */
	public isReadonly (parameter: ParameterDeclaration): boolean {
		return parameter.questionToken != null;
	}

	/**
	 * Returns true if the parameter is optional
	 * @param {ParameterDeclaration} parameter
	 * @returns {boolean}
	 */
	public isOptional (parameter: ParameterDeclaration): boolean {
		return parameter.questionToken != null;
	}

	/**
	 * Returns the stringified name of the parameter
	 * @param {ParameterDeclaration} parameter
	 * @returns {string}
	 */
	public getName (parameter: ParameterDeclaration): string {
		return this.printer.print(parameter.name);
	}

	/**
	 * Returns true if the parameter has an initializer
	 * @param {ParameterDeclaration} parameter
	 * @returns {boolean}
	 */
	public hasInitializer (parameter: ParameterDeclaration): boolean {
		return parameter.initializer != null;
	}

	/**
	 * Returns true if the parameter is a rest argument (like ...args)
	 * @param {ParameterDeclaration} parameter
	 * @returns {boolean}
	 */
	public isRestSpread (parameter: ParameterDeclaration): boolean {
		return parameter.dotDotDotToken != null;
	}

	/**
	 * Gets the type of the ParameterDeclaration
	 * @param {ParameterDeclaration} parameter
	 * @returns {string}
	 */
	public getTypeName (parameter: ParameterDeclaration): string|undefined {
		if (parameter.type == null) return undefined;
		return this.printer.print(parameter.type);
	}

	/**
	 * Gets the initializer expression of the ParameterDeclaration
	 * @param {ParameterDeclaration} parameter
	 * @returns {string}
	 */
	public getInitializer (parameter: ParameterDeclaration): string|undefined {
		if (parameter.initializer == null) return undefined;
		return this.printer.print(parameter.initializer);
	}
}