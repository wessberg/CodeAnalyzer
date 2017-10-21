import {NodeService} from "../node/node-service";
import {ClassFunctionLike} from "./class-function-like";
import {IClassFunctionLikeService} from "./i-class-function-like-service";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IRemover} from "../../remover/i-remover-base";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {ITypeNodeService} from "../type-node/i-type-node-service";

/**
 * An abstract service for working with ClassFunctionLikes
 */
export abstract class ClassFunctionLikeService<T extends ClassFunctionLike> extends NodeService<T> implements IClassFunctionLikeService<T> {
	constructor (private typeNodeService: ITypeNodeService,
							 remover: IRemover,
							 decoratorService: IDecoratorService,
							 languageService: ITypescriptLanguageService,
							 astUtil: ITypescriptASTUtil) {
		super(decoratorService, languageService, remover, astUtil);
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