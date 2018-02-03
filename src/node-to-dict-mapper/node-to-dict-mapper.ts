import {INodeToDictMapperBase} from "./i-node-to-dict-mapper";
import {AccessorDeclaration, ArrayBindingElement, ArrayBindingPattern, BindingElement, BindingName, CallSignatureDeclaration, ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, ConstructSignatureDeclaration, Decorator, ExportSpecifier, FunctionLikeDeclaration, GetAccessorDeclaration, HeritageClause, Identifier, ImportClause, ImportSpecifier, IndexSignatureDeclaration, InterfaceDeclaration, isAccessor, isCallSignatureDeclaration, isConstructorDeclaration, isConstructSignatureDeclaration, isGetAccessorDeclaration, isIndexSignatureDeclaration, isMethodDeclaration, isMethodSignature, isNamespaceImport, isPropertyDeclaration, isPropertySignature, MethodDeclaration, MethodSignature, ModifiersArray, ObjectBindingPattern, ParameterDeclaration, PropertyDeclaration, PropertySignature, SetAccessorDeclaration, SignatureDeclaration, SyntaxKind, TypeElement, TypeLiteralNode} from "typescript";
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

/**
 * A class that can map nodes to dicts
 */
export class NodeToDictMapper extends NodeToCtorMapper implements INodeToDictMapperBase {

	/**
	 * Maps a Decorator to an IDecoratorDict
	 * @param {Decorator} node
	 * @returns {IDecoratorDict}
	 */
	public toIDecoratorDict (node: Decorator|undefined|null): IDecoratorDict|null {
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
	public toIObjectBindingElementDict (node: BindingElement|undefined|null): IObjectBindingElementDict|null {
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
	public toINormalArrayBindingElementDict (node: BindingElement|undefined|null): INormalArrayBindingElementDict|null {
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
	public toIOmittedArrayBindingElementDict (node: ArrayBindingElement|undefined|null): IOmittedArrayBindingElementDict|null {
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
	public toArrayBindingElementDict (node: ArrayBindingElement|undefined|null): ArrayBindingElementDict|null {
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
	public toBindingNameDict (node: BindingName|undefined|null): BindingNameDict|null {
		const result = this.toBindingNameCtor(node);
		if (result == null) return null;

		return {
			...result,
			nodeKind: "BINDING_NAME"
		};
	}

	/**
	 * Maps an Identifier to an INormalBindingNameDict
	 * @param {Identifier} node
	 * @returns {INormalBindingNameDict}
	 */
	public toINormalBindingNameDict (node: Identifier|undefined|null): INormalBindingNameDict|null {
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
	public toIObjectBindingNameDict (node: ObjectBindingPattern|undefined|null): IObjectBindingNameDict|null {
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
	public toIArrayBindingNameDict (node: ArrayBindingPattern|undefined|null): IArrayBindingNameDict|null {
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
	public toIParameterDict (node: ParameterDeclaration|undefined|null): IParameterDict|null {
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
	public toIConstructSignatureDict (node: ConstructSignatureDeclaration|undefined|null): IConstructSignatureDict|null {
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
	public toIMethodSignatureDict (node: MethodSignature|undefined|null): IMethodSignatureDict|null {
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
	public toIIndexSignatureDict (node: IndexSignatureDeclaration|undefined|null): IIndexSignatureDict|null {
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
	public toIPropertySignatureDict (node: PropertySignature|undefined|null): IPropertySignatureDict|null {
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
	public toISignatureDict (node: SignatureDeclaration|undefined|null): ISignatureDict|null {
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
	public toIExtendsHeritageDict (node: HeritageClause|undefined|null): IExtendsHeritageDict|null {
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
	public toIImplementsHeritageDict (node: HeritageClause|undefined|null): IImplementsHeritageDict|null {
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
	public toHeritageDict (node: HeritageClause|undefined|null): HeritageDict|null {
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
	public toITypeLiteralDict (node: TypeLiteralNode|InterfaceDeclaration|undefined|null): ITypeLiteralDict|null {
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
	public toIInterfaceDict (node: InterfaceDeclaration|undefined|null): IInterfaceDict|null {
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
	public toITypeElementDict (node: TypeElement|undefined|null): ITypeElementDict|null {
		return this.toITypeElementCtor(node);
	}

	/**
	 * Maps a ModifiersArray to an IAllModifiersDict
	 * @param {ModifiersArray | null | undefined} modifiers
	 * @returns {IAllModifiersDict | null}
	 */
	public toIAllModifiersDict (modifiers: ModifiersArray|undefined|null): IAllModifiersDict|null {
		return this.toIAllModifiersCtor(modifiers);
	}

	/**
	 * Maps a Class to an IClassDict
	 * @param {ClassDeclaration | ClassExpression | null | undefined} node
	 * @returns {IClassDict | null}
	 */
	public toIClassDict (node: ClassDeclaration|ClassExpression|undefined|null): IClassDict|null {
		const result = this.toIClassCtor(node);
		if (result == null || node == null) return null;

		const extendsHeritageClause = this.classService.getExtendedClass(node);
		const implementsHeritageClause = this.classService.getImplements(node);

		return {
			...result,
			extendsClass: extendsHeritageClause == null ? null : this.toIExtendsHeritageDict(extendsHeritageClause),
			implementsInterfaces: implementsHeritageClause == null ? null : this.toIImplementsHeritageDict(implementsHeritageClause),
			decorators: node.decorators == null ? null : node.decorators.map(decorator => this.toIDecoratorDict(decorator)!),
			members: node.members == null ? null : node.members.map(member => this.toClassElementDict(member)!),
			nodeKind: "CLASS"
		};
	}

	/**
	 * Maps a ClassElement to an ClassElementDict
	 * @param {ClassElement | null | undefined} node
	 * @returns {ClassElementDict | null}
	 */
	public toClassElementDict (node: ClassElement|undefined|null): ClassElementDict|null {
		if (node == null) return null;

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
	 * @param {AccessorDeclaration | null | undefined} node
	 * @returns {ClassAccessorDict | null}
	 */
	public toClassAccessorDict (node: AccessorDeclaration|undefined|null): ClassAccessorDict|null {
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
	 * @param {ts.ConstructorDeclaration | null | undefined} node
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
	 * @param {MethodDeclaration | null | undefined} node
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
	 * @param {PropertyDeclaration | null | undefined} node
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
	 * @param {ts.MethodDeclaration | null | undefined} node
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
	 * @param {FunctionLikeDeclaration | null | undefined} node
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
	 * @param {FunctionLikeDeclaration | null | undefined} node
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
	 * @param {AccessorDeclaration | null | undefined} node
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
	 * @param {AccessorDeclaration | null | undefined} node
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
	 * @param {GetAccessorDeclaration | null | undefined} node
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
	 * @param {SetAccessorDeclaration | null | undefined} node
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
	public toINamedImportExportDict (node: ImportSpecifier|ExportSpecifier|undefined|null): INamedImportExportDict|null {
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
	public toIImportClauseDict (node: ImportClause|undefined|null): IImportClauseDict|null {
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