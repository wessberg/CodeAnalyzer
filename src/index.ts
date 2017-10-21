import "./services";

// Services
export {CodeAnalyzer} from "./code-analyzer/code-analyzer";
export {ICodeAnalyzer} from "./code-analyzer/i-code-analyzer";
export {IResolver} from "./resolver/i-resolver-getter";
export {IPrinter} from "@wessberg/typescript-ast-util";
export {IBindingElementService} from "./service/binding-element/i-binding-element-service";
export {ICallExpressionService} from "./service/call-expression/i-call-expression-service";
export {IClassService} from "./service/class/i-class-service";
export {IConstructorService} from "./service/constructor/i-constructor-service";
export {IDecoratorService} from "./service/decorator/i-decorator-service";
export {IExportService} from "./service/export/i-export-service";
export {IHeritageClauseService} from "./service/heritage-clause/i-heritage-clause-service";
export {IImportService} from "./service/import/i-import-service";
export {IIndexSignatureService} from "./service/index-signature/i-index-signature-service";
export {IInterfaceDeclarationService} from "./service/interface-declaration/i-interface-declaration-service";
export {IMethodService} from "./service/method/i-method-service";
export {IMethodSignatureService} from "./service/method-signature/i-method-signature-service";
export {IModifierService} from "./service/modifier/i-modifier-service";
export {INamedExportsService} from "./service/named-exports/i-named-exports-service";
export {INamedImportsService} from "./service/named-imports/i-named-imports-service";
export {INamespaceImportService} from "./service/namespace-import/i-namespace-import-service";
export {INodeService} from "./service/node/i-node-service";
export {IParameterService} from "./service/parameter/i-parameter-service";
export {IPropertyService} from "./service/property/i-property-service";
export {IPropertyAccessExpressionService} from "./service/property-access-expression/i-property-access-expression-service";
export {IPropertyNameService} from "./service/property-name/i-property-name-service";
export {IPropertySignatureService} from "./service/property-signature/i-property-signature-service";
export {ITypeDeclarationService} from "./service/type-declaration/i-type-declaration-service";
export {ITypeElementService} from "./service/type-element/i-type-element-service";
export {ITypeLiteralNodeService} from "./service/type-literal-node/i-type-literal-node-service";
export {ITypeNodeService} from "./service/type-node/i-type-node-service";
export {ITypescriptLanguageService} from "@wessberg/typescript-language-service";

// Ctors with predicates
export {AccessorCtor, IAccessorCtor, IGetAccessorCtor, ISetAccessorCtor} from "./light-ast/ctor/accessor/accessor-ctor";
export {isAccessorCtor} from "./light-ast/ctor/accessor/is-accessor-ctor";
export {isIAccessorCtor} from "./light-ast/ctor/accessor/is-i-accessor-ctor";
export {isIGetAccessorCtor} from "./light-ast/ctor/accessor/is-i-get-accessor-ctor";
export {isISetAccessorCtor} from "./light-ast/ctor/accessor/is-i-set-accessor-ctor";
export {ArrayBindingElementCtor, INormalArrayBindingElementCtor, IOmittedArrayBindingElementCtor} from "./light-ast/ctor/binding-element/array-binding-element-ctor";
export {IObjectBindingElementCtor} from "./light-ast/ctor/binding-element/i-object-binding-element-ctor";
export {isArrayBindingElementCtor} from "./light-ast/ctor/binding-element/is-array-binding-element-ctor";
export {isINormalArrayBindingElementCtor} from "./light-ast/ctor/binding-element/is-i-normal-array-binding-element-ctor";
export {isIObjectBindingElementCtor} from "./light-ast/ctor/binding-element/is-i-object-binding-element-ctor";
export {isIOmittedArrayBindingElementCtor} from "./light-ast/ctor/binding-element/is-i-omitted-array-binding-element-ctor";
export {BindingNameCtor, IArrayBindingNameCtor, IBindingNameCtor, INormalBindingNameCtor, IObjectBindingNameCtor} from "./light-ast/ctor/binding-name/binding-name-ctor";
export {isBindingNameCtor} from "./light-ast/ctor/binding-name/is-binding-name-ctor";
export {isIArrayBindingNameCtor} from "./light-ast/ctor/binding-name/is-i-array-binding-name-ctor";
export {isIBindingNameCtor} from "./light-ast/ctor/binding-name/is-i-binding-name-ctor";
export {isINormalBindingNameCtor} from "./light-ast/ctor/binding-name/is-i-normal-binding-name-ctor";
export {isIObjectBindingNameCtor} from "./light-ast/ctor/binding-name/is-i-object-binding-name-ctor";
export {ICallSignatureCtor} from "./light-ast/ctor/call-signature/i-call-signature-ctor";
export {isICallSignatureCtor} from "./light-ast/ctor/call-signature/is-i-call-signature-ctor";
export {IClassCtor} from "./light-ast/ctor/class/i-class-ctor";
export {isIClassCtor} from "./light-ast/ctor/class/is-i-class-ctor";
export {ClassAccessorCtor, IClassAccessorCtor, IClassGetAccessorCtor, IClassSetAccessorCtor} from "./light-ast/ctor/class-accessor/class-accessor-ctor";
export {isClassAccessorCtor} from "./light-ast/ctor/class-accessor/is-class-accessor-ctor";
export {isIClassAccessorCtor} from "./light-ast/ctor/class-accessor/is-i-class-accessor-ctor";
export {isIClassGetAccessorCtor} from "./light-ast/ctor/class-accessor/is-i-class-get-accessor-ctor";
export {isIClassSetAccessorCtor} from "./light-ast/ctor/class-accessor/is-i-class-set-accessor-ctor";
export {ClassElementCtor} from "./light-ast/ctor/class-element/class-element-ctor";
export {isClassElementCtor} from "./light-ast/ctor/class-element/is-class-element-ctor";
export {IClassMethodCtor} from "./light-ast/ctor/class-method/i-class-method-ctor";
export {isIClassMethodCtor} from "./light-ast/ctor/class-method/is-i-class-method-ctor";
export {IClassPropertyCtor} from "./light-ast/ctor/class-property/i-class-property-ctor";
export {isIClassPropertyCtor} from "./light-ast/ctor/class-property/is-i-class-property-ctor";
export {IConstructSignatureCtor} from "./light-ast/ctor/construct-signature/i-construct-signature-ctor";
export {isIConstructSignatureCtor} from "./light-ast/ctor/construct-signature/is-i-construct-signature-ctor";
export {IConstructorCtor} from "./light-ast/ctor/constructor/i-constructor-ctor";
export {isIConstructorCtor} from "./light-ast/ctor/constructor/is-i-constructor-ctor";
export {IDecoratorCtor} from "./light-ast/ctor/decorator/i-decorator-ctor";
export {isIDecoratorCtor} from "./light-ast/ctor/decorator/is-i-decorator-ctor";
export {FunctionCtor, IArrowFunctionCtor, IFunctionCtor, INormalFunctionCtor} from "./light-ast/ctor/function/function-ctor";
export {isIFunctionCtor} from "./light-ast/ctor/function/is-i-function-ctor";
export {isIArrowFunctionCtor} from "./light-ast/ctor/function/is-i-arrow-function-ctor";
export {isINormalFunctionCtor} from "./light-ast/ctor/function/is-i-normal-function-ctor";
export {IFunctionLikeCtor} from "./light-ast/ctor/function-like/i-function-like-ctor";
export {isIFunctionLikeCtor} from "./light-ast/ctor/function-like/is-i-function-like-ctor";
export {IFunctionLikeWithParametersCtor} from "./light-ast/ctor/function-like-with-parameters/i-function-like-with-parameters-ctor";
export {isIFunctionLikeWithParametersCtor} from "./light-ast/ctor/function-like-with-parameters/is-i-function-like-with-parameters-ctor";
export {IHeritageCtor, HeritageCtor, IExtendsHeritageCtor, IImplementsHeritageCtor} from "./light-ast/ctor/heritage/i-heritage-ctor";
export {isHeritageCtor} from "./light-ast/ctor/heritage/is-heritage-ctor";
export {isIExtendsHeritageCtor} from "./light-ast/ctor/heritage/is-i-extends-heritage-ctor";
export {isIHeritageCtor} from "./light-ast/ctor/heritage/is-i-heritage-ctor";
export {isIImplementsHeritageCtor} from "./light-ast/ctor/heritage/is-i-implements-heritage-ctor";
export {IImportCtor} from "./light-ast/ctor/import/i-import-ctor";
export {isIImportCtor} from "./light-ast/ctor/import/is-i-import-ctor";
export {isIImportClauseCtor} from "./light-ast/ctor/import-clause/is-i-import-clause-ctor";
export {IImportClauseCtor} from "./light-ast/ctor/import-clause/i-import-clause-ctor";
export {IIndexSignatureCtor} from "./light-ast/ctor/index-signature/i-index-signature-ctor";
export {isIIndexSignatureCtor} from "./light-ast/ctor/index-signature/is-i-index-signature-ctor";
export {IInterfaceCtor} from "./light-ast/ctor/interface/i-interface-ctor";
export {isIInterfaceCtor} from "./light-ast/ctor/interface/is-i-interface-ctor";
export {IMethodCtor} from "./light-ast/ctor/method/i-method-ctor";
export {isIMethodCtor} from "./light-ast/ctor/method/is-i-method-ctor";
export {IMethodSignatureCtor} from "./light-ast/ctor/method-signature/i-method-signature-ctor";
export {isIMethodSignatureCtor} from "./light-ast/ctor/method-signature/is-i-method-signature-ctor";
export {IAllModifiersCtor} from "./light-ast/ctor/modifier/i-all-modifiers-ctor";
export {INamedImportExportCtor} from "./light-ast/ctor/named-import-export/i-named-import-export-ctor";
export {isINamedImportExportCtor} from "./light-ast/ctor/named-import-export/is-i-named-import-export-ctor";
export {IParameterCtor} from "./light-ast/ctor/parameter/i-parameter-ctor";
export {isIParameterCtor} from "./light-ast/ctor/parameter/is-i-parameter-ctor";
export {IPropertySignatureCtor} from "./light-ast/ctor/property-signature/i-property-signature-ctor";
export {isIPropertySignatureCtor} from "./light-ast/ctor/property-signature/is-i-property-signature-ctor";
export {ISignatureCtor} from "./light-ast/ctor/signature/i-signature-ctor";
export {isISignatureCtor} from "./light-ast/ctor/signature/is-i-signature-ctor";
export {ITypeElementCtor, TypeElementCtor} from "./light-ast/ctor/type-element/i-type-element-ctor";
export {isITypeElementCtor} from "./light-ast/ctor/type-element/is-i-type-element-ctor";
export {isTypeElementCtor} from "./light-ast/ctor/type-element/is-type-element-ctor";
export {ITypeLiteralCtor} from "./light-ast/ctor/type-literal/i-type-literal-ctor";
export {isITypeLiteralCtor} from "./light-ast/ctor/type-literal/is-i-type-literal-ctor";
export {ICallExpressionCtor} from "./light-ast/ctor/call-expression/i-call-expression-ctor";
export {isICallExpressionCtor} from "./light-ast/ctor/call-expression/is-i-call-expression-ctor";

// Dicts with predicates
export {AccessorKind} from "./light-ast/dict/accessor/accessor-kind";
export {ArrayBindingElementKind} from "./light-ast/dict/binding-element/array-binding-element-kind";
export {BindingNameKind} from "./light-ast/dict/binding-name/binding-name-kind";
export {FunctionKind} from "./light-ast/dict/function/function-kind";
export {HeritageKind} from "./light-ast/dict/heritage/heritage-kind";
export {ModifierKind} from "./light-ast/dict/modifier/modifier-kind";
export {INameWithTypeArguments} from "./light-ast/dict/name-with-type-arguments/i-name-with-type-arguments";
export {isINameWithTypeArguments} from "./light-ast/dict/name-with-type-arguments/is-i-name-with-type-arguments";
export {INodeDict} from "./light-ast/dict/node/i-node-dict";
export {NodeKind} from "./light-ast/dict/node/node-kind";
export {isINodeDict} from "./light-ast/dict/node/is-i-node-dict";
export {VisibilityKind} from "./light-ast/dict/visibility/visibility-kind";
export {AccessorDict, IAccessorDict, IGetAccessorDict, ISetAccessorDict} from "./light-ast/dict/accessor/accessor-dict";
export {isAccessorDict} from "./light-ast/dict/accessor/is-accessor-dict";
export {isIAccessorDict} from "./light-ast/dict/accessor/is-i-accessor-dict";
export {isIGetAccessorDict} from "./light-ast/dict/accessor/is-i-get-accessor-dict";
export {isISetAccessorDict} from "./light-ast/dict/accessor/is-i-set-accessor-dict";
export {ArrayBindingElementDict, INormalArrayBindingElementDict, IOmittedArrayBindingElementDict} from "./light-ast/dict/binding-element/array-binding-element-dict";
export {IObjectBindingElementDict} from "./light-ast/dict/binding-element/i-object-binding-element-dict";
export {isArrayBindingElementDict} from "./light-ast/dict/binding-element/is-array-binding-element-dict";
export {isINormalArrayBindingElementDict} from "./light-ast/dict/binding-element/is-i-normal-array-binding-element-dict";
export {isIObjectBindingElementDict} from "./light-ast/dict/binding-element/is-i-object-binding-element-dict";
export {isIOmittedArrayBindingElementDict} from "./light-ast/dict/binding-element/is-i-omitted-array-binding-element-dict";
export {BindingNameDict, IArrayBindingNameDict, IBindingNameDict, INormalBindingNameDict, IObjectBindingNameDict} from "./light-ast/dict/binding-name/binding-name-dict";
export {isBindingNameDict} from "./light-ast/dict/binding-name/is-binding-name-dict";
export {isIArrayBindingNameDict} from "./light-ast/dict/binding-name/is-i-array-binding-name-dict";
export {isIBindingNameDict} from "./light-ast/dict/binding-name/is-i-binding-name-dict";
export {isINormalBindingNameDict} from "./light-ast/dict/binding-name/is-i-normal-binding-name-dict";
export {isIObjectBindingNameDict} from "./light-ast/dict/binding-name/is-i-object-binding-name-dict";
export {ICallSignatureDict} from "./light-ast/dict/call-signature/i-call-signature-dict";
export {isICallSignatureDict} from "./light-ast/dict/call-signature/is-i-call-signature-dict";
export {IClassDict} from "./light-ast/dict/class/i-class-dict";
export {isIClassDict} from "./light-ast/dict/class/is-i-class-dict";
export {ClassAccessorDict, IClassAccessorDict, IClassGetAccessorDict, IClassSetAccessorDict} from "./light-ast/dict/class-accessor/class-accessor-dict";
export {isClassAccessorDict} from "./light-ast/dict/class-accessor/is-class-accessor-dict";
export {isIClassAccessorDict} from "./light-ast/dict/class-accessor/is-i-class-accessor-dict";
export {isIClassGetAccessorDict} from "./light-ast/dict/class-accessor/is-i-class-get-accessor-dict";
export {isIClassSetAccessorDict} from "./light-ast/dict/class-accessor/is-i-class-set-accessor-dict";
export {ClassElementDict} from "./light-ast/dict/class-element/class-element-dict";
export {isClassElementDict} from "./light-ast/dict/class-element/is-class-element-dict";
export {IClassMethodDict} from "./light-ast/dict/class-method/i-class-method-dict";
export {isIClassMethodDict} from "./light-ast/dict/class-method/is-i-class-method-dict";
export {IClassPropertyDict} from "./light-ast/dict/class-property/i-class-property-dict";
export {isIClassPropertyDict} from "./light-ast/dict/class-property/is-i-class-property-dict";
export {IConstructSignatureDict} from "./light-ast/dict/construct-signature/i-construct-signature-dict";
export {isIConstructSignatureDict} from "./light-ast/dict/construct-signature/is-i-construct-signature-dict";
export {IConstructorDict} from "./light-ast/dict/constructor/i-constructor-dict";
export {isIConstructorDict} from "./light-ast/dict/constructor/is-i-constructor-dict";
export {IDecoratorDict} from "./light-ast/dict/decorator/i-decorator-dict";
export {isIDecoratorDict} from "./light-ast/dict/decorator/is-i-decorator-dict";
export {FunctionDict, IArrowFunctionDict, IFunctionDict, INormalFunctionDict} from "./light-ast/dict/function/function-dict";
export {isIFunctionDict} from "./light-ast/dict/function/is-i-function-dict";
export {isIArrowFunctionDict} from "./light-ast/dict/function/is-i-arrow-function-dict";
export {isINormalFunctionDict} from "./light-ast/dict/function/is-i-normal-function-dict";
export {IFunctionLikeDict} from "./light-ast/dict/function-like/i-function-like-dict";
export {isIFunctionLikeDict} from "./light-ast/dict/function-like/is-i-function-like-dict";
export {IFunctionLikeWithParametersDict} from "./light-ast/dict/function-like-with-parameters/i-function-like-with-parameters-dict";
export {isIFunctionLikeWithParametersDict} from "./light-ast/dict/function-like-with-parameters/is-i-function-like-with-parameters-dict";
export {IHeritageDict, HeritageDict, IExtendsHeritageDict, IImplementsHeritageDict} from "./light-ast/dict/heritage/i-heritage-dict";
export {isHeritageDict} from "./light-ast/dict/heritage/is-heritage-dict";
export {isIExtendsHeritageDict} from "./light-ast/dict/heritage/is-i-extends-heritage-dict";
export {isIHeritageDict} from "./light-ast/dict/heritage/is-i-heritage-dict";
export {isIImplementsHeritageDict} from "./light-ast/dict/heritage/is-i-implements-heritage-dict";
export {IImportDict} from "./light-ast/dict/import/i-import-dict";
export {isIImportDict} from "./light-ast/dict/import/is-i-import-dict";
export {isIImportClauseDict} from "./light-ast/dict/import-clause/is-i-import-clause-dict";
export {IImportClauseDict} from "./light-ast/dict/import-clause/i-import-clause-dict";
export {IIndexSignatureDict} from "./light-ast/dict/index-signature/i-index-signature-dict";
export {isIIndexSignatureDict} from "./light-ast/dict/index-signature/is-i-index-signature-dict";
export {IInterfaceDict} from "./light-ast/dict/interface/i-interface-dict";
export {isIInterfaceDict} from "./light-ast/dict/interface/is-i-interface-dict";
export {IMethodDict} from "./light-ast/dict/method/i-method-dict";
export {isIMethodDict} from "./light-ast/dict/method/is-i-method-dict";
export {IMethodSignatureDict} from "./light-ast/dict/method-signature/i-method-signature-dict";
export {isIMethodSignatureDict} from "./light-ast/dict/method-signature/is-i-method-signature-dict";
export {IAllModifiersDict} from "./light-ast/dict/modifier/i-all-modifiers-dict";
export {INamedImportExportDict} from "./light-ast/dict/named-import-export/i-named-import-export-dict";
export {isINamedImportExportDict} from "./light-ast/dict/named-import-export/is-i-named-import-export-dict";
export {IParameterDict} from "./light-ast/dict/parameter/i-parameter-dict";
export {isIParameterDict} from "./light-ast/dict/parameter/is-i-parameter-dict";
export {IPropertySignatureDict} from "./light-ast/dict/property-signature/i-property-signature-dict";
export {isIPropertySignatureDict} from "./light-ast/dict/property-signature/is-i-property-signature-dict";
export {ISignatureDict} from "./light-ast/dict/signature/i-signature-dict";
export {isISignatureDict} from "./light-ast/dict/signature/is-i-signature-dict";
export {ITypeElementDict, TypeElementDict} from "./light-ast/dict/type-element/i-type-element-dict";
export {isITypeElementDict} from "./light-ast/dict/type-element/is-i-type-element-dict";
export {isTypeElementDict} from "./light-ast/dict/type-element/is-type-element-dict";
export {ITypeLiteralDict} from "./light-ast/dict/type-literal/i-type-literal-dict";
export {isITypeLiteralDict} from "./light-ast/dict/type-literal/is-i-type-literal-dict";
export {ICallExpressionDict} from "./light-ast/dict/call-expression/i-call-expression-dict";
export {isICallExpressionDict} from "./light-ast/dict/call-expression/is-i-call-expression-dict";

// Types
export {PropertyAccessCallExpression} from "./service/call-expression/property-access-call-expression";
export {IOwnOrInheritedMethodWithNameResult} from "./service/class/i-own-or-inherited-method-with-name-result";
export {IOwnOrInheritedPropertyWithNameResult} from "./service/class/i-own-or-inherited-property-with-name-result";
export {IOwnOrInheritedMemberWithNameResult} from "./service/class/i-own-or-inherited-member-with-name-result";
export {IOwnOrInheritedConstructorResult} from "./service/class/i-own-or-inherited-constructor-result";
export {IOwnOrInheritedGetterWithNameResult} from "./service/class/i-own-or-inherited-getter-with-name-result";
export {IOwnOrInheritedSetterWithNameResult} from "./service/class/i-own-or-inherited-setter-with-name-result";