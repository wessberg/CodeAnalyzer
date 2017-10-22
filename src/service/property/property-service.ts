import {IPropertyService} from "./i-property-service";
import {PropertyDeclaration, SyntaxKind} from "typescript";
import {NodeService} from "../node/node-service";
import {IRemover} from "../../remover/i-remover-base";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypeNodeService} from "../type-node/i-type-node-service";
import {IModifierService} from "../modifier/i-modifier-service";

/**
 * A service for working with PropertyDeclarations
 */
export class PropertyService extends NodeService<PropertyDeclaration> implements IPropertyService {

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.PropertyDeclaration];

	constructor (private typeNodeService: ITypeNodeService,
							 remover: IRemover,
							 astUtil: ITypescriptASTUtil,
							 languageService: ITypescriptLanguageService,
							 private modifierService: IModifierService,
							 decoratorService: IDecoratorService) {
		super(decoratorService, languageService, remover, astUtil);
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
	 * Returns true if the PropertyDeclaration is optional
	 * @param {PropertyDeclaration} property
	 * @returns {boolean}
	 */
	public isStatic (property: PropertyDeclaration): boolean {
		return this.modifierService.isStatic(property);
	}

	/**
	 * Gets the name of the type of the PropertyDeclaration
	 * @param {PropertyDeclaration} property
	 * @returns {string}
	 */
	public getTypeName (property: PropertyDeclaration): string|undefined {
		if (property.type == null) return undefined;
		return this.typeNodeService.getNameOfType(property.type);
	}
}