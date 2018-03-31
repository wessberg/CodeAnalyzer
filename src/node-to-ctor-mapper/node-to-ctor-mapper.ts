import {AccessorDeclaration, ArrayBindingElement, ArrayBindingPattern, BindingElement, BindingName, CallSignatureDeclaration, ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, ConstructSignatureDeclaration, Decorator, ExportSpecifier, FunctionLikeDeclaration, GetAccessorDeclaration, HeritageClause, Identifier, ImportClause, ImportSpecifier, IndexSignatureDeclaration, InterfaceDeclaration, isAccessor, isArrayBindingPattern, isCallSignatureDeclaration, isConstructorDeclaration, isConstructSignatureDeclaration, isGetAccessorDeclaration, isIdentifier, isIndexSignatureDeclaration, isMethodDeclaration, isMethodSignature, isNamespaceImport, isObjectBindingPattern, isOmittedExpression, isPropertyDeclaration, isPropertySignature, isSemicolonClassElement, MethodDeclaration, MethodSignature, ModifiersArray, ObjectBindingPattern, ParameterDeclaration, PropertyDeclaration, PropertySignature, SetAccessorDeclaration, SignatureDeclaration, SyntaxKind, TypeElement, TypeLiteralNode} from "typescript";
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
import {IAllModifiersCtor} from "../light-ast/ctor/modifier/i-all-modifiers-ctor";
import {IClassCtor} from "../light-ast/ctor/class/i-class-ctor";
import {IClassService} from "../service/class/i-class-service";
import {ClassElementCtor} from "../light-ast/ctor/class-element/class-element-ctor";
import {ClassAccessorCtor} from "../light-ast/ctor/class-accessor/class-accessor-ctor";
import {AccessorCtor, IAccessorCtor, IGetAccessorCtor, ISetAccessorCtor} from "../light-ast/ctor/accessor/accessor-ctor";
import {IGetAccessorService} from "../service/get-accessor/i-get-accessor-service";
import {ISetAccessorService} from "../service/set-accessor/i-set-accessor-service";
import {IFunctionLikeCtor} from "../light-ast/ctor/function-like/i-function-like-ctor";
import {IClassPropertyCtor} from "../light-ast/ctor/class-property/i-class-property-ctor";
import {IClassMethodCtor} from "../light-ast/ctor/class-method/i-class-method-ctor";
import {IMethodCtor} from "../light-ast/ctor/method/i-method-ctor";
import {IMethodService} from "../service/method/i-method-service";
import {IFunctionLikeWithParametersCtor} from "../light-ast/ctor/function-like-with-parameters/i-function-like-with-parameters-ctor";
import {IConstructorCtor} from "../light-ast/ctor/constructor/i-constructor-ctor";

/**
 * A class that can map nodes to ctor's
 */
export class NodeToCtorMapper implements INodeToCtorMapperBase {
	constructor (protected readonly heritageClauseService: IHeritageClauseService,
							 protected readonly interfaceDeclarationService: IInterfaceDeclarationService,
							 protected readonly propertyNameService: IPropertyNameService,
							 protected readonly methodService: IMethodService,
							 protected readonly propertySignatureService: IPropertySignatureService,
							 protected readonly methodSignatureService: IMethodSignatureService,
							 protected readonly indexSignatureService: IIndexSignatureService,
							 protected readonly getAccessorService: IGetAccessorService,
							 protected readonly setAccessorService: ISetAccessorService,
							 protected readonly classService: IClassService,
							 protected readonly modifierService: IModifierService,
							 protected readonly typeNodeService: ITypeNodeService,
							 protected readonly parameterService: IParameterService,
							 protected readonly bindingElementService: IBindingElementService,
							 protected readonly decoratorService: IDecoratorService,
							 protected readonly printer: IPrinter) {
	}

	/**
	 * Maps a Decorator to an IDecoratorCtor
	 * @param {Decorator} node
	 * @returns {IDecoratorCtor}
	 */
	public toIDecoratorCtor (node: Decorator|undefined|null): IDecoratorCtor|null {
		if (node == null) return null;

		return {
			expression: this.decoratorService.takeDecoratorExpression(node)
		};
	}

	/**
	 * Maps a ModifiersArray to an IAllModifiersCtor
	 * @param {ModifiersArray | null | undefined} modifiers
	 * @returns {IAllModifiersCtor | null}
	 */
	public toIAllModifiersCtor (modifiers: ModifiersArray|undefined|null): IAllModifiersCtor|null {
		if (modifiers == null) return null;
		const visibility = this.modifierService.getAccessModifier(modifiers);

		return {
			isAbstract: this.modifierService.isAbstract(modifiers),
			isAsync: this.modifierService.isAsync(modifiers),
			isConst: this.modifierService.isConst(modifiers),
			isDeclared: this.modifierService.isDeclared(modifiers),
			isDefault: this.modifierService.isDefault(modifiers),
			isExported: this.modifierService.isExported(modifiers),
			isReadonly: this.modifierService.isReadonly(modifiers),
			isStatic: this.modifierService.isStatic(modifiers),
			visibility: visibility == null ? "public" : visibility
		};
	}

	/**
	 * Maps a BindingElement to an IObjectBindingNameElementCtor
	 * @param {BindingElement} node
	 * @returns {IObjectBindingElementCtor}
	 */
	public toIObjectBindingElementCtor (node: BindingElement|undefined|null): IObjectBindingElementCtor|null {
		if (node == null) return null;

		return {
			name: this.bindingElementService.getName(node),
			propertyName: this.fallbackToNull(this.bindingElementService.getPropertyName(node)),
			initializer: this.fallbackToNull(this.bindingElementService.getInitializer(node)),
			isRestSpread: this.bindingElementService.isRestSpread(node)
		};
	}

	/**
	 * Maps a BindingElement to an INormalArrayBindingElementCtor
	 * @param {BindingElement} node
	 * @returns {INormalArrayBindingElementCtor}
	 */
	public toINormalArrayBindingElementCtor (node: BindingElement|undefined|null): INormalArrayBindingElementCtor|null {
		if (node == null) return null;

		return {
			kind: "NORMAL",
			name: this.bindingElementService.getName(node),
			initializer: this.fallbackToNull(this.bindingElementService.getInitializer(node)),
			isRestSpread: this.bindingElementService.isRestSpread(node)
		};
	}

	/**
	 * Maps an ArrayBindingElement to an IOmittedArrayBindingElementCtor
	 * @param {ArrayBindingElement} _node
	 * @returns {IOmittedArrayBindingElementCtor}
	 */
	public toIOmittedArrayBindingElementCtor (_node: ArrayBindingElement|undefined|null): IOmittedArrayBindingElementCtor|null {
		return {
			kind: "OMITTED"
		};
	}

	/**
	 * Maps an ArrayBindingElement to an ArrayBindingElementCtor
	 * @param {ArrayBindingElement} node
	 * @returns {ArrayBindingElementCtor}
	 */
	public toArrayBindingElementCtor (node: ArrayBindingElement|undefined|null): ArrayBindingElementCtor|null {
		if (node == null) return null;

		if (isOmittedExpression(node)) return this.toIOmittedArrayBindingElementCtor(node);
		return this.toINormalArrayBindingElementCtor(node);
	}

	/**
	 * Maps a BindingName to a BindingNameCtor
	 * @param {BindingName} node
	 * @returns {BindingNameCtor}
	 */
	public toBindingNameCtor (node: BindingName|undefined|null): BindingNameCtor|null {
		if (node == null) return null;

		if (isIdentifier(node)) return this.toINormalBindingNameCtor(node);
		if (isArrayBindingPattern(node)) return this.toIArrayBindingNameCtor(node);
		if (isObjectBindingPattern(node)) return this.toIObjectBindingNameCtor(node);

		return null;
	}

	/**
	 * Maps an Identifier to an INormalBindingNameCtor
	 * @param {Identifier} node
	 * @returns {INormalBindingNameCtor}
	 */
	public toINormalBindingNameCtor (node: Identifier|undefined|null): INormalBindingNameCtor|null {
		if (node == null) return null;

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
	public toIObjectBindingNameCtor (node: ObjectBindingPattern|undefined|null): IObjectBindingNameCtor|null {
		if (node == null) return null;

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
	public toIArrayBindingNameCtor (node: ArrayBindingPattern|undefined|null): IArrayBindingNameCtor|null {
		if (node == null) return null;

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
	public toIParameterCtor (node: ParameterDeclaration|undefined|null): IParameterCtor|null {
		if (node == null) return null;
		return {
			type: this.fallbackToNull(this.parameterService.getTypeName(node)),
			initializer: this.fallbackToNull(this.parameterService.getInitializer(node)),
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
	public toTypeElementCtor (node: TypeElement|undefined|null): TypeElementCtor|null {
		if (node == null) return null;

		if (isCallSignatureDeclaration(node)) return this.toICallSignatureCtor(node);
		if (isConstructSignatureDeclaration(node)) return this.toIConstructSignatureCtor(node);
		if (isMethodSignature(node)) return this.toIMethodSignatureCtor(node);
		if (isIndexSignatureDeclaration(node)) return this.toIIndexSignatureCtor(node);
		if (isPropertySignature(node)) return this.toIPropertySignatureCtor(node);

		return null;
	}

	/**
	 * Maps a CallSignatureDeclaration to an ICallSignatureCtor
	 * @param {CallSignatureDeclaration} node
	 * @returns {ICallSignatureCtor}
	 */
	public toICallSignatureCtor (node: CallSignatureDeclaration|undefined|null): ICallSignatureCtor|null {
		if (node == null) return null;
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
	public toIConstructSignatureCtor (node: ConstructSignatureDeclaration|undefined|null): IConstructSignatureCtor|null {
		if (node == null) return null;
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
	public toIMethodSignatureCtor (node: MethodSignature|undefined|null): IMethodSignatureCtor|null {
		if (node == null) return null;
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
	public toIIndexSignatureCtor (node: IndexSignatureDeclaration|undefined|null): IIndexSignatureCtor|null {
		if (node == null) return null;
		return {
			...this.toITypeElementCtor(node)!,
			...this.toISignatureCtor(node)!,
			name: this.fallbackToNull(this.indexSignatureService.getName(node))
		};
	}

	/**
	 * Maps a PropertySignature to an IPropertySignatureCtor
	 * @param {PropertySignature} node
	 * @returns {IPropertySignatureCtor}
	 */
	public toIPropertySignatureCtor (node: PropertySignature|undefined|null): IPropertySignatureCtor|null {
		if (node == null) return null;
		return {
			...this.toITypeElementCtor(node)!,
			type: this.fallbackToNull(this.propertySignatureService.getTypeName(node)),
			initializer: this.fallbackToNull(this.propertySignatureService.getExpression(node)),
			isReadonly: this.modifierService.isReadonly(node)
		};
	}

	/**
	 * Maps a SignatureDeclaration to an ISignatureCtor
	 * @param {SignatureDeclaration} node
	 * @returns {ISignatureCtor}
	 */
	public toISignatureCtor (node: SignatureDeclaration|undefined|null): ISignatureCtor|null {
		if (node == null) return null;

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
	public toIExtendsHeritageCtor (node: HeritageClause|undefined|null): IExtendsHeritageCtor|null {
		if (node == null || !this.heritageClauseService.isExtendsClause(node)) return null;

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
	public toIImplementsHeritageCtor (node: HeritageClause|undefined|null): IImplementsHeritageCtor|null {
		if (node == null || !this.heritageClauseService.isImplementsClause(node)) return null;

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
	public toHeritageCtor (node: HeritageClause|undefined|null): HeritageCtor|null {
		if (node == null) return null;

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
	public toITypeLiteralCtor (node: TypeLiteralNode|InterfaceDeclaration|undefined|null): ITypeLiteralCtor|null {
		if (node == null) return null;
		return {
			members: node.members.map(member => this.toITypeElementCtor(member)!)
		};
	}

	/**
	 * Maps an InterfaceDeclaration to an IInterfaceCtor
	 * @param {InterfaceDeclaration} node
	 * @returns {IInterfaceCtor}
	 */
	public toIInterfaceCtor (node: InterfaceDeclaration|undefined|null): IInterfaceCtor|null {
		if (node == null) return null;

		return {
			members: node.members.map(member => this.toTypeElementCtor(member)!),
			name: this.interfaceDeclarationService.getName(node),
			extends: node.heritageClauses == null ? [] : [].concat.apply([], node.heritageClauses.map(heritageClause => this.heritageClauseService.getTypeNamesWithArguments(heritageClause))),
			typeParameters: this.fallbackToNull(this.interfaceDeclarationService.getTypeParameterNames(node))
		};
	}

	/**
	 * Maps a TypeElement to an ITypeElementCtor
	 * @param {TypeElement} node
	 * @returns {ITypeElementCtor}
	 */
	public toITypeElementCtor (node: TypeElement|undefined|null): ITypeElementCtor|null {
		if (node == null) return null;

		return {
			name: node.name == null ? null : this.propertyNameService.getName(node.name),
			isOptional: node.questionToken != null
		};
	}

	/**
	 * Maps a Class to an IClassCtor
	 * @param {ClassDeclaration | ClassExpression | null | undefined} node
	 * @returns {IClassCtor | null}
	 */
	public toIClassCtor (node: ClassDeclaration|ClassExpression|undefined|null): IClassCtor|null {
		if (node == null) return null;

		// Get the name of the class
		const className = this.classService.getNameOfClass(node);
		const extendsHeritageClause = this.classService.getExtendedClass(node);
		const implementsHeritageClause = this.classService.getImplements(node);
		const name = className == null ? null : className;
		const extendsClass = extendsHeritageClause == null ? null : this.toIExtendsHeritageCtor(extendsHeritageClause);
		const implementsInterfaces = implementsHeritageClause == null ? null : this.toIImplementsHeritageCtor(implementsHeritageClause);
		const decorators = node.decorators == null ? null : node.decorators.map(decorator => this.toIDecoratorCtor(decorator)!);
		const isAbstract = this.modifierService.hasModifierWithName("abstract", node);
		const typeParameters = node.typeParameters == null ? null : node.typeParameters.map(typeParameter => this.printer.print(typeParameter));
		const members = node.members == null ? null : node.members.map(member => this.toClassElementCtor(member)!).filter(member => member != null);

		return {
			name, isAbstract, decorators, extendsClass, implementsInterfaces, typeParameters, members
		};
	}

	/**
	 * Maps a ClassElement to a ClassElementCtor
	 * @param {ClassElement|null|?} node
	 * @returns {ClassElementCtor|null}
	 */
	public toClassElementCtor (node: ClassElement|undefined|null): ClassElementCtor|null {
		if (node == null || isSemicolonClassElement(node)) return null;

		if (isAccessor(node)) {
			return this.toClassAccessorCtor(node);
		}

		else if (isPropertyDeclaration(node)) {
			return this.toIClassPropertyCtor(node);
		}

		else if (isMethodDeclaration(node)) {
			return this.toIClassMethodCtor(node);
		}

		else if (isConstructorDeclaration(node)) {
			return this.toIConstructorCtor(node);
		}

		else {
			throw new TypeError(`Could not map a node of kind: "${SyntaxKind[node.kind]}" to a ClassElementCtor`);
		}
	}

	/**
	 * Maps a AccessorDeclaration to a ClassAccessorCtor
	 * @param {AccessorDeclaration| null | undefined} node
	 * @returns {ClassAccessorCtor | null}
	 */
	public toClassAccessorCtor (node: AccessorDeclaration|undefined|null): ClassAccessorCtor|null {
		if (node == null) return null;

		const visibility = this.modifierService.getAccessModifier(node);

		return {
			...this.toAccessorCtor(node)!,
			isStatic: this.modifierService.isStatic(node),
			isAbstract: this.modifierService.isAbstract(node),
			visibility: visibility == null ? "public" : visibility
		};
	}

	/**
	 * Maps a ConstructorDeclaration to a IConstructorCtor
	 * @param {ConstructorDeclaration | null | undefined} node
	 * @returns {IConstructorCtor | null}
	 */
	public toIConstructorCtor (node: ConstructorDeclaration|undefined|null): IConstructorCtor|null {
		if (node == null) return null;

		return {
			body: node.body == null ? null : node.body.statements.map(statement => this.printer.print(statement)).join("\n"),
			parameters: node.parameters.map(parameter => this.toIParameterCtor(parameter)!)
		};
	}

	/**
	 * Maps a MethodDeclaration to a IClassMethodCtor
	 * @param {MethodDeclaration| null | undefined} node
	 * @returns {IClassMethodCtor | null}
	 */
	public toIClassMethodCtor (node: MethodDeclaration|undefined|null): IClassMethodCtor|null {
		if (node == null) return null;

		const visibility = this.modifierService.getAccessModifier(node);

		return {
			...this.toIMethodCtor(node)!,
			isAbstract: this.modifierService.isAbstract(node),
			isOptional: node.questionToken != null,
			isStatic: this.modifierService.isStatic(node),
			visibility: visibility == null ? "public" : visibility
		};
	}

	/**
	 * Maps a PropertyDeclaration to a IClassPropertyCtor
	 * @param {AccessorDeclaration| null | undefined} node
	 * @returns {IClassPropertyCtor | null}
	 */
	public toIClassPropertyCtor (node: PropertyDeclaration|undefined|null): IClassPropertyCtor|null {
		if (node == null) return null;

		const visibility = this.modifierService.getAccessModifier(node);

		return {
			name: this.propertyNameService.getName(node.name),
			decorators: node.decorators == null ? null : node.decorators.map(decorator => this.toIDecoratorCtor(decorator)!),
			type: node.type == null ? null : this.typeNodeService.getNameOfType(node.type),
			initializer: node.initializer == null ? null : this.printer.print(node.initializer),
			visibility: visibility == null ? "public" : visibility,
			isAbstract: this.modifierService.isAbstract(node),
			isReadonly: this.modifierService.isReadonly(node),
			isOptional: node.questionToken != null,
			isAsync: this.modifierService.isAsync(node),
			isStatic: this.modifierService.isStatic(node)
		};
	}

	/**
	 * Maps a MethodDeclaration to a IMethodCtor
	 * @param {MethodDeclaration| null | undefined} node
	 * @returns {IMethodCtor | null}
	 */
	public toIMethodCtor (node: MethodDeclaration|undefined|null): IMethodCtor|null {
		if (node == null) return null;

		return {
			...this.toIFunctionLikeWithParametersCtor(node)!,
			name: this.methodService.getName(node),
			isAsync: this.modifierService.isAsync(node)
		};
	}

	/**
	 * Maps a FunctionLikeDeclaration to an IFunctionLikeCtor
	 * @param {FunctionLikeDeclaration | null | undefined} node
	 * @returns {IFunctionLikeCtor | null}
	 */
	public toIFunctionLikeCtor (node: FunctionLikeDeclaration|undefined|null): IFunctionLikeCtor|null {
		if (node == null) return null;

		return {
			decorators: node.decorators == null ? null : node.decorators.map(decorator => this.toIDecoratorCtor(decorator)!),
			type: node.type == null ? null : this.typeNodeService.getNameOfType(node.type),
			body: node.body == null ? null : "statements" in node.body ? node.body.statements.map(statement => this.printer.print(statement)).join("\n") : this.printer.print(node.body)
		};
	}

	/**
	 * Maps a FunctionLikeDeclaration to a IFunctionLikeWithParametersCtor
	 * @param {FunctionLikeDeclaration| null | undefined} node
	 * @returns {IMethodCtor | null}
	 */
	public toIFunctionLikeWithParametersCtor (node: FunctionLikeDeclaration|undefined|null): IFunctionLikeWithParametersCtor|null {
		if (node == null) return null;

		return {
			...this.toIFunctionLikeCtor(node)!,
			parameters: node.parameters.map(parameter => this.toIParameterCtor(parameter)!),
			typeParameters: node.typeParameters == null ? null : node.typeParameters.map(typeParameter => this.printer.print(typeParameter))
		};
	}

	/**
	 * Maps a AccessorDeclaration to a AccessorCtor
	 * @param {AccessorDeclaration| null | undefined} node
	 * @returns {AccessorCtor | null}
	 */
	public toAccessorCtor (node: AccessorDeclaration|undefined|null): AccessorCtor|null {
		if (node == null) return null;

		if (isGetAccessorDeclaration(node)) {
			return this.toIGetAccessorCtor(node);
		}

		else {
			return this.toISetAccessorCtor(node);
		}
	}

	/**
	 * Maps a AccessorDeclaration to an IAccessorCtor
	 * @param {AccessorDeclaration| null | undefined} node
	 * @returns {IAccessorCtor | null}
	 */
	public toIAccessorCtor (node: AccessorDeclaration|undefined|null): IAccessorCtor|null {
		if (node == null) return null;

		if (isGetAccessorDeclaration(node)) {
			return {
				kind: "GET",
				name: this.getAccessorService.getName(node)
			};
		}

		return {
			kind: "SET",
			name: this.setAccessorService.getName(node)
		};
	}

	/**
	 * Maps a GetAccessorDeclaration to an IGetAccessorCtor
	 * @param {GetAccessorDeclaration | null | undefined} node
	 * @returns {IGetAccessorCtor | null}
	 */
	public toIGetAccessorCtor (node: GetAccessorDeclaration|undefined|null): IGetAccessorCtor|null {
		if (node == null) return null;

		return {
			...this.toIAccessorCtor(node)!,
			...this.toIFunctionLikeCtor(node)!,
			kind: "GET"
		};
	}

	/**
	 * Maps a SetAccessorDeclaration to an ISetAccessorCtor
	 * @param {SetAccessorDeclaration | null | undefined} node
	 * @returns {ISetAccessorCtor | null}
	 */
	public toISetAccessorCtor (node: SetAccessorDeclaration|undefined|null): ISetAccessorCtor|null {
		if (node == null) return null;

		return {
			...this.toIAccessorCtor(node)!,
			decorators: node.decorators == null ? null : node.decorators.map(decorator => this.toIDecoratorCtor(decorator)!),
			parameters: node.parameters.map(parameter => this.toIParameterCtor(parameter)!),
			body: node.body == null ? null : node.body.statements.map(statement => this.printer.print(statement)).join("\n"),
			kind: "SET"
		};
	}

	/**
	 * Maps an ImportSpecifier to an INamedImportExportCtor
	 * @param {ImportSpecifier|ExportSpecifier?} node
	 * @returns {INamedImportExportCtor?}
	 */
	public toINamedImportExportCtor (node: ImportSpecifier|ExportSpecifier|undefined|null): INamedImportExportCtor|null {
		if (node == null) return null;

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
	public toIImportClauseCtor (node: ImportClause|undefined|null): IImportClauseCtor|null {
		if (node == null) return null;

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

	/**
	 * Makes sure that the provided item will fallback to null rather than undefined if it is undefined
	 * @param {T} item
	 * @returns {T}
	 */
	public fallbackToNull<T> (item: T|undefined): T|null {
		if (item == null) return null;
		return item;
	}

}