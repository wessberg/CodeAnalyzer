import {IPropertyService} from "./i-property-service";
import {PropertyDeclaration, SyntaxKind} from "typescript";
import {NodeService} from "../node/node-service";
import {IRemover} from "../../remover/i-remover-base";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypeNodeService} from "../type-node/i-type-node-service";
import {IModifierService} from "../modifier/i-modifier-service";
import {IPropertyNameService} from "../property-name/i-property-name-service";
import {VisibilityKind} from "../../light-ast/dict/visibility/visibility-kind";
import {IUpdater} from "../../updater/i-updater-getter";
import {INodeToCtorMapper} from "../../node-to-ctor-mapper/i-node-to-ctor-mapper-getter";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IJoiner} from "../../joiner/i-joiner-getter";

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
							 private formatter: IFormatter,
							 private modifierService: IModifierService,
							 private propertyNameService: IPropertyNameService,
							 private nodeToCtorMapper: INodeToCtorMapper,
							 joiner: IJoiner,
							 updater: IUpdater,
							 remover: IRemover,
							 astUtil: ITypescriptASTUtil,
							 languageService: ITypescriptLanguageService,
							 decoratorService: IDecoratorService) {
		super(decoratorService, languageService, joiner, updater, remover, astUtil);
	}

	/**
	 * Changes the visibility of the given PropertyDeclaration
	 * @param {VisibilityKind} visibility
	 * @param {PropertyDeclaration} property
	 * @returns {PropertyDeclaration}
	 */
	public changeVisibility (visibility: VisibilityKind, property: PropertyDeclaration): PropertyDeclaration {
		// First, see if it has an access modifier already
		const existingModifier = this.modifierService.getAccessModifier(property);

		// If it already has the requested modifier, return immediately
		if (existingModifier === visibility) return property;

		return this.updater.updatePropertyDeclarationModifiers(
			this.formatter.formatModifiers({
				...this.nodeToCtorMapper.toIAllModifiersCtor(property.modifiers),
				visibility
			}), property
		);
	}

	/**
	 * Gets the name of the given PropertyDeclaration
	 * @param {PropertyDeclaration} property
	 * @returns {string}
	 */
	public getName (property: PropertyDeclaration): string {
		return this.propertyNameService.getName(property.name);
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