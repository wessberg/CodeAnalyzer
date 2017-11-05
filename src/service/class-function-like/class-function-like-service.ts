import {NodeService} from "../node/node-service";
import {ClassFunctionLike} from "./class-function-like";
import {IClassFunctionLikeService} from "./i-class-function-like-service";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IRemover} from "../../remover/i-remover-base";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {ITypeNodeService} from "../type-node/i-type-node-service";
import {IPropertyNameService} from "../property-name/i-property-name-service";
import {VisibilityKind} from "../../light-ast/dict/visibility/visibility-kind";
import {IModifierService} from "../modifier/i-modifier-service";
import {IUpdater} from "../../updater/i-updater-getter";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {INodeToCtorMapper} from "../../node-to-ctor-mapper/i-node-to-ctor-mapper-getter";

/**
 * An abstract service for working with ClassFunctionLikes
 */
export abstract class ClassFunctionLikeService<T extends ClassFunctionLike> extends NodeService<T> implements IClassFunctionLikeService<T> {
	constructor (protected typeNodeService: ITypeNodeService,
							 protected propertyNameService: IPropertyNameService,
							 protected modifierService: IModifierService,
							 protected updater: IUpdater,
							 protected formatter: IFormatter,
							 protected nodeToCtorMapper: INodeToCtorMapper,
							 remover: IRemover,
							 decoratorService: IDecoratorService,
							 languageService: ITypescriptLanguageService,
							 astUtil: ITypescriptASTUtil) {
		super(decoratorService, languageService, remover, astUtil);
	}

	/**
	 * Changes the visibility of the given PropertyDeclaration
	 * @template T
	 * @param {VisibilityKind} visibility
	 * @param {PropertyDeclaration} member
	 * @returns {T}
	 */
	public changeVisibility (visibility: VisibilityKind, member: T): T {
		// First, see if it has an access modifier already
		const existingModifier = this.modifierService.getAccessModifier(member);

		// If it already has the requested modifier, return immediately
		if (existingModifier === visibility) return member;

		return this.updater.updateNodeModifiers(
			this.formatter.formatModifiers({
				...this.nodeToCtorMapper.toIAllModifiersCtor(member.modifiers),
				visibility
			}), member
		);
	}

	/**
	 * Gets the name of the given member
	 * @template T
	 * @param {T} member
	 * @returns {string}
	 */
	public getName (member: T): string {
		return this.propertyNameService.getName(member.name);
	}

	/**
	 * Returns true if the provided method is optional
	 * @template T
	 * @param {T} member
	 * @returns {boolean}
	 */
	public isOptional (member: T): boolean {
		return member.questionToken != null;
	}

	/**
	 * Gets the type of the ClassFunctionLike
	 * @template T
	 * @param {T} member
	 * @returns {string}
	 */
	public getTypeName (member: T): string|undefined {
		if (member.type == null) return undefined;
		return this.typeNodeService.getNameOfType(member.type);
	}

	/**
	 * Appends the provided instructions to the provided member
	 * @template T
	 * @param {string} instructions
	 * @param {T} member
	 * @returns {T}
	 */
	public abstract appendInstructions (instructions: string, member: T): T;
}