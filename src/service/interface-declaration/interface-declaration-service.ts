import {TypeDeclarationService} from "../type-declaration/type-declaration-service";
import {InterfaceDeclaration, SourceFile, SyntaxKind} from "typescript";
import {IInterfaceDeclarationService} from "./i-interface-declaration-service";
import {INodeToDictMapper} from "../../node-to-dict-mapper/i-node-to-dict-mapper-getter";
import {IRemover} from "../../remover/i-remover-base";
import {IPrinter, ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {IInterfaceDict} from "../../light-ast/dict/interface/i-interface-dict";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypeElementService} from "../type-element/i-type-element-service";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {IUpdater} from "../../updater/i-updater-getter";

/**
 * A service for working with InterfaceDeclarations
 */
export class InterfaceDeclarationService extends TypeDeclarationService<InterfaceDeclaration> implements IInterfaceDeclarationService {

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {Iterable<SyntaxKind>}
	 */
	protected readonly ALLOWED_KINDS: Iterable<SyntaxKind> = [SyntaxKind.InterfaceDeclaration];

	constructor (private readonly nodeToDictMapper: INodeToDictMapper,
							 private readonly printer: IPrinter,
							 joiner: IJoiner,
							 updater: IUpdater,
							 astUtil: ITypescriptASTUtil,
							 remover: IRemover,
							 languageService: ITypescriptLanguageService,
							 typeElementService: ITypeElementService,
							 decoratorService: IDecoratorService) {
		super(typeElementService, joiner, updater, decoratorService, languageService, remover, astUtil);
	}

	/**
	 * Returns true if the given SourceFile has an InterfaceDeclaration with the given name
	 * @param {string} name
	 * @param {SourceFile} sourceFile
	 * @param {boolean} [deep=false]
	 * @returns {boolean}
	 */
	public hasInterfaceWithName (name: string, sourceFile: SourceFile, deep: boolean = false): boolean {
		return this.getInterfaceWithName(name, sourceFile, deep) != null;
	}

	/**
	 * Gets the InterfaceDeclaration with the provided name, if any exists in the SourceFile
	 * @param {string} name
	 * @param {SourceFile} sourceFile
	 * @param {boolean} [deep=false]
	 * @returns {InterfaceDeclaration}
	 */
	public getInterfaceWithName (name: string, sourceFile: SourceFile, deep: boolean = false): InterfaceDeclaration|undefined {
		return this.getAll(sourceFile, deep)
			.find(interfaceDeclaration => this.getName(interfaceDeclaration) === name);
	}

	/**
	 * Maps the provided InterfaceDeclaration to an IInterfaceCtor
	 * @param {InterfaceDeclaration} type
	 * @returns {IInterfaceCtor}
	 */
	public toLightAST (type: InterfaceDeclaration): IInterfaceDict {
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