import {TypeDeclarationService} from "../type-declaration/type-declaration-service";
import {InterfaceDeclaration, SyntaxKind} from "typescript";
import {IInterfaceDeclarationService} from "./i-interface-declaration-service";
import {INodeToDictMapper} from "../../node-to-dict-mapper/i-node-to-dict-mapper-getter";
import {IRemover} from "../../remover/i-remover-base";
import {IPrinter, ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {IInterfaceDict} from "../../light-ast/dict/interface/i-interface-dict";

/**
 * A service for working with InterfaceDeclarations
 */
export class InterfaceDeclarationService extends TypeDeclarationService<InterfaceDeclaration> implements IInterfaceDeclarationService {
	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.InterfaceDeclaration];

	constructor (private nodeToDictMapper: INodeToDictMapper,
							 printer: IPrinter,
							 astUtil: ITypescriptASTUtil,
							 remover: IRemover,
							 decoratorService: IDecoratorService) {
		super(printer, decoratorService, remover, astUtil);
	}

	/**
	 * Maps the provided InterfaceDeclaration to an IInterfaceCtor
	 * @param {InterfaceDeclaration} type
	 * @returns {IInterfaceCtor}
	 */
	public toInterfaceDict (type: InterfaceDeclaration): IInterfaceDict {
		return this.nodeToDictMapper.toIInterfaceDict(type)!;
	}

	/**
	 * Gets the names of TypeParameters for an InterfaceDeclaration
	 * @param {InterfaceDeclaration} type
	 * @returns {string[]}
	 */
	public getTypeParameterNames (type: InterfaceDeclaration): string[]|undefined {
		if (type.typeParameters == null) return undefined;
		return type.typeParameters.map(typeParameter => this.printer.print(typeParameter));
	}

	/**
	 * Returns the name of an InterfaceDeclaration
	 * @param {InterfaceDeclaration} type
	 * @returns {string}
	 */
	public getName (type: InterfaceDeclaration): string {
		return type.name.text;
	}
}