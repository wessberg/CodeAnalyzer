import {AccessorDeclaration, ArrayBindingElement, ArrayBindingPattern, BindingElement, BindingName, CallSignatureDeclaration, ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, ConstructSignatureDeclaration, Decorator, ExportSpecifier, FunctionLikeDeclaration, GetAccessorDeclaration, HeritageClause, Identifier, ImportClause, ImportSpecifier, IndexSignatureDeclaration, InterfaceDeclaration, MethodDeclaration, MethodSignature, ModifiersArray, ObjectBindingPattern, ParameterDeclaration, PropertyDeclaration, PropertySignature, SetAccessorDeclaration, SignatureDeclaration, TypeElement, TypeLiteralNode} from "typescript";
import {IImportClauseCtor} from "../light-ast/ctor/import-clause/i-import-clause-ctor";
import {INamedImportExportCtor} from "../light-ast/ctor/named-import-export/i-named-import-export-ctor";
import {ITypeLiteralCtor} from "../light-ast/ctor/type-literal/i-type-literal-ctor";
import {IInterfaceCtor} from "../light-ast/ctor/interface/i-interface-ctor";
import {ITypeElementCtor, TypeElementCtor} from "../light-ast/ctor/type-element/i-type-element-ctor";
import {HeritageCtor, IExtendsHeritageCtor, IImplementsHeritageCtor} from "../light-ast/ctor/heritage/i-heritage-ctor";
import {IPropertySignatureCtor} from "../light-ast/ctor/property-signature/i-property-signature-ctor";
import {ICallSignatureCtor} from "../light-ast/ctor/call-signature/i-call-signature-ctor";
import {IConstructSignatureCtor} from "../light-ast/ctor/construct-signature/i-construct-signature-ctor";
import {IMethodSignatureCtor} from "../light-ast/ctor/method-signature/i-method-signature-ctor";
import {IIndexSignatureCtor} from "../light-ast/ctor/index-signature/i-index-signature-ctor";
import {ISignatureCtor} from "../light-ast/ctor/signature/i-signature-ctor";
import {IParameterCtor} from "../light-ast/ctor/parameter/i-parameter-ctor";
import {BindingNameCtor, IArrayBindingNameCtor, INormalBindingNameCtor, IObjectBindingNameCtor} from "../light-ast/ctor/binding-name/binding-name-ctor";
import {IObjectBindingElementCtor} from "../light-ast/ctor/binding-element/i-object-binding-element-ctor";
import {ArrayBindingElementCtor, INormalArrayBindingElementCtor, IOmittedArrayBindingElementCtor} from "../light-ast/ctor/binding-element/array-binding-element-ctor";
import {IDecoratorCtor} from "../light-ast/ctor/decorator/i-decorator-ctor";
import {IAllModifiersCtor} from "../light-ast/ctor/modifier/i-all-modifiers-ctor";
import {IClassCtor} from "../light-ast/ctor/class/i-class-ctor";
import {ClassElementCtor} from "../light-ast/ctor/class-element/class-element-ctor";
import {ClassAccessorCtor} from "../light-ast/ctor/class-accessor/class-accessor-ctor";
import {IFunctionLikeCtor} from "../light-ast/ctor/function-like/i-function-like-ctor";
import {AccessorCtor, IAccessorCtor, IGetAccessorCtor, ISetAccessorCtor} from "../light-ast/ctor/accessor/accessor-ctor";
import {IClassPropertyCtor} from "../light-ast/ctor/class-property/i-class-property-ctor";
import {IClassMethodCtor} from "../light-ast/ctor/class-method/i-class-method-ctor";
import {IMethodCtor} from "../light-ast/ctor/method/i-method-ctor";
import {IFunctionLikeWithParametersCtor} from "../light-ast/ctor/function-like-with-parameters/i-function-like-with-parameters-ctor";
import {IConstructorCtor} from "../light-ast/ctor/constructor/i-constructor-ctor";

export interface INodeToCtorMapperBase {
	toIClassCtor (node: ClassDeclaration|ClassExpression|undefined|null): IClassCtor|null;
	toIImportClauseCtor (node: ImportClause|undefined|null): IImportClauseCtor|null;
	toINamedImportExportCtor (node: ImportSpecifier|ExportSpecifier|undefined|null): INamedImportExportCtor|null;
	toITypeLiteralCtor (node: TypeLiteralNode|InterfaceDeclaration|undefined|null): ITypeLiteralCtor|null;
	toIInterfaceCtor (node: InterfaceDeclaration|undefined|null): IInterfaceCtor|null;
	toITypeElementCtor (node: TypeElement|undefined|null): ITypeElementCtor|null;
	toTypeElementCtor (node: TypeElement|undefined|null): TypeElementCtor|null;
	toHeritageCtor (node: HeritageClause|undefined|null): HeritageCtor|null;
	toIAllModifiersCtor (modifiers: ModifiersArray|undefined|null): IAllModifiersCtor|null;
	toIExtendsHeritageCtor (node: HeritageClause|undefined|null): IExtendsHeritageCtor|null;
	toIImplementsHeritageCtor (node: HeritageClause|undefined|null): IImplementsHeritageCtor|null;
	toIPropertySignatureCtor (node: PropertySignature|undefined|null): IPropertySignatureCtor|null;
	toICallSignatureCtor (node: CallSignatureDeclaration|undefined|null): ICallSignatureCtor|null;
	toIConstructSignatureCtor (node: ConstructSignatureDeclaration|undefined|null): IConstructSignatureCtor|null;
	toIMethodSignatureCtor (node: MethodSignature|undefined|null): IMethodSignatureCtor|null;
	toIIndexSignatureCtor (node: IndexSignatureDeclaration|undefined|null): IIndexSignatureCtor|null;
	toISignatureCtor (node: SignatureDeclaration|undefined|null): ISignatureCtor|null;
	toIParameterCtor (node: ParameterDeclaration|undefined|null): IParameterCtor|null;
	toBindingNameCtor (node: BindingName|undefined|null): BindingNameCtor|null;
	toINormalBindingNameCtor (node: Identifier|undefined|null): INormalBindingNameCtor|null;
	toIObjectBindingNameCtor (node: ObjectBindingPattern|undefined|null): IObjectBindingNameCtor|null;
	toIArrayBindingNameCtor (node: ArrayBindingPattern|undefined|null): IArrayBindingNameCtor|null;
	toIObjectBindingElementCtor (node: BindingElement|undefined|null): IObjectBindingElementCtor|null;
	toINormalArrayBindingElementCtor (node: BindingElement|undefined|null): INormalArrayBindingElementCtor|null;
	toIOmittedArrayBindingElementCtor (node: ArrayBindingElement|undefined|null): IOmittedArrayBindingElementCtor|null;
	toArrayBindingElementCtor (node: ArrayBindingElement|undefined|null): ArrayBindingElementCtor|null;
	toIDecoratorCtor (node: Decorator|undefined|null): IDecoratorCtor|null;
	toClassElementCtor (node: ClassElement|undefined|null): ClassElementCtor|null;
	toClassAccessorCtor (node: AccessorDeclaration|undefined|null): ClassAccessorCtor|null;
	toAccessorCtor (node: AccessorDeclaration|undefined|null): AccessorCtor|null;
	toIFunctionLikeCtor (node: FunctionLikeDeclaration|undefined|null): IFunctionLikeCtor|null;
	toIGetAccessorCtor (node: GetAccessorDeclaration|undefined|null): IGetAccessorCtor|null;
	toISetAccessorCtor (node: SetAccessorDeclaration|undefined|null): ISetAccessorCtor|null;
	toIAccessorCtor (node: AccessorDeclaration|undefined|null): IAccessorCtor|null;
	toIClassPropertyCtor (node: PropertyDeclaration|undefined|null): IClassPropertyCtor|null;
	toIClassMethodCtor (node: MethodDeclaration|undefined|null): IClassMethodCtor|null;
	toIMethodCtor (node: MethodDeclaration|undefined|null): IMethodCtor|null;
	toIFunctionLikeWithParametersCtor (node: FunctionLikeDeclaration|undefined|null): IFunctionLikeWithParametersCtor|null;
	toIConstructorCtor (node: ConstructorDeclaration|undefined|null): IConstructorCtor|null;
	fallbackToNull<T> (item: T|undefined): T|null;
}