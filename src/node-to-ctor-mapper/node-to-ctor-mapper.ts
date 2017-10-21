import {ArrayBindingElement, ArrayBindingPattern, BindingElement, BindingName, CallSignatureDeclaration, ConstructSignatureDeclaration, Decorator, ExportSpecifier, HeritageClause, Identifier, ImportClause, ImportSpecifier, IndexSignatureDeclaration, InterfaceDeclaration, isArrayBindingPattern, isCallSignatureDeclaration, isConstructSignatureDeclaration, isIdentifier, isIndexSignatureDeclaration, isMethodSignature, isNamespaceImport, isObjectBindingPattern, isOmittedExpression, isPropertySignature, MethodSignature, ObjectBindingPattern, ParameterDeclaration, PropertySignature, SignatureDeclaration, TypeElement, TypeLiteralNode} from "typescript";
import {INodeToCtorMapperBase} from "./i-node-to-ctor-mapper";
import {IHeritageClauseService} from "../service/heritage-clause/i-heritage-clause-service";
import {IInterfaceDeclarationService} from "../service/interface-declaration/i-interface-declaration-service";
import {IPropertyNameService} from "../service/property-name/i-property-name-service";
import {IPropertySignatureService} from "../service/property-signature/i-property-signature-service";
import {IMethodSignatureService} from "../service/method-signature/i-method-signature-service";
import {IIndexSignatureService} from "../service/index-signature/i-index-signature-service";
import {IModifierService} from "../service/modifier/i-modifier-service";
import {ITypeNodeService} from "../service/type-node/i-type-node-service";
import {IParameterService} from "../service/parameter/i-parameter-service";
import {IBindingElementService} from "../service/binding-element/i-binding-element-service";
import {IDecoratorService} from "../service/decorator/i-decorator-service";
import {IPrinter} from "@wessberg/typescript-ast-util";
import {IDecoratorCtor} from "../light-ast/ctor/decorator/i-decorator-ctor";
import {IObjectBindingElementCtor} from "../light-ast/ctor/binding-element/i-object-binding-element-ctor";
import {ArrayBindingElementCtor, INormalArrayBindingElementCtor, IOmittedArrayBindingElementCtor} from "../light-ast/ctor/binding-element/array-binding-element-ctor";
import {BindingNameCtor, IArrayBindingNameCtor, INormalBindingNameCtor, IObjectBindingNameCtor} from "../light-ast/ctor/binding-name/binding-name-ctor";
import {IParameterCtor} from "../light-ast/ctor/parameter/i-parameter-ctor";
import {ITypeElementCtor, TypeElementCtor} from "../light-ast/ctor/type-element/i-type-element-ctor";
import {ICallSignatureCtor} from "../light-ast/ctor/call-signature/i-call-signature-ctor";
import {IConstructSignatureCtor} from "../light-ast/ctor/construct-signature/i-construct-signature-ctor";
import {IMethodSignatureCtor} from "../light-ast/ctor/method-signature/i-method-signature-ctor";
import {IIndexSignatureCtor} from "../light-ast/ctor/index-signature/i-index-signature-ctor";
import {IPropertySignatureCtor} from "../light-ast/ctor/property-signature/i-property-signature-ctor";
import {ISignatureCtor} from "../light-ast/ctor/signature/i-signature-ctor";
import {HeritageCtor, IExtendsHeritageCtor, IImplementsHeritageCtor} from "../light-ast/ctor/heritage/i-heritage-ctor";
import {ITypeLiteralCtor} from "../light-ast/ctor/type-literal/i-type-literal-ctor";
import {IInterfaceCtor} from "../light-ast/ctor/interface/i-interface-ctor";
import {INamedImportExportCtor} from "../light-ast/ctor/named-import-export/i-named-import-export-ctor";
import {IImportClauseCtor} from "../light-ast/ctor/import-clause/i-import-clause-ctor";

/**
 * A class that can map nodes to ctor's
 */
export class NodeToCtorMapper implements INodeToCtorMapperBase {
	constructor (private heritageClauseService: IHeritageClauseService,
							 private interfaceDeclarationService: IInterfaceDeclarationService,
							 private propertyNameService: IPropertyNameService,
							 private propertySignatureService: IPropertySignatureService,
							 private methodSignatureService: IMethodSignatureService,
							 private indexSignatureService: IIndexSignatureService,
							 private modifierService: IModifierService,
							 private typeNodeService: ITypeNodeService,
							 private parameterService: IParameterService,
							 private bindingElementService: IBindingElementService,
							 private decoratorService: IDecoratorService,
							 private printer: IPrinter) {
	}

	/**
	 * Maps a Decorator to an IDecoratorCtor
	 * @param {Decorator} node
	 * @returns {IDecoratorCtor}
	 */
	public toIDecoratorCtor (node: Decorator|undefined): IDecoratorCtor|undefined {
		if (node == null) return undefined;

		return {
			expression: this.decoratorService.takeDecoratorExpression(node)
		};
	}

	/**
	 * Maps a BindingElement to an IObjectBindingNameElementCtor
	 * @param {BindingElement} node
	 * @returns {IObjectBindingElementCtor}
	 */
	public toIObjectBindingElementCtor (node: BindingElement|undefined): IObjectBindingElementCtor|undefined {
		if (node == null) return undefined;

		return {
			name: this.bindingElementService.getName(node),
			propertyName: this.bindingElementService.getPropertyName(node),
			initializer: this.bindingElementService.getInitializer(node),
			isRestSpread: this.bindingElementService.isRestSpread(node)
		};
	}

	/**
	 * Maps a BindingElement to an INormalArrayBindingElementCtor
	 * @param {BindingElement} node
	 * @returns {INormalArrayBindingElementCtor}
	 */
	public toINormalArrayBindingElementCtor (node: BindingElement|undefined): INormalArrayBindingElementCtor|undefined {
		if (node == null) return undefined;

		return {
			kind: "NORMAL",
			name: this.bindingElementService.getName(node),
			initializer: this.bindingElementService.getInitializer(node),
			isRestSpread: this.bindingElementService.isRestSpread(node)
		};
	}

	/**
	 * Maps an ArrayBindingElement to an IOmittedArrayBindingElementCtor
	 * @param {ArrayBindingElement} _node
	 * @returns {IOmittedArrayBindingElementCtor}
	 */
	public toIOmittedArrayBindingElementCtor (_node: ArrayBindingElement|undefined): IOmittedArrayBindingElementCtor|undefined {
		return {
			kind: "OMITTED"
		};
	}

	/**
	 * Maps an ArrayBindingElement to an ArrayBindingElementCtor
	 * @param {ArrayBindingElement} node
	 * @returns {ArrayBindingElementCtor}
	 */
	public toArrayBindingElementCtor (node: ArrayBindingElement|undefined): ArrayBindingElementCtor|undefined {
		if (node == null) return undefined;

		if (isOmittedExpression(node)) return this.toIOmittedArrayBindingElementCtor(node);
		return this.toINormalArrayBindingElementCtor(node);
	}

	/**
	 * Maps a BindingName to a BindingNameCtor
	 * @param {BindingName} node
	 * @returns {BindingNameCtor}
	 */
	public toBindingNameCtor (node: BindingName|undefined): BindingNameCtor|undefined {
		if (node == null) return undefined;

		if (isIdentifier(node)) return this.toINormalBindingNameCtor(node);
		if (isArrayBindingPattern(node)) return this.toIArrayBindingNameCtor(node);
		if (isObjectBindingPattern(node)) return this.toIObjectBindingNameCtor(node);

		return undefined;
	}

	/**
	 * Maps an Identifier to an INormalBindingNameCtor
	 * @param {Identifier} node
	 * @returns {INormalBindingNameCtor}
	 */
	public toINormalBindingNameCtor (node: Identifier|undefined): INormalBindingNameCtor|undefined {
		if (node == null) return undefined;

		return {
			kind: "NORMAL",
			name: node.text
		};
	}

	/**
	 * Maps an ObjectBindingPattern to an IObjectBindingNameCtor
	 * @param {ObjectBindingPattern} node
	 * @returns {IObjectBindingNameCtor}
	 */
	public toIObjectBindingNameCtor (node: ObjectBindingPattern|undefined): IObjectBindingNameCtor|undefined {
		if (node == null) return undefined;

		return {
			kind: "OBJECT_BINDING",
			elements: node.elements.map(element => this.toIObjectBindingElementCtor(element)!)
		};
	}

	/**
	 * Maps an ArrayBindingPattern to an IArrayBindingNameCtor
	 * @param {ArrayBindingPattern} node
	 * @returns {IArrayBindingNameCtor}
	 */
	public toIArrayBindingNameCtor (node: ArrayBindingPattern|undefined): IArrayBindingNameCtor|undefined {
		if (node == null) return undefined;

		return {
			kind: "ARRAY_BINDING",
			elements: node.elements.map(element => this.toArrayBindingElementCtor(element)!)
		};
	}

	/**
	 * Maps a ParameterDeclaration to an IParameterCtor
	 * @param {ParameterDeclaration} node
	 * @returns {IParameterCtor}
	 */
	public toIParameterCtor (node: ParameterDeclaration|undefined): IParameterCtor|undefined {
		if (node == null) return undefined;
		return {
			type: this.parameterService.getTypeName(node),
			initializer: this.parameterService.getInitializer(node),
			isRestSpread: this.parameterService.isRestSpread(node),
			isOptional: this.parameterService.isOptional(node),
			isReadonly: this.parameterService.isReadonly(node),
			decorators: node.decorators == null ? null : node.decorators.map(decorator => this.toIDecoratorCtor(decorator)!),
			name: this.toBindingNameCtor(node.name)!
		};
	}

	/**
	 * Maps a TypeElement to a TypeElementCtor
	 * @param {TypeElement} node
	 * @returns {TypeElementCtor}
	 */
	public toTypeElementCtor (node: TypeElement|undefined): TypeElementCtor|undefined {
		if (node == null) return undefined;

		if (isCallSignatureDeclaration(node)) return this.toICallSignatureCtor(node);
		if (isConstructSignatureDeclaration(node)) return this.toIConstructSignatureCtor(node);
		if (isMethodSignature(node)) return this.toIMethodSignatureCtor(node);
		if (isIndexSignatureDeclaration(node)) return this.toIIndexSignatureCtor(node);
		if (isPropertySignature(node)) return this.toIPropertySignatureCtor(node);
		return undefined;
	}

	/**
	 * Maps a CallSignatureDeclaration to an ICallSignatureCtor
	 * @param {CallSignatureDeclaration} node
	 * @returns {ICallSignatureCtor}
	 */
	public toICallSignatureCtor (node: CallSignatureDeclaration|undefined): ICallSignatureCtor|undefined {
		if (node == null) return undefined;
		return {
			...this.toITypeElementCtor(node)!,
			...this.toISignatureCtor(node)!
		};
	}

	/**
	 * Maps a ConstructSignatureDeclaration to an IConstructSignatureCtor
	 * @param {ConstructSignatureDeclaration} node
	 * @returns {IConstructSignatureCtor}
	 */
	public toIConstructSignatureCtor (node: ConstructSignatureDeclaration|undefined): IConstructSignatureCtor|undefined {
		if (node == null) return undefined;
		return {
			...this.toITypeElementCtor(node)!,
			...this.toISignatureCtor(node)!
		};
	}

	/**
	 * Maps a MethodSignature to an IMethodSignatureCtor
	 * @param {MethodSignature} node
	 * @returns {IMethodSignatureCtor}
	 */
	public toIMethodSignatureCtor (node: MethodSignature|undefined): IMethodSignatureCtor|undefined {
		if (node == null) return undefined;
		return {
			...this.toITypeElementCtor(node)!,
			...this.toISignatureCtor(node)!,
			name: this.methodSignatureService.getName(node)
		};
	}

	/**
	 * Maps an IndexSignatureDeclaration to an IIndexSignatureCtor
	 * @param {IndexSignatureDeclaration} node
	 * @returns {IIndexSignatureCtor}
	 */
	public toIIndexSignatureCtor (node: IndexSignatureDeclaration|undefined): IIndexSignatureCtor|undefined {
		if (node == null) return undefined;
		return {
			...this.toITypeElementCtor(node)!,
			...this.toISignatureCtor(node)!,
			name: this.indexSignatureService.getName(node)
		};
	}

	/**
	 * Maps a PropertySignature to an IPropertySignatureCtor
	 * @param {PropertySignature} node
	 * @returns {IPropertySignatureCtor}
	 */
	public toIPropertySignatureCtor (node: PropertySignature|undefined): IPropertySignatureCtor|undefined {
		if (node == null) return undefined;
		return {
			...this.toITypeElementCtor(node)!,
			type: this.propertySignatureService.getTypeName(node),
			initializer: this.propertySignatureService.getExpression(node),
			isReadonly: this.modifierService.isReadonly(node)
		};
	}

	/**
	 * Maps a SignatureDeclaration to an ISignatureCtor
	 * @param {SignatureDeclaration} node
	 * @returns {ISignatureCtor}
	 */
	public toISignatureCtor (node: SignatureDeclaration|undefined): ISignatureCtor|undefined {
		if (node == null) return undefined;

		return {
			name: node.name == null ? null : this.propertyNameService.getName(node.name),
			type: node.type == null ? null : this.typeNodeService.getNameOfType(node.type),
			parameters: node.parameters.map(parameter => this.toIParameterCtor(parameter)!),
			typeParameters: node.typeParameters == null ? null : node.typeParameters.map(typeParameter => this.printer.print(typeParameter))
		};
	}

	/**
	 * Maps a HeritageClause to an IExtendsHeritageCtor, if possible
	 * @param {HeritageClause} node
	 * @returns {IExtendsHeritageCtor}
	 */
	public toIExtendsHeritageCtor (node: HeritageClause|undefined): IExtendsHeritageCtor|undefined {
		if (node == null || !this.heritageClauseService.isExtendsClause(node)) return undefined;

		// Otherwise, it is an implements clause.
		return {
			kind: "EXTENDS",
			...this.heritageClauseService.getFirstTypeNameWithArguments(node)
		};
	}

	/**
	 * Maps a HeritageClause to an IImplementsHeritageCtor, if possible
	 * @param {HeritageClause} node
	 * @returns {IImplementsHeritageCtor}
	 */
	public toIImplementsHeritageCtor (node: HeritageClause|undefined): IImplementsHeritageCtor|undefined {
		if (node == null || !this.heritageClauseService.isImplementsClause(node)) return undefined;

		// Otherwise, it is an implements clause.
		return {
			kind: "IMPLEMENTS",
			elements: this.heritageClauseService.getTypeNamesWithArguments(node)
		};
	}

	/**
	 * Maps a HeritageClause to a HeritageCtor
	 * @param {HeritageClause} node
	 * @returns {HeritageCtor}
	 */
	public toHeritageCtor (node: HeritageClause|undefined): HeritageCtor|undefined {
		if (node == null) return undefined;

		// If it is an implements clause
		if (this.heritageClauseService.isExtendsClause(node)) {
			return this.toIExtendsHeritageCtor(node);
		}

		// Otherwise, it is an implements clause
		return this.toIImplementsHeritageCtor(node);
	}

	/**
	 * Maps a TypeLiteralNode to a TypeLiteralCtor
	 * @param {TypeLiteralNode|InterfaceDeclaration} node
	 * @returns {ITypeLiteralCtor}
	 */
	public toITypeLiteralCtor (node: TypeLiteralNode|InterfaceDeclaration|undefined): ITypeLiteralCtor|undefined {
		if (node == null) return undefined;
		return {
			members: node.members.map(member => this.toITypeElementCtor(member)!)
		};
	}

	/**
	 * Maps an InterfaceDeclaration to an IInterfaceCtor
	 * @param {InterfaceDeclaration} node
	 * @returns {IInterfaceCtor}
	 */
	public toIInterfaceCtor (node: InterfaceDeclaration|undefined): IInterfaceCtor|undefined {
		if (node == null) return undefined;

		return {
			members: node.members.map(member => this.toTypeElementCtor(member)!),
			name: this.interfaceDeclarationService.getName(node),
			extends: node.heritageClauses == null || node.heritageClauses.length < 1 ? null : this.heritageClauseService.getFirstTypeNameWithArguments(node.heritageClauses[0]),
			typeParameters: this.interfaceDeclarationService.getTypeParameterNames(node)
		};
	}

	/**
	 * Maps a TypeElement to an ITypeElementCtor
	 * @param {TypeElement} node
	 * @returns {ITypeElementCtor}
	 */
	public toITypeElementCtor (node: TypeElement|undefined): ITypeElementCtor|undefined {
		if (node == null) return undefined;

		return {
			name: node.name == null ? null : this.propertyNameService.getName(node.name),
			isOptional: node.questionToken != null
		};
	}

	/**
	 * Maps an ImportSpecifier to an INamedImportExportCtor
	 * @param {ImportSpecifier|ExportSpecifier?} node
	 * @returns {INamedImportExportCtor?}
	 */
	public toINamedImportExportCtor (node: ImportSpecifier|ExportSpecifier|undefined): INamedImportExportCtor|undefined {
		if (node == null) return undefined;

		return {
			name: node.name.text,
			propertyName: node.propertyName == null ? null : node.propertyName.text
		};
	}

	/**
	 * Maps an ImportClause to an IImportClauseCtor
	 * @param {ImportClause?} node
	 * @returns {IImportClauseCtor?}
	 */
	public toIImportClauseCtor (node: ImportClause|undefined): IImportClauseCtor|undefined {
		if (node == null) return undefined;

		return {
			defaultName: node.name == null ? null : node.name.text,
			namespace: node.namedBindings == null || !isNamespaceImport(node.namedBindings)
				? null
				: node.namedBindings.name.text,
			namedImports: node.namedBindings == null || isNamespaceImport(node.namedBindings)
				? null
				: node.namedBindings.elements.map(element => this.toINamedImportExportCtor(element)!)
		};
	}

}