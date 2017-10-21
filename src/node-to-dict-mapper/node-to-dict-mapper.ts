import {INodeToDictMapperBase} from "./i-node-to-dict-mapper";
import {ArrayBindingElement, ArrayBindingPattern, BindingElement, BindingName, CallSignatureDeclaration, ConstructSignatureDeclaration, Decorator, ExportSpecifier, HeritageClause, Identifier, ImportClause, ImportSpecifier, IndexSignatureDeclaration, InterfaceDeclaration, isArrayBindingPattern, isCallSignatureDeclaration, isConstructSignatureDeclaration, isIdentifier, isIndexSignatureDeclaration, isMethodSignature, isNamespaceImport, isObjectBindingPattern, isOmittedExpression, isPropertySignature, MethodSignature, ObjectBindingPattern, ParameterDeclaration, PropertySignature, SignatureDeclaration, TypeElement, TypeLiteralNode} from "typescript";
import {IDecoratorDict} from "../light-ast/dict/decorator/i-decorator-dict";
import {IObjectBindingElementDict} from "../light-ast/dict/binding-element/i-object-binding-element-dict";
import {ArrayBindingElementDict, INormalArrayBindingElementDict, IOmittedArrayBindingElementDict} from "../light-ast/dict/binding-element/array-binding-element-dict";
import {BindingNameDict, IArrayBindingNameDict, INormalBindingNameDict, IObjectBindingNameDict} from "../light-ast/dict/binding-name/binding-name-dict";
import {IParameterDict} from "../light-ast/dict/parameter/i-parameter-dict";
import {ITypeElementDict, TypeElementDict} from "../light-ast/dict/type-element/i-type-element-dict";
import {ICallSignatureDict} from "../light-ast/dict/call-signature/i-call-signature-dict";
import {IConstructSignatureDict} from "../light-ast/dict/construct-signature/i-construct-signature-dict";
import {IMethodSignatureDict} from "../light-ast/dict/method-signature/i-method-signature-dict";
import {IIndexSignatureDict} from "../light-ast/dict/index-signature/i-index-signature-dict";
import {IPropertySignatureDict} from "../light-ast/dict/property-signature/i-property-signature-dict";
import {ISignatureDict} from "../light-ast/dict/signature/i-signature-dict";
import {HeritageDict, IExtendsHeritageDict, IImplementsHeritageDict} from "../light-ast/dict/heritage/i-heritage-dict";
import {ITypeLiteralDict} from "../light-ast/dict/type-literal/i-type-literal-dict";
import {IInterfaceDict} from "../light-ast/dict/interface/i-interface-dict";
import {INamedImportExportDict} from "../light-ast/dict/named-import-export/i-named-import-export-dict";
import {IImportClauseDict} from "../light-ast/dict/import-clause/i-import-clause-dict";
import {IHeritageClauseService} from "../service/heritage-clause/i-heritage-clause-service";
import {INodeToCtorMapper} from "../node-to-ctor-mapper/i-node-to-ctor-mapper-getter";

/**
 * A class that can map nodes to dicts
 */
export class NodeToDictMapper implements INodeToDictMapperBase {
	constructor (private nodeToCtorMapper: INodeToCtorMapper,
							 private heritageClauseService: IHeritageClauseService) {
	}

	/**
	 * Maps a Decorator to an IDecoratorDict
	 * @param {Decorator} node
	 * @returns {IDecoratorDict}
	 */
	public toIDecoratorDict (node: Decorator|undefined|null): IDecoratorDict|null {
		if (node == null) return null;

		return {
			...this.nodeToCtorMapper.toIDecoratorCtor(node)!,
			nodeKind: "DECORATOR"
		};
	}

	/**
	 * Maps a BindingElement to an IObjectBindingNameElementDict
	 * @param {BindingElement} node
	 * @returns {IObjectBindingElementDict}
	 */
	public toIObjectBindingElementDict (node: BindingElement|undefined|null): IObjectBindingElementDict|null {
		if (node == null) return null;

		return {
			...this.nodeToCtorMapper.toIObjectBindingElementCtor(node)!,
			nodeKind: "OBJECT_BINDING_ELEMENT"
		};
	}

	/**
	 * Maps a BindingElement to an INormalArrayBindingElementDict
	 * @param {BindingElement} node
	 * @returns {INormalArrayBindingElementDict}
	 */
	public toINormalArrayBindingElementDict (node: BindingElement|undefined|null): INormalArrayBindingElementDict|null {
		if (node == null) return null;

		return {
			...this.nodeToCtorMapper.toINormalArrayBindingElementCtor(node)!,
			nodeKind: "ARRAY_BINDING_ELEMENT"
		};
	}

	/**
	 * Maps an ArrayBindingElement to an IOmittedArrayBindingElementDict
	 * @param {ArrayBindingElement?} node
	 * @returns {IOmittedArrayBindingElementDict}
	 */
	public toIOmittedArrayBindingElementDict (node: ArrayBindingElement|undefined|null): IOmittedArrayBindingElementDict|null {
		return {
			...this.nodeToCtorMapper.toIOmittedArrayBindingElementCtor(node)!,
			nodeKind: "ARRAY_BINDING_ELEMENT"
		};
	}

	/**
	 * Maps an ArrayBindingElement to an ArrayBindingElementDict
	 * @param {ArrayBindingElement} node
	 * @returns {ArrayBindingElementDict}
	 */
	public toArrayBindingElementDict (node: ArrayBindingElement|undefined|null): ArrayBindingElementDict|null {
		if (node == null) return null;

		if (isOmittedExpression(node)) return this.toIOmittedArrayBindingElementDict(node);
		return this.toINormalArrayBindingElementDict(node);
	}

	/**
	 * Maps a BindingName to a BindingNameDict
	 * @param {BindingName} node
	 * @returns {BindingNameDict}
	 */
	public toBindingNameDict (node: BindingName|undefined|null): BindingNameDict|null {
		if (node == null) return null;

		if (isIdentifier(node)) return this.toINormalBindingNameDict(node);
		if (isArrayBindingPattern(node)) return this.toIArrayBindingNameDict(node);
		if (isObjectBindingPattern(node)) return this.toIObjectBindingNameDict(node);

		return null;
	}

	/**
	 * Maps an Identifier to an INormalBindingNameDict
	 * @param {Identifier} node
	 * @returns {INormalBindingNameDict}
	 */
	public toINormalBindingNameDict (node: Identifier|undefined|null): INormalBindingNameDict|null {
		if (node == null) return null;

		return {
			...this.nodeToCtorMapper.toINormalBindingNameCtor(node)!,
			nodeKind: "BINDING_NAME"
		};
	}

	/**
	 * Maps an ObjectBindingPattern to an IObjectBindingNameDict
	 * @param {ObjectBindingPattern} node
	 * @returns {IObjectBindingNameDict}
	 */
	public toIObjectBindingNameDict (node: ObjectBindingPattern|undefined|null): IObjectBindingNameDict|null {
		if (node == null) return null;

		return {
			...this.nodeToCtorMapper.toIObjectBindingNameCtor(node)!,
			nodeKind: "BINDING_NAME",
			elements: node.elements.map(element => this.toIObjectBindingElementDict(element)!)
		};
	}

	/**
	 * Maps an ArrayBindingPattern to an IArrayBindingNameDict
	 * @param {ArrayBindingPattern} node
	 * @returns {IArrayBindingNameDict}
	 */
	public toIArrayBindingNameDict (node: ArrayBindingPattern|undefined|null): IArrayBindingNameDict|null {
		if (node == null) return null;

		return {
			...this.nodeToCtorMapper.toIArrayBindingNameCtor(node)!,
			nodeKind: "BINDING_NAME",
			elements: node.elements.map(element => this.toArrayBindingElementDict(element)!)
		};
	}

	/**
	 * Maps a ParameterDeclaration to an IParameterDict
	 * @param {ParameterDeclaration} node
	 * @returns {IParameterDict}
	 */
	public toIParameterDict (node: ParameterDeclaration|undefined|null): IParameterDict|null {
		if (node == null) return null;
		return {
			...this.nodeToCtorMapper.toIParameterCtor(node)!,
			nodeKind: "PARAMETER",
			decorators: node.decorators == null ? null : node.decorators.map(decorator => this.toIDecoratorDict(decorator)!),
			name: this.toBindingNameDict(node.name)!
		};
	}

	/**
	 * Maps a TypeElement to a TypeElementDict
	 * @param {TypeElement} node
	 * @returns {TypeElementDict}
	 */
	public toTypeElementDict (node: TypeElement|undefined|null): TypeElementDict|null {
		if (node == null) return null;

		if (isCallSignatureDeclaration(node)) return this.toICallSignatureDict(node);
		if (isConstructSignatureDeclaration(node)) return this.toIConstructSignatureDict(node);
		if (isMethodSignature(node)) return this.toIMethodSignatureDict(node);
		if (isIndexSignatureDeclaration(node)) return this.toIIndexSignatureDict(node);
		if (isPropertySignature(node)) return this.toIPropertySignatureDict(node);

		return null;
	}

	/**
	 * Maps a CallSignatureDeclaration to an ICallSignatureDict
	 * @param {CallSignatureDeclaration} node
	 * @returns {ICallSignatureDict}
	 */
	public toICallSignatureDict (node: CallSignatureDeclaration|undefined|null): ICallSignatureDict|null {
		if (node == null) return null;
		return {
			...this.nodeToCtorMapper.toICallSignatureCtor(node)!,
			nodeKind: "CALL_SIGNATURE",
			parameters: node.parameters.map(parameter => this.toIParameterDict(parameter)!)
		};
	}

	/**
	 * Maps a ConstructSignatureDeclaration to an IConstructSignatureDict
	 * @param {ConstructSignatureDeclaration} node
	 * @returns {IConstructSignatureDict}
	 */
	public toIConstructSignatureDict (node: ConstructSignatureDeclaration|undefined|null): IConstructSignatureDict|null {
		if (node == null) return null;
		return {
			...this.nodeToCtorMapper.toIConstructSignatureCtor(node)!,
			nodeKind: "CONSTRUCT_SIGNATURE",
			parameters: node.parameters.map(parameter => this.toIParameterDict(parameter)!)
		};
	}

	/**
	 * Maps a MethodSignature to an IMethodSignatureDict
	 * @param {MethodSignature} node
	 * @returns {IMethodSignatureDict}
	 */
	public toIMethodSignatureDict (node: MethodSignature|undefined|null): IMethodSignatureDict|null {
		if (node == null) return null;
		return {
			...this.nodeToCtorMapper.toIMethodSignatureCtor(node)!,
			nodeKind: "METHOD_SIGNATURE",
			parameters: node.parameters.map(parameter => this.toIParameterDict(parameter)!)
		};
	}

	/**
	 * Maps an IndexSignatureDeclaration to an IIndexSignatureDict
	 * @param {IndexSignatureDeclaration} node
	 * @returns {IIndexSignatureDict}
	 */
	public toIIndexSignatureDict (node: IndexSignatureDeclaration|undefined|null): IIndexSignatureDict|null {
		if (node == null) return null;
		return {
			...this.nodeToCtorMapper.toIIndexSignatureCtor(node)!,
			nodeKind: "INDEX_SIGNATURE",
			parameters: node.parameters.map(parameter => this.toIParameterDict(parameter)!)
		};
	}

	/**
	 * Maps a PropertySignature to an IPropertySignatureDict
	 * @param {PropertySignature} node
	 * @returns {IPropertySignatureDict}
	 */
	public toIPropertySignatureDict (node: PropertySignature|undefined|null): IPropertySignatureDict|null {
		if (node == null) return null;
		return {
			...this.nodeToCtorMapper.toIPropertySignatureCtor(node)!,
			nodeKind: "PROPERTY_SIGNATURE"
		};
	}

	/**
	 * Maps a SignatureDeclaration to an ISignatureDict
	 * @param {SignatureDeclaration} node
	 * @returns {ISignatureDict}
	 */
	public toISignatureDict (node: SignatureDeclaration|undefined|null): ISignatureDict|null {
		if (node == null) return null;

		return {
			...this.nodeToCtorMapper.toISignatureCtor(node)!,
			parameters: node.parameters.map(parameter => this.toIParameterDict(parameter)!)
		};
	}

	/**
	 * Maps a HeritageClause to an IExtendsHeritageDict, if possible
	 * @param {HeritageClause} node
	 * @returns {IExtendsHeritageDict}
	 */
	public toIExtendsHeritageDict (node: HeritageClause|undefined|null): IExtendsHeritageDict|null {
		if (node == null || !this.heritageClauseService.isExtendsClause(node)) return null;

		// Otherwise, it is an implements clause.
		return {
			...this.nodeToCtorMapper.toIExtendsHeritageCtor(node)!,
			nodeKind: "HERITAGE"
		};
	}

	/**
	 * Maps a HeritageClause to an IImplementsHeritageDict, if possible
	 * @param {HeritageClause} node
	 * @returns {IImplementsHeritageDict}
	 */
	public toIImplementsHeritageDict (node: HeritageClause|undefined|null): IImplementsHeritageDict|null {
		if (node == null || !this.heritageClauseService.isImplementsClause(node)) return null;

		// Otherwise, it is an implements clause.
		return {
			...this.nodeToCtorMapper.toIImplementsHeritageCtor(node)!,
			nodeKind: "HERITAGE"
		};
	}

	/**
	 * Maps a HeritageClause to a HeritageDict
	 * @param {HeritageClause} node
	 * @returns {HeritageDict}
	 */
	public toHeritageDict (node: HeritageClause|undefined|null): HeritageDict|null {
		if (node == null) return null;

		// If it is an implements clause
		if (this.heritageClauseService.isExtendsClause(node)) {
			return this.toIExtendsHeritageDict(node);
		}

		// Otherwise, it is an implements clause
		return this.toIImplementsHeritageDict(node);
	}

	/**
	 * Maps a TypeLiteralNode to a TypeLiteralDict
	 * @param {TypeLiteralNode|InterfaceDeclaration} node
	 * @returns {ITypeLiteralDict}
	 */
	public toITypeLiteralDict (node: TypeLiteralNode|InterfaceDeclaration|undefined|null): ITypeLiteralDict|null {
		if (node == null) return null;
		return {
			...this.nodeToCtorMapper.toITypeLiteralCtor(node)!,
			nodeKind: "TYPE_LITERAL",
			members: node.members.map(member => this.toITypeElementDict(member)!)
		};
	}

	/**
	 * Maps an InterfaceDeclaration to an IInterfaceDict
	 * @param {InterfaceDeclaration} node
	 * @returns {IInterfaceDict}
	 */
	public toIInterfaceDict (node: InterfaceDeclaration|undefined|null): IInterfaceDict|null {
		if (node == null) return null;

		return {
			...this.nodeToCtorMapper.toIInterfaceCtor(node)!,
			nodeKind: "INTERFACE",
			members: node.members.map(member => this.toTypeElementDict(member)!)
		};
	}

	/**
	 * Maps a TypeElement to an ITypeElementDict
	 * @param {TypeElement} node
	 * @returns {ITypeElementDict}
	 */
	public toITypeElementDict (node: TypeElement|undefined|null): ITypeElementDict|null {
		return this.nodeToCtorMapper.toITypeElementCtor(node);
	}

	/**
	 * Maps an ImportSpecifier to an INamedImportExportDict
	 * @param {ImportSpecifier|ExportSpecifier?} node
	 * @returns {INamedImportExportDict?}
	 */
	public toINamedImportExportDict (node: ImportSpecifier|ExportSpecifier|undefined|null): INamedImportExportDict|null {
		if (node == null) return null;

		return {
			...this.nodeToCtorMapper.toINamedImportExportCtor(node)!,
			nodeKind: "NAMED_IMPORT_EXPORT"
		};
	}

	/**
	 * Maps an ImportClause to an IImportClauseDict
	 * @param {ImportClause?} node
	 * @returns {IImportClauseDict?}
	 */
	public toIImportClauseDict (node: ImportClause|undefined|null): IImportClauseDict|null {
		if (node == null) return null;

		return {
			...this.nodeToCtorMapper.toIImportClauseCtor(node)!,
			nodeKind: "IMPORT_CLAUSE",
			namedImports: node.namedBindings == null || isNamespaceImport(node.namedBindings)
				? null
				: node.namedBindings.elements.map(element => this.toINamedImportExportDict(element)!)
		};
	}

}