import {INodeToDictMapperBase} from "./i-node-to-dict-mapper";
import {AccessorDeclaration, ArrayBindingElement, ArrayBindingPattern, BindingElement, BindingName, CallSignatureDeclaration, ClassElement, ConstructorDeclaration, ConstructSignatureDeclaration, Decorator, ExportSpecifier, FunctionLikeDeclaration, GetAccessorDeclaration, HeritageClause, Identifier, ImportClause, ImportSpecifier, IndexSignatureDeclaration, InterfaceDeclaration, isAccessor, isArrayBindingPattern, isCallSignatureDeclaration, isConstructorDeclaration, isConstructSignatureDeclaration, isGetAccessorDeclaration, isIdentifier, isIndexSignatureDeclaration, isMethodDeclaration, isMethodSignature, isNamespaceImport, isObjectBindingPattern, isPropertyDeclaration, isPropertySignature, isSemicolonClassElement, MethodDeclaration, MethodSignature, ModifiersArray, ObjectBindingPattern, ParameterDeclaration, PropertyDeclaration, PropertySignature, SetAccessorDeclaration, SignatureDeclaration, SyntaxKind, TypeElement, TypeLiteralNode} from "typescript";
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
import {IAllModifiersDict} from "../light-ast/dict/modifier/i-all-modifiers-dict";
import {IClassDict} from "../light-ast/dict/class/i-class-dict";
import {ClassElementDict} from "../light-ast/dict/class-element/class-element-dict";
import {ClassAccessorDict} from "../light-ast/dict/class-accessor/class-accessor-dict";
import {NodeToCtorMapper} from "../node-to-ctor-mapper/node-to-ctor-mapper";
import {AccessorDict, IAccessorDict, IGetAccessorDict, ISetAccessorDict} from "../light-ast/dict/accessor/accessor-dict";
import {IClassMethodDict} from "../light-ast/dict/class-method/i-class-method-dict";
import {IClassPropertyDict} from "../light-ast/dict/class-property/i-class-property-dict";
import {IFunctionLikeDict} from "../light-ast/dict/function-like/i-function-like-dict";
import {IFunctionLikeWithParametersDict} from "../light-ast/dict/function-like-with-parameters/i-function-like-with-parameters-dict";
import {IMethodDict} from "../light-ast/dict/method/i-method-dict";
import {IConstructorDict} from "../light-ast/dict/constructor/i-constructor-dict";
import {Optional} from "../optional/optional";
import {Class} from "../service/class/i-class-service";

/**
 * A class that can map nodes to dicts
 */
export class NodeToDictMapper extends NodeToCtorMapper implements INodeToDictMapperBase {

	/**
	 * Maps a Decorator to an IDecoratorDict
	 * @param {Decorator} node
	 * @returns {IDecoratorDict}
	 */
	public toIDecoratorDict (node: Optional<Decorator>): IDecoratorDict|null {
		const result = this.toIDecoratorCtor(node);
		if (result == null) return null;

		return {
			...result,
			nodeKind: "DECORATOR"
		};
	}

	/**
	 * Maps a BindingElement to an IObjectBindingNameElementDict
	 * @param {BindingElement} node
	 * @returns {IObjectBindingElementDict}
	 */
	public toIObjectBindingElementDict (node: Optional<BindingElement>): IObjectBindingElementDict|null {
		const result = this.toIObjectBindingElementCtor(node);
		if (result == null) return null;

		return {
			...result,
			nodeKind: "OBJECT_BINDING_ELEMENT"
		};
	}

	/**
	 * Maps a BindingElement to an INormalArrayBindingElementDict
	 * @param {BindingElement} node
	 * @returns {INormalArrayBindingElementDict}
	 */
	public toINormalArrayBindingElementDict (node: Optional<BindingElement>): INormalArrayBindingElementDict|null {
		const result = this.toINormalArrayBindingElementCtor(node);
		if (result == null) return null;

		return {
			...result,
			nodeKind: "ARRAY_BINDING_ELEMENT"
		};
	}

	/**
	 * Maps an ArrayBindingElement to an IOmittedArrayBindingElementDict
	 * @param {ArrayBindingElement?} node
	 * @returns {IOmittedArrayBindingElementDict}
	 */
	public toIOmittedArrayBindingElementDict (node: Optional<ArrayBindingElement>): IOmittedArrayBindingElementDict|null {
		const result = this.toIOmittedArrayBindingElementCtor(node);
		if (result == null) return null;

		return {
			...result,
			nodeKind: "ARRAY_BINDING_ELEMENT"
		};
	}

	/**
	 * Maps an ArrayBindingElement to an ArrayBindingElementDict
	 * @param {ArrayBindingElement} node
	 * @returns {ArrayBindingElementDict}
	 */
	public toArrayBindingElementDict (node: Optional<ArrayBindingElement>): ArrayBindingElementDict|null {
		const result = this.toArrayBindingElementCtor(node);
		if (result == null) return null;

		return {
			...result,
			nodeKind: "ARRAY_BINDING_ELEMENT"
		};
	}

	/**
	 * Maps a BindingName to a BindingNameDict
	 * @param {BindingName} node
	 * @returns {BindingNameDict}
	 */
	public toBindingNameDict (node: Optional<BindingName>): BindingNameDict|null {
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
	public toINormalBindingNameDict (node: Optional<Identifier>): INormalBindingNameDict|null {
		const result = this.toINormalBindingNameCtor(node);
		if (result == null) return null;

		return {
			...result,
			nodeKind: "BINDING_NAME"
		};
	}

	/**
	 * Maps an ObjectBindingPattern to an IObjectBindingNameDict
	 * @param {ObjectBindingPattern} node
	 * @returns {IObjectBindingNameDict}
	 */
	public toIObjectBindingNameDict (node: Optional<ObjectBindingPattern>): IObjectBindingNameDict|null {
		const result = this.toIObjectBindingNameCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			elements: node.elements.map(element => this.toIObjectBindingElementDict(element)!),
			nodeKind: "BINDING_NAME"
		};
	}

	/**
	 * Maps an ArrayBindingPattern to an IArrayBindingNameDict
	 * @param {ArrayBindingPattern} node
	 * @returns {IArrayBindingNameDict}
	 */
	public toIArrayBindingNameDict (node: Optional<ArrayBindingPattern>): IArrayBindingNameDict|null {
		const result = this.toIArrayBindingNameCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			elements: node.elements.map(element => this.toArrayBindingElementDict(element)!),
			nodeKind: "BINDING_NAME"
		};
	}

	/**
	 * Maps a ParameterDeclaration to an IParameterDict
	 * @param {ParameterDeclaration} node
	 * @returns {IParameterDict}
	 */
	public toIParameterDict (node: Optional<ParameterDeclaration>): IParameterDict|null {
		const result = this.toIParameterCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			decorators: node.decorators == null ? null : node.decorators.map(decorator => this.toIDecoratorDict(decorator)!),
			name: this.toBindingNameDict(node.name)!,
			nodeKind: "PARAMETER"
		};
	}

	/**
	 * Maps a TypeElement to a TypeElementDict
	 * @param {TypeElement} node
	 * @returns {TypeElementDict}
	 */
	public toTypeElementDict (node: Optional<TypeElement>): TypeElementDict|null {
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
	public toICallSignatureDict (node: Optional<CallSignatureDeclaration>): ICallSignatureDict|null {
		const result = this.toICallSignatureCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			parameters: node.parameters.map(parameter => this.toIParameterDict(parameter)!),
			nodeKind: "CALL_SIGNATURE"
		};
	}

	/**
	 * Maps a ConstructSignatureDeclaration to an IConstructSignatureDict
	 * @param {ConstructSignatureDeclaration} node
	 * @returns {IConstructSignatureDict}
	 */
	public toIConstructSignatureDict (node: Optional<ConstructSignatureDeclaration>): IConstructSignatureDict|null {
		const result = this.toIConstructSignatureCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			parameters: node.parameters.map(parameter => this.toIParameterDict(parameter)!),
			nodeKind: "CONSTRUCT_SIGNATURE"
		};
	}

	/**
	 * Maps a MethodSignature to an IMethodSignatureDict
	 * @param {MethodSignature} node
	 * @returns {IMethodSignatureDict}
	 */
	public toIMethodSignatureDict (node: Optional<MethodSignature>): IMethodSignatureDict|null {
		const result = this.toIMethodSignatureCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			parameters: node.parameters.map(parameter => this.toIParameterDict(parameter)!),
			nodeKind: "METHOD_SIGNATURE"
		};
	}

	/**
	 * Maps an IndexSignatureDeclaration to an IIndexSignatureDict
	 * @param {IndexSignatureDeclaration} node
	 * @returns {IIndexSignatureDict}
	 */
	public toIIndexSignatureDict (node: Optional<IndexSignatureDeclaration>): IIndexSignatureDict|null {
		const result = this.toIIndexSignatureCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			parameters: node.parameters.map(parameter => this.toIParameterDict(parameter)!),
			nodeKind: "INDEX_SIGNATURE"
		};
	}

	/**
	 * Maps a PropertySignature to an IPropertySignatureDict
	 * @param {PropertySignature} node
	 * @returns {IPropertySignatureDict}
	 */
	public toIPropertySignatureDict (node: Optional<PropertySignature>): IPropertySignatureDict|null {
		const result = this.toIPropertySignatureCtor(node);
		if (result == null) return null;

		return {
			...result,
			nodeKind: "PROPERTY_SIGNATURE"
		};
	}

	/**
	 * Maps a SignatureDeclaration to an ISignatureDict
	 * @param {SignatureDeclaration} node
	 * @returns {ISignatureDict}
	 */
	public toISignatureDict (node: Optional<SignatureDeclaration>): ISignatureDict|null {
		const result = this.toISignatureCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			parameters: node.parameters.map(parameter => this.toIParameterDict(parameter)!)
		};
	}

	/**
	 * Maps a HeritageClause to an IExtendsHeritageDict, if possible
	 * @param {HeritageClause} node
	 * @returns {IExtendsHeritageDict}
	 */
	public toIExtendsHeritageDict (node: Optional<HeritageClause>): IExtendsHeritageDict|null {
		const result = this.toIExtendsHeritageCtor(node);
		if (result == null) return null;

		// Otherwise, it is an implements clause.
		return {
			...result,
			nodeKind: "HERITAGE"
		};
	}

	/**
	 * Maps a HeritageClause to an IImplementsHeritageDict, if possible
	 * @param {HeritageClause} node
	 * @returns {IImplementsHeritageDict}
	 */
	public toIImplementsHeritageDict (node: Optional<HeritageClause>): IImplementsHeritageDict|null {
		const result = this.toIImplementsHeritageCtor(node);
		if (result == null) return null;

		// Otherwise, it is an implements clause.
		return {
			...result,
			nodeKind: "HERITAGE"
		};
	}

	/**
	 * Maps a HeritageClause to a HeritageDict
	 * @param {HeritageClause} node
	 * @returns {HeritageDict}
	 */
	public toHeritageDict (node: Optional<HeritageClause>): HeritageDict|null {
		const result = this.toHeritageCtor(node);
		if (result == null) return null;

		return {
			...result,
			nodeKind: "HERITAGE"
		};
	}

	/**
	 * Maps a TypeLiteralNode to a TypeLiteralDict
	 * @param {TypeLiteralNode|InterfaceDeclaration} node
	 * @returns {ITypeLiteralDict}
	 */
	public toITypeLiteralDict (node: Optional<TypeLiteralNode|InterfaceDeclaration>): ITypeLiteralDict|null {
		const result = this.toITypeLiteralCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			members: node.members.map(member => this.toITypeElementDict(member)!),
			nodeKind: "TYPE_LITERAL"
		};
	}

	/**
	 * Maps an InterfaceDeclaration to an IInterfaceDict
	 * @param {InterfaceDeclaration} node
	 * @returns {IInterfaceDict}
	 */
	public toIInterfaceDict (node: Optional<InterfaceDeclaration>): IInterfaceDict|null {
		const result = this.toIInterfaceCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			members: node.members.map(member => this.toTypeElementDict(member)!),
			nodeKind: "INTERFACE"
		};
	}

	/**
	 * Maps a TypeElement to an ITypeElementDict
	 * @param {TypeElement} node
	 * @returns {ITypeElementDict}
	 */
	public toITypeElementDict (node: Optional<TypeElement>): ITypeElementDict|null {
		return this.toITypeElementCtor(node);
	}

	/**
	 * Maps a ModifiersArray to an IAllModifiersDict
	 * @param {Optional<ModifiersArray>} modifiers
	 * @returns {IAllModifiersDict | null}
	 */
	public toIAllModifiersDict (modifiers: Optional<ModifiersArray>): IAllModifiersDict|null {
		return this.toIAllModifiersCtor(modifiers);
	}

	/**
	 * Maps a Class to an IClassDict
	 * @param {Optional<Class>} node
	 * @returns {IClassDict | null}
	 */
	public toIClassDict (node: Optional<Class>): IClassDict|null {
		const result = this.toIClassCtor(node);
		if (result == null || node == null) return null;

		const extendsHeritageClause = this.classService.getExtendedClass(node);
		const implementsHeritageClause = this.classService.getImplements(node);

		return {
			...result,
			extendsClass: extendsHeritageClause == null ? null : this.toIExtendsHeritageDict(extendsHeritageClause),
			implementsInterfaces: implementsHeritageClause == null ? null : this.toIImplementsHeritageDict(implementsHeritageClause),
			decorators: node.decorators == null ? null : node.decorators.map(decorator => this.toIDecoratorDict(decorator)!),
			members: node.members == null ? null : node.members.map(member => this.toClassElementDict(member)!).filter(member => member != null),
			nodeKind: "CLASS"
		};
	}

	/**
	 * Maps a ClassElement to an ClassElementDict
	 * @param {Optional<ClassElement>} node
	 * @returns {ClassElementDict | null}
	 */
	public toClassElementDict (node: Optional<ClassElement>): ClassElementDict|null {
		if (node == null || isSemicolonClassElement(node)) return null;

		if (isAccessor(node)) {
			return this.toClassAccessorDict(node);
		}

		else if (isPropertyDeclaration(node)) {
			return this.toIClassPropertyDict(node);
		}

		else if (isMethodDeclaration(node)) {
			return this.toIClassMethodDict(node);
		}

		else if (isConstructorDeclaration(node)) {
			return this.toIConstructorDict(node);
		}

		else {
			throw new TypeError(`Could not map a node of kind: "${SyntaxKind[node.kind]}" to a ClassElementDict`);
		}
	}

	/**
	 * Maps a AccessorDeclaration to an ClassAccessorDict
	 * @param {Optional<AccessorDeclaration>} node
	 * @returns {ClassAccessorDict | null}
	 */
	public toClassAccessorDict (node: Optional<AccessorDeclaration>): ClassAccessorDict|null {
		const result = this.toClassAccessorCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			// tslint:disable
			...<any>this.toAccessorDict(node)!,
			// tslint:enable
			nodeKind: "CLASS_ACCESSOR"
		};

	}

	/**
	 * Maps a ConstructorDeclaration to an IConstructorDict
	 * @param {Optional<ConstructorDeclaration>} node
	 * @returns {IConstructorDict | null}
	 */
	public toIConstructorDict (node: ConstructorDeclaration|null|undefined): IConstructorDict|null {
		const result = this.toIConstructorCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			parameters: node.parameters.map(parameter => this.toIParameterDict(parameter)!),
			nodeKind: "CONSTRUCTOR"
		};
	}

	/**
	 * Maps a MethodDeclaration to an IClassMethodDict
	 * @param {Optional<MethodDeclaration>} node
	 * @returns {IClassMethodDict | null}
	 */
	public toIClassMethodDict (node: MethodDeclaration|null|undefined): IClassMethodDict|null {
		const result = this.toIClassMethodCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			parameters: node.parameters.map(parameter => this.toIParameterDict(parameter)!),
			decorators: node.decorators == null ? null : node.decorators.map(decorator => this.toIDecoratorDict(decorator)!),
			nodeKind: "CLASS_METHOD"
		};
	}

	/**
	 * Maps an PropertyDeclaration to an IClassPropertyDict
	 * @param {Optional<PropertyDeclaration>} node
	 * @returns {IClassPropertyDict | null}
	 */
	public toIClassPropertyDict (node: PropertyDeclaration|null|undefined): IClassPropertyDict|null {
		const result = this.toIClassPropertyCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			decorators: node.decorators == null ? null : node.decorators.map(decorator => this.toIDecoratorDict(decorator)!),
			nodeKind: "CLASS_PROPERTY"
		};
	}

	/**
	 * Maps a MethodDeclaration to an IMethodDict
	 * @param {Optional<MethodDeclaration>} node
	 * @returns {IMethodDict | null}
	 */
	public toIMethodDict (node: MethodDeclaration|null|undefined): IMethodDict|null {
		const result = this.toIMethodCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			parameters: node.parameters.map(parameter => this.toIParameterDict(parameter)!),
			decorators: node.decorators == null ? null : node.decorators.map(decorator => this.toIDecoratorDict(decorator)!),
			nodeKind: "METHOD"
		};
	}

	/**
	 * Maps an FunctionLikeDeclaration to an IFunctionLikeDict
	 * @param {Optional<FunctionLikeDeclaration>} node
	 * @returns {IFunctionLikeDict | null}
	 */
	public toIFunctionLikeDict (node: FunctionLikeDeclaration|null|undefined): IFunctionLikeDict|null {
		const result = this.toIFunctionLikeCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			decorators: node.decorators == null ? null : node.decorators.map(decorator => this.toIDecoratorDict(decorator)!)
		};
	}

	/**
	 * Maps a FunctionLikeDeclaration to an IFunctionLikeWithParametersDict
	 * @param {Optional<FunctionLikeDeclaration>} node
	 * @returns {IFunctionLikeWithParametersDict | null}
	 */
	public toIFunctionLikeWithParametersDict (node: FunctionLikeDeclaration|null|undefined): IFunctionLikeWithParametersDict|null {
		const result = this.toIFunctionLikeWithParametersCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			parameters: node.parameters.map(parameter => this.toIParameterDict(parameter)!),
			decorators: node.decorators == null ? null : node.decorators.map(decorator => this.toIDecoratorDict(decorator)!)
		};
	}

	/**
	 * Maps an AccessorDeclaration to an AccessorDict
	 * @param {Optional<AccessorDeclaration>} node
	 * @returns {AccessorDict | null}
	 */
	public toAccessorDict (node: AccessorDeclaration|null|undefined): AccessorDict|null {
		if (node == null) return null;

		if (isGetAccessorDeclaration(node)) {
			return this.toIGetAccessorDict(node);
		}

		else {
			return this.toISetAccessorDict(node);
		}
	}

	/**
	 * Maps an AccessorDeclaration to an IAccessorDict
	 * @param {Optional<AccessorDeclaration>} node
	 * @returns {IAccessorDict | null}
	 */
	public toIAccessorDict (node: AccessorDeclaration|null|undefined): IAccessorDict|null {
		const result = this.toIAccessorCtor(node);
		if (result == null) return null;

		return {
			...result,
			nodeKind: "ACCESSOR"
		};
	}

	/**
	 * Maps a GetAccessorDeclaration to an IGetAccessorDict
	 * @param {Optional<GetAccessorDeclaration>} node
	 * @returns {IGetAccessorDict | null}
	 */
	public toIGetAccessorDict (node: GetAccessorDeclaration|null|undefined): IGetAccessorDict|null {
		const result = this.toIGetAccessorCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			...this.toIFunctionLikeDict(node)!,
			nodeKind: "ACCESSOR"
		};
	}

	/**
	 * Maps a SetAccessorDeclaration to an ISetAccessorDict
	 * @param {Optional<SetAccessorDeclaration>} node
	 * @returns {ISetAccessorDict | null}
	 */
	public toISetAccessorDict (node: SetAccessorDeclaration|null|undefined): ISetAccessorDict|null {
		const result = this.toISetAccessorCtor(node);
		if (result == null || node == null) return null;

		return {
			...result,
			decorators: node.decorators == null ? null : node.decorators.map(decorator => this.toIDecoratorDict(decorator)!),
			parameters: node.parameters.map(parameter => this.toIParameterDict(parameter)!),
			nodeKind: "ACCESSOR"
		};
	}

	/**
	 * Maps an ImportSpecifier to an INamedImportExportDict
	 * @param {ImportSpecifier|ExportSpecifier?} node
	 * @returns {INamedImportExportDict?}
	 */
	public toINamedImportExportDict (node: Optional<ImportSpecifier|ExportSpecifier>): INamedImportExportDict|null {
		const result = this.toINamedImportExportCtor(node);
		if (result == null) return null;

		return {
			...result,
			nodeKind: "NAMED_IMPORT_EXPORT"
		};
	}

	/**
	 * Maps an ImportClause to an IImportClauseDict
	 * @param {ImportClause?} node
	 * @returns {IImportClauseDict?}
	 */
	public toIImportClauseDict (node: Optional<ImportClause>): IImportClauseDict|null {
		if (node == null) return null;

		return {
			defaultName: node.name == null ? null : node.name.text,
			namespace: node.namedBindings == null || !isNamespaceImport(node.namedBindings)
				? null
				: node.namedBindings.name.text,
			namedImports: node.namedBindings == null || isNamespaceImport(node.namedBindings)
				? null
				: node.namedBindings.elements.map(element => this.toINamedImportExportDict(element)!),
			nodeKind: "IMPORT_CLAUSE"
		};
	}
}