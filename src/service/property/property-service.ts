import {IPropertyService} from "./i-property-service";
import {PropertyDeclaration, SyntaxKind} from "typescript";
import {NodeService} from "../node/node-service";
import {IRemover} from "../../remover/i-remover-base";
import {IPrinter, ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IDecoratorService} from "../decorator/i-decorator-service";

/**
 * A service for working with PropertyDeclarations
 */
export class PropertyService extends NodeService<PropertyDeclaration> implements IPropertyService {

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.PropertyDeclaration];

	constructor (private printer: IPrinter,
							 remover: IRemover,
							 astUtil: ITypescriptASTUtil,
							 decoratorService: IDecoratorService) {
		super(decoratorService, remover, astUtil);
	}

	/**
	 * Returns true if the PropertyDeclaration is optional
	 * @param {PropertyDeclaration} property
	 * @returns {boolean}
	 */
	public isOptional (property: PropertyDeclaration): boolean {
		return property.questionToken != null;
	}

	/**
	 * Gets the name of the type of the PropertyDeclaration
	 * @param {PropertyDeclaration} property
	 * @returns {string}
	 */
	public getTypeName (property: PropertyDeclaration): string|undefined {
		if (property.type == null) return undefined;
		return this.printer.print(property.type);
	}
}