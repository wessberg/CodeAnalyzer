import {ITypeFormatter} from "./formatter/type/type-formatter/i-type-formatter";
import {TypeFormatter} from "./formatter/type/type-formatter/type-formatter";
import {ITypescriptASTUtil, TypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {ITypeParameterFormatter} from "./formatter/type/type-parameter-formatter/i-type-parameter-formatter";
import {TypeParameterFormatter} from "./formatter/type/type-parameter-formatter/type-parameter-formatter";
import {IInterfaceTypeMemberFormatter} from "./formatter/type/interface-type-member-formatter/i-interface-type-member-formatter";
import {InterfaceTypeMemberFormatter} from "./formatter/type/interface-type-member-formatter/interface-type-member-formatter";
import {IParameterTypeFormatter} from "./formatter/type/parameter-type-formatter/i-parameter-type-formatter";
import {ParameterTypeFormatter} from "./formatter/type/parameter-type-formatter/parameter-type-formatter";
import {IObjectBindingNameFormatter} from "./formatter/binding-name/object-binding-name-formatter/i-object-binding-name-formatter";
import {ObjectBindingNameFormatter} from "./formatter/binding-name/object-binding-name-formatter/object-binding-name-formatter";
import {IArrayBindingNameFormatter} from "./formatter/binding-name/array-binding-name-formatter/i-array-binding-name-formatter";
import {ArrayBindingNameFormatter} from "./formatter/binding-name/array-binding-name-formatter/array-binding-name-formatter";
import {IReferenceTypeFormatter} from "./formatter/type/reference-type-formatter/i-reference-type-formatter";
import {ReferenceTypeFormatter} from "./formatter/type/reference-type-formatter/reference-type-formatter";
import {IInterfaceTypeFormatter} from "./formatter/type/interface-type-formatter/i-interface-type-formatter";
import {InterfaceTypeFormatter} from "./formatter/type/interface-type-formatter/interface-type-formatter";
import {IInterfaceTypeService} from "./service/interface-type-service/i-interface-type-service";
import {InterfaceTypeService} from "./service/interface-type-service/interface-type-service";
import {ITypescriptLanguageService, TypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IModuleUtil, ModuleUtil} from "@wessberg/moduleutil";
import {FileLoader, IFileLoader} from "@wessberg/fileloader";
import {IPathUtil, PathUtil} from "@wessberg/pathutil";
import {FunctionTypeFormatter} from "./formatter/type/function-type-formatter/function-type-formatter";
import {IFunctionTypeFormatter} from "./formatter/type/function-type-formatter/i-function-type-formatter";
import {IIndexTypeFormatter} from "./formatter/type/index-type-formatter/i-index-type-formatter";
import {IndexTypeFormatter} from "./formatter/type/index-type-formatter/index-type-formatter";
import {IPojoTypeFormatter} from "./formatter/type/pojo-type-formatter/i-pojo-type-formatter";
import {PojoTypeFormatter} from "./formatter/type/pojo-type-formatter/pojo-type-formatter";
import {IVoidTypeFormatter} from "./formatter/type/void-type-formatter/i-void-type-formatter";
import {VoidTypeFormatter} from "./formatter/type/void-type-formatter/void-type-formatter";
import {NumberTypeFormatter} from "./formatter/type/number-type-formatter/number-type-formatter";
import {INumberTypeFormatter} from "./formatter/type/number-type-formatter/i-number-type-formatter";
import {IAnyTypeFormatter} from "./formatter/type/any-type-formatter/i-any-type-formatter";
import {AnyTypeFormatter} from "./formatter/type/any-type-formatter/any-type-formatter";
import {IStringTypeFormatter} from "./formatter/type/string-type-formatter/i-string-type-formatter";
import {StringTypeFormatter} from "./formatter/type/string-type-formatter/string-type-formatter";
import {IBooleanTypeFormatter} from "./formatter/type/boolean-type-formatter/i-boolean-type-formatter";
import {BooleanTypeFormatter} from "./formatter/type/boolean-type-formatter/boolean-type-formatter";
import {INullTypeFormatter} from "./formatter/type/null-type-formatter/i-null-type-formatter";
import {NullTypeFormatter} from "./formatter/type/null-type-formatter/null-type-formatter";
import {ISymbolTypeFormatter} from "./formatter/type/symbol-type-formatter/i-symbol-type-formatter";
import {SymbolTypeFormatter} from "./formatter/type/symbol-type-formatter/symbol-type-formatter";
import {IThisTypeFormatter} from "./formatter/type/this-type-formatter/i-this-type-formatter";
import {ThisTypeFormatter} from "./formatter/type/this-type-formatter/this-type-formatter";
import {IObjectTypeFormatter} from "./formatter/type/object-type-formatter/i-object-type-formatter";
import {ObjectTypeFormatter} from "./formatter/type/object-type-formatter/object-type-formatter";
import {IUndefinedTypeFormatter} from "./formatter/type/undefined-type-formatter/i-undefined-type-formatter";
import {UndefinedTypeFormatter} from "./formatter/type/undefined-type-formatter/undefined-type-formatter";
import {IBooleanEnumerationTypeFormatter} from "./formatter/type/boolean-enumeration-type-formatter/i-boolean-enumeration-type-formatter";
import {BooleanEnumerationTypeFormatter} from "./formatter/type/boolean-enumeration-type-formatter/boolean-enumeration-type-formatter";
import {IStringEnumerationTypeFormatter} from "./formatter/type/string-enumeration-type-formatter/i-string-enumeration-type-formatter";
import {StringEnumerationTypeFormatter} from "./formatter/type/string-enumeration-type-formatter/string-enumeration-type-formatter";
import {INumberEnumerationTypeFormatter} from "./formatter/type/number-enumeration-type-formatter/i-number-enumeration-type-formatter";
import {NumberEnumerationTypeFormatter} from "./formatter/type/number-enumeration-type-formatter/number-enumeration-type-formatter";
import {INeverTypeFormatter} from "./formatter/type/never-type-formatter/i-never-type-formatter";
import {NeverTypeFormatter} from "./formatter/type/never-type-formatter/never-type-formatter";
import {ITupleTypeFormatter} from "./formatter/type/tuple-type-formatter/i-tuple-type-formatter";
import {TupleTypeFormatter} from "./formatter/type/tuple-type-formatter/tuple-type-formatter";
import {IArrayTypeFormatter} from "./formatter/type/array-type-formatter/i-array-type-formatter";
import {ArrayTypeFormatter} from "./formatter/type/array-type-formatter/array-type-formatter";
import {IKeyofTypeFormatter} from "./formatter/type/keyof-type-formatter/i-keyof-type-formatter";
import {KeyofTypeFormatter} from "./formatter/type/keyof-type-formatter/keyof-type-formatter";
import {IParenthesizedTypeFormatter} from "./formatter/type/parenthesized-type-formatter/i-parenthesized-type-formatter";
import {ParenthesizedTypeFormatter} from "./formatter/type/parenthesized-type-formatter/parenthesized-type-formatter";
import {IUnionTypeFormatter} from "./formatter/type/union-type-formatter/i-union-type-formatter";
import {UnionTypeFormatter} from "./formatter/type/union-type-formatter/union-type-formatter";
import {IIntersectionTypeFormatter} from "./formatter/type/intersection-type-formatter/i-intersection-type-formatter";
import {IntersectionTypeFormatter} from "./formatter/type/intersection-type-formatter/intersection-type-formatter";
import {ICallExpressionFormatter} from "./formatter/expression/call-expression/i-call-expression-formatter";
import {CallExpressionFormatter} from "./formatter/expression/call-expression/call-expression-formatter";
import {ICallExpressionService} from "./service/call-expression-service/i-call-expression-service";
import {CallExpressionService} from "./service/call-expression-service/call-expression-service";
import {IArgumentsFormatter} from "./formatter/expression/arguments/i-arguments-formatter";
import {ArgumentsFormatter} from "./formatter/expression/arguments/arguments-formatter";
import {AstMapper} from "./mapper/ast-mapper/ast-mapper";
import {ArgumentsFormatterGetter} from "./formatter/expression/arguments/arguments-formatter-getter";
import {CallExpressionFormatterGetter} from "./formatter/expression/call-expression/call-expression-formatter-getter";
import {ArrayBindingNameFormatterGetter} from "./formatter/binding-name/array-binding-name-formatter/array-binding-name-formatter-getter";
import {ObjectBindingNameFormatterGetter} from "./formatter/binding-name/object-binding-name-formatter/object-binding-name-formatter-getter";
import {NeverTypeFormatterGetter} from "./formatter/type/never-type-formatter/never-type-formatter-getter";
import {VoidTypeFormatterGetter} from "./formatter/type/void-type-formatter/void-type-formatter-getter";
import {AnyTypeFormatterGetter} from "./formatter/type/any-type-formatter/any-type-formatter-getter";
import {UndefinedTypeFormatterGetter} from "./formatter/type/undefined-type-formatter/undefined-type-formatter-getter";
import {NullTypeFormatterGetter} from "./formatter/type/null-type-formatter/null-type-formatter-getter";
import {NumberTypeFormatterGetter} from "./formatter/type/number-type-formatter/number-type-formatter-getter";
import {NumberEnumerationTypeFormatterGetter} from "./formatter/type/number-enumeration-type-formatter/number-enumeration-type-formatter-getter";
import {StringTypeFormatterGetter} from "./formatter/type/string-type-formatter/string-type-formatter-getter";
import {StringEnumerationTypeFormatterGetter} from "./formatter/type/string-enumeration-type-formatter/string-enumeration-type-formatter-getter";
import {BooleanTypeFormatterGetter} from "./formatter/type/boolean-type-formatter/boolean-type-formatter-getter";
import {BooleanEnumerationTypeFormatterGetter} from "./formatter/type/boolean-enumeration-type-formatter/boolean-enumeration-type-formatter-getter";
import {SymbolTypeFormatterGetter} from "./formatter/type/symbol-type-formatter/symbol-type-formatter-getter";
import {ObjectTypeFormatterGetter} from "./formatter/type/object-type-formatter/object-type-formatter-getter";
import {PojoTypeFormatterGetter} from "./formatter/type/pojo-type-formatter/pojo-type-formatter-getter";
import {ThisTypeFormatterGetter} from "./formatter/type/this-type-formatter/this-type-formatter-getter";
import {TupleTypeFormatterGetter} from "./formatter/type/tuple-type-formatter/tuple-type-formatter-getter";
import {ArrayTypeFormatterGetter} from "./formatter/type/array-type-formatter/array-type-formatter-getter";
import {KeyofTypeFormatterGetter} from "./formatter/type/keyof-type-formatter/keyof-type-formatter-getter";
import {ParenthesizedTypeFormatterGetter} from "./formatter/type/parenthesized-type-formatter/parenthesized-type-formatter-getter";
import {UnionTypeFormatterGetter} from "./formatter/type/union-type-formatter/union-type-formatter-getter";
import {IntersectionTypeFormatterGetter} from "./formatter/type/intersection-type-formatter/intersection-type-formatter-getter";
import {FunctionTypeFormatterGetter} from "./formatter/type/function-type-formatter/function-type-formatter-getter";
import {IndexTypeFormatterGetter} from "./formatter/type/index-type-formatter/index-type-formatter-getter";
import {ReferenceTypeFormatterGetter} from "./formatter/type/reference-type-formatter/reference-type-formatter-getter";
import {TypeFormatterGetter} from "./formatter/type/type-formatter/type-formatter-getter";
import {InterfaceTypeMemberFormatterGetter} from "./formatter/type/interface-type-member-formatter/interface-type-member-formatter-getter";
import {ParameterTypeFormatterGetter} from "./formatter/type/parameter-type-formatter/parameter-type-formatter-getter";
import {TypeParameterFormatterGetter} from "./formatter/type/type-parameter-formatter/type-parameter-formatter-getter";
import {InterfaceTypeFormatterGetter} from "./formatter/type/interface-type-formatter/interface-type-formatter-getter";
import {IStringLiteralFormatter} from "./formatter/expression/literal/string-literal/i-string-literal-formatter";
import {StringLiteralFormatterGetter} from "./formatter/expression/literal/string-literal/string-literal-formatter-getter";
import {StringLiteralFormatter} from "./formatter/expression/literal/string-literal/string-literal-formatter";
import {IExpressionFormatter} from "./formatter/expression/expression/i-expression-formatter";
import {ExpressionFormatterGetter} from "./formatter/expression/expression/expression-formatter-getter";
import {ExpressionFormatter} from "./formatter/expression/expression/expression-formatter";
import {INotImplementedFormatter} from "./formatter/expression/not-implemented/i-not-implemented-formatter";
import {NotImplementedFormatterGetter} from "./formatter/expression/not-implemented/not-implemented-formatter-getter";
import {NotImplementedFormatter} from "./formatter/expression/not-implemented/not-implemented-formatter";
import {INumberLiteralFormatter} from "./formatter/expression/literal/number-literal/i-number-literal-formatter";
import {NumberLiteralFormatterGetter} from "./formatter/expression/literal/number-literal/number-literal-formatter-getter";
import {NumberLiteralFormatter} from "./formatter/expression/literal/number-literal/number-literal-formatter";
import {IPropertyAccessExpressionFormatter} from "./formatter/expression/property-access-expression/i-property-access-expression-formatter";
import {PropertyAccessExpressionFormatterGetter} from "./formatter/expression/property-access-expression/property-access-expression-formatter-getter";
import {PropertyAccessExpressionFormatter} from "./formatter/expression/property-access-expression/property-access-expression-formatter";
import {IIdentifierFormatter} from "./formatter/expression/identifier/i-identifier-formatter";
import {IdentifierFormatterGetter} from "./formatter/expression/identifier/identifier-formatter-getter";
import {IdentifierFormatter} from "./formatter/expression/identifier/identifier-formatter";
import {IIdentifierExpressionService} from "./service/identifier-service/i-identifier-expression-service";
import {IdentifierExpressionService} from "./service/identifier-service/identifier-expression-service";
import {IBooleanLiteralFormatter} from "./formatter/expression/literal/boolean-literal/i-boolean-literal-formatter";
import {BooleanLiteralFormatterGetter} from "./formatter/expression/literal/boolean-literal/boolean-literal-formatter-getter";
import {BooleanLiteralFormatter} from "./formatter/expression/literal/boolean-literal/boolean-literal-formatter";
import {IRegexLiteralFormatter} from "./formatter/expression/literal/regex-literal/i-regex-literal-formatter";
import {RegexLiteralFormatterGetter} from "./formatter/expression/literal/regex-literal/regex-literal-formatter-getter";
import {RegexLiteralFormatter} from "./formatter/expression/literal/regex-literal/regex-literal-formatter";
import {IAstMapper} from "./mapper/ast-mapper/i-ast-mapper";
import {AstMapperGetter} from "./mapper/ast-mapper/ast-mapper-getter";
import {IClassFormatter} from "./formatter/expression/class/i-class-formatter";
import {ClassFormatterGetter} from "./formatter/expression/class/class-formatter-getter";
import {ClassFormatter} from "./formatter/expression/class/class-formatter";
import {IClassService} from "./service/class-service/i-class-service";
import {ClassService} from "./service/class-service/class-service";
import {IHeritageFormatter} from "./formatter/expression/heritage/i-heritage-formatter";
import {HeritageFormatterGetter} from "./formatter/expression/heritage/heritage-formatter-getter";
import {HeritageFormatter} from "./formatter/expression/heritage/heritage-formatter";
import {ITypeofTypeFormatter} from "./formatter/type/typeof-type-formatter/i-typeof-type-formatter";
import {TypeofTypeFormatterGetter} from "./formatter/type/typeof-type-formatter/typeof-type-formatter-getter";
import {TypeofTypeFormatter} from "./formatter/type/typeof-type-formatter/typeof-type-formatter";
import {IDecoratorFormatter} from "./formatter/expression/decorator/i-decorator-formatter";
import {DecoratorFormatterGetter} from "./formatter/expression/decorator/decorator-formatter-getter";
import {DecoratorFormatter} from "./formatter/expression/decorator/decorator-formatter";
import {IPropertyNameFormatter} from "./formatter/expression/property-name/i-property-name-formatter";
import {PropertyNameFormatterGetter} from "./formatter/expression/property-name/property-name-formatter-getter";
import {PropertyNameFormatter} from "./formatter/expression/property-name/property-name-formatter";
import {IBlockFormatter} from "./formatter/expression/block/i-block-formatter";
import {BlockFormatterGetter} from "./formatter/expression/block/block-formatter-getter";
import {BlockFormatter} from "./formatter/expression/block/block-formatter";
import {IClassElementFormatter} from "./formatter/expression/class-element/i-class-element-formatter";
import {ClassElementFormatterGetter} from "./formatter/expression/class-element/class-element-formatter-getter";
import {ClassElementFormatter} from "./formatter/expression/class-element/class-element-formatter";
import {IAccessorFormatter} from "./formatter/expression/accessor/i-accessor-formatter";
import {IClassAccessorFormatter} from "./formatter/expression/class-accessor/i-class-accessor-formatter";
import {ClassAccessorFormatter} from "./formatter/expression/class-accessor/class-accessor-formatter";
import {ClassAccessorFormatterGetter} from "./formatter/expression/class-accessor/class-accessor-formatter-getter";
import {AccessorFormatterGetter} from "./formatter/expression/accessor/accessor-formatter-getter";
import {AccessorFormatter} from "./formatter/expression/accessor/accessor-formatter";
import {IFunctionLikeFormatter} from "./formatter/expression/function-like/i-function-like-formatter";
import {FunctionLikeFormatterGetter} from "./formatter/expression/function-like/function-like-formatter-getter";
import {FunctionLikeFormatter} from "./formatter/expression/function-like/function-like-formatter";
import {IMethodFormatter} from "./formatter/expression/method/i-method-formatter";
import {MethodFormatterGetter} from "./formatter/expression/method/method-formatter-getter";
import {MethodFormatter} from "./formatter/expression/method/method-formatter";
import {IClassMethodFormatter} from "./formatter/expression/class-method/i-class-method-formatter";
import {ClassMethodFormatterGetter} from "./formatter/expression/class-method/class-method-formatter-getter";
import {ClassMethodFormatter} from "./formatter/expression/class-method/class-method-formatter";
import {IObjectLiteralPropertyFormatter} from "./formatter/expression/literal/object-literal/object-literal-property/i-object-literal-property-formatter";
import {IObjectLiteralFormatter} from "./formatter/expression/literal/object-literal/object-literal/i-object-literal-formatter";
import {ObjectLiteralPropertyFormatter} from "./formatter/expression/literal/object-literal/object-literal-property/object-literal-property-formatter";
import {ObjectLiteralPropertyFormatterGetter} from "./formatter/expression/literal/object-literal/object-literal-property/object-literal-property-formatter-getter";
import {ObjectLiteralFormatterGetter} from "./formatter/expression/literal/object-literal/object-literal/object-literal-formatter-getter";
import {ObjectLiteralFormatter} from "./formatter/expression/literal/object-literal/object-literal/object-literal-formatter";
import {IClassPropertyFormatter} from "./formatter/expression/class-property/i-class-property-formatter";
import {ClassPropertyFormatterGetter} from "./formatter/expression/class-property/class-property-formatter-getter";
import {ClassPropertyFormatter} from "./formatter/expression/class-property/class-property-formatter";
import {IFunctionFormatter} from "./formatter/expression/function/i-function-formatter";
import {FunctionFormatter} from "./formatter/expression/function/function-formatter";
import {FunctionFormatterGetter} from "./formatter/expression/function/function-formatter-getter";
import {IFunctionService} from "./service/function-service/i-function-service";
import {FunctionService} from "./service/function-service/function-service";
import {IParameterFormatter} from "./formatter/expression/parameter/i-parameter-formatter";
import {ParameterFormatterGetter} from "./formatter/expression/parameter/parameter-formatter-getter";
import {ParameterFormatter} from "./formatter/expression/parameter/parameter-formatter";
import {IClassConstructorFormatter} from "./formatter/expression/class-constructor/i-class-constructor-formatter";
import {ClassConstructorFormatterGetter} from "./formatter/expression/class-constructor/class-constructor-formatter-getter";
import {ClassConstructorFormatter} from "./formatter/expression/class-constructor/class-constructor-formatter";
import {IThisExpressionFormatter} from "./formatter/expression/this-expression/i-this-expression-formatter";
import {ISuperExpressionFormatter} from "./formatter/expression/super-expression/i-super-expression-formatter";
import {IYieldExpressionFormatter} from "./formatter/expression/yield-expression/i-yield-expression-formatter";
import {IAwaitExpressionFormatter} from "./formatter/expression/await-expression/i-await-expression-formatter";
import {ThisExpressionFormatterGetter} from "./formatter/expression/this-expression/this-expression-formatter-getter";
import {SuperExpressionFormatterGetter} from "./formatter/expression/super-expression/super-expression-formatter-getter";
import {AwaitExpressionFormatterGetter} from "./formatter/expression/await-expression/await-expression-formatter-getter";
import {YieldExpressionFormatterGetter} from "./formatter/expression/yield-expression/yield-expression-formatter-getter";
import {ThisExpressionFormatter} from "./formatter/expression/this-expression/this-expression-formatter";
import {SuperExpressionFormatter} from "./formatter/expression/super-expression/super-expression-formatter";
import {YieldExpressionFormatter} from "./formatter/expression/yield-expression/yield-expression-formatter";
import {AwaitExpressionFormatter} from "./formatter/expression/await-expression/await-expression-formatter";
import {IImportService} from "./service/import-service/i-import-service";
import {ImportService} from "./service/import-service/import-service";
import {IIdentifierResolver} from "./resolver/identifier-resolver/i-identifier-resolver";
import {IdentifierResolverGetter} from "./resolver/identifier-resolver/identifier-resolver-getter";
import {IdentifierResolver} from "./resolver/identifier-resolver/identifier-resolver";

// General formatter declarations
let arrayBindingNameFormatter: IArrayBindingNameFormatter|null = null;
let objectBindingNameFormatter: IObjectBindingNameFormatter|null = null;

// Type formatter declarations
let neverTypeFormatter: INeverTypeFormatter|null = null;
let voidTypeFormatter: IVoidTypeFormatter|null = null;
let anyTypeFormatter: IAnyTypeFormatter|null = null;
let undefinedTypeFormatter: IUndefinedTypeFormatter|null = null;
let nullTypeFormatter: INullTypeFormatter|null = null;
let numberTypeFormatter: INumberTypeFormatter|null = null;
let numberEnumerationTypeFormatter: INumberEnumerationTypeFormatter|null = null;
let stringTypeFormatter: IStringTypeFormatter|null = null;
let stringEnumerationTypeFormatter: IStringEnumerationTypeFormatter|null = null;
let booleanTypeFormatter: IBooleanTypeFormatter|null = null;
let booleanEnumerationTypeFormatter: IBooleanEnumerationTypeFormatter|null = null;
let symbolTypeFormatter: ISymbolTypeFormatter|null = null;
let objectTypeFormatter: IObjectTypeFormatter|null = null;
let pojoTypeFormatter: IPojoTypeFormatter|null = null;
let thisTypeFormatter: IThisTypeFormatter|null = null;
let tupleTypeFormatter: ITupleTypeFormatter|null = null;
let arrayTypeFormatter: IArrayTypeFormatter|null = null;
let keyofTypeFormatter: IKeyofTypeFormatter|null = null;
let typeofTypeFormatter: ITypeofTypeFormatter|null = null;
let parenthesizedTypeFormatter: IParenthesizedTypeFormatter|null = null;
let unionTypeFormatter: IUnionTypeFormatter|null = null;
let intersectionTypeFormatter: IIntersectionTypeFormatter|null = null;
let functionTypeFormatter: IFunctionTypeFormatter|null = null;
let indexTypeFormatter: IIndexTypeFormatter|null = null;
let referenceTypeFormatter: IReferenceTypeFormatter|null = null;
let typeFormatter: ITypeFormatter|null = null;
let interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter|null = null;
let parameterTypeFormatter: IParameterTypeFormatter|null = null;
let typeParameterFormatter: ITypeParameterFormatter|null = null;
let interfaceTypeFormatter: IInterfaceTypeFormatter|null = null;

// Expression formatter declarations
let thisExpressionFormatter: IThisExpressionFormatter|null = null;
let superExpressionFormatter: ISuperExpressionFormatter|null = null;
let yieldExpressionFormatter: IYieldExpressionFormatter|null = null;
let awaitExpressionFormatter: IAwaitExpressionFormatter|null = null;
let classElementFormatter: IClassElementFormatter|null = null;
let functionLikeFormatter: IFunctionLikeFormatter|null = null;
let functionFormatter: IFunctionFormatter|null = null;
let parameterFormatter: IParameterFormatter|null = null;
let objectLiteralPropertyFormatter: IObjectLiteralPropertyFormatter|null = null;
let objectLiteralFormatter: IObjectLiteralFormatter|null = null;
let blockFormatter: IBlockFormatter|null = null;
let accessorFormatter: IAccessorFormatter|null = null;
let classAccessorFormatter: IClassAccessorFormatter|null = null;
let classMethodFormatter: IClassMethodFormatter|null = null;
let classConstructorFormatter: IClassConstructorFormatter|null = null;
let classPropertyFormatter: IClassPropertyFormatter|null = null;
let methodFormatter: IMethodFormatter|null = null;
let propertyNameFormatter: IPropertyNameFormatter|null = null;
let argumentsFormatter: IArgumentsFormatter|null = null;
let decoratorFormatter: IDecoratorFormatter|null = null;
let classFormatter: IClassFormatter|null = null;
let heritageFormatter: IHeritageFormatter|null = null;
let callExpressionFormatter: ICallExpressionFormatter|null = null;
let propertyAccessExpressionFormatter: IPropertyAccessExpressionFormatter|null = null;
let identifierFormatter: IIdentifierFormatter|null = null;
let stringLiteralFormatter: IStringLiteralFormatter|null = null;
let numberLiteralFormatter: INumberLiteralFormatter|null = null;
let booleanLiteralFormatter: IBooleanLiteralFormatter|null = null;
let regexLiteralFormatter: IRegexLiteralFormatter|null = null;
let expressionFormatter: IExpressionFormatter|null = null;
let notImplementedFormatter: INotImplementedFormatter|null = null;

// AST Mapper
let astMapper: IAstMapper|null = null;

// Identifier Resolver
let identifierResolver: IIdentifierResolver|null = null;

// General formatter getters
const arrayBindingNameFormatterGetter: ArrayBindingNameFormatterGetter = () => arrayBindingNameFormatter!;
const objectBindingNameFormatterGetter: ObjectBindingNameFormatterGetter = () => objectBindingNameFormatter!;

// Type formatter getters
const neverTypeFormatterGetter: NeverTypeFormatterGetter = () => neverTypeFormatter!;
const voidTypeFormatterGetter: VoidTypeFormatterGetter = () => voidTypeFormatter!;
const anyTypeFormatterGetter: AnyTypeFormatterGetter = () => anyTypeFormatter!;
const undefinedTypeFormatterGetter: UndefinedTypeFormatterGetter = () => undefinedTypeFormatter!;
const nullTypeFormatterGetter: NullTypeFormatterGetter = () => nullTypeFormatter!;
const numberTypeFormatterGetter: NumberTypeFormatterGetter = () => numberTypeFormatter!;
const numberEnumerationTypeFormatterGetter: NumberEnumerationTypeFormatterGetter = () => numberEnumerationTypeFormatter!;
const stringTypeFormatterGetter: StringTypeFormatterGetter = () => stringTypeFormatter!;
const stringEnumerationTypeFormatterGetter: StringEnumerationTypeFormatterGetter = () => stringEnumerationTypeFormatter!;
const booleanTypeFormatterGetter: BooleanTypeFormatterGetter = () => booleanTypeFormatter!;
const booleanEnumerationTypeFormatterGetter: BooleanEnumerationTypeFormatterGetter = () => booleanEnumerationTypeFormatter!;
const symbolTypeFormatterGetter: SymbolTypeFormatterGetter = () => symbolTypeFormatter!;
const objectTypeFormatterGetter: ObjectTypeFormatterGetter = () => objectTypeFormatter!;
const pojoTypeFormatterGetter: PojoTypeFormatterGetter = () => pojoTypeFormatter!;
const thisTypeFormatterGetter: ThisTypeFormatterGetter = () => thisTypeFormatter!;
const tupleTypeFormatterGetter: TupleTypeFormatterGetter = () => tupleTypeFormatter!;
const arrayTypeFormatterGetter: ArrayTypeFormatterGetter = () => arrayTypeFormatter!;
const keyofTypeFormatterGetter: KeyofTypeFormatterGetter = () => keyofTypeFormatter!;
const typeofTypeFormatterGetter: TypeofTypeFormatterGetter = () => typeofTypeFormatter!;
const parenthesizedTypeFormatterGetter: ParenthesizedTypeFormatterGetter = () => parenthesizedTypeFormatter!;
const unionTypeFormatterGetter: UnionTypeFormatterGetter = () => unionTypeFormatter!;
const intersectionTypeFormatterGetter: IntersectionTypeFormatterGetter = () => intersectionTypeFormatter!;
const functionTypeFormatterGetter: FunctionTypeFormatterGetter = () => functionTypeFormatter!;
const indexTypeFormatterGetter: IndexTypeFormatterGetter = () => indexTypeFormatter!;
const referenceTypeFormatterGetter: ReferenceTypeFormatterGetter = () => referenceTypeFormatter!;
const typeFormatterGetter: TypeFormatterGetter = () => typeFormatter!;
const interfaceTypeMemberFormatterGetter: InterfaceTypeMemberFormatterGetter = () => interfaceTypeMemberFormatter!;
const parameterTypeFormatterGetter: ParameterTypeFormatterGetter = () => parameterTypeFormatter!;
const typeParameterFormatterGetter: TypeParameterFormatterGetter = () => typeParameterFormatter!;
const interfaceTypeFormatterGetter: InterfaceTypeFormatterGetter = () => interfaceTypeFormatter!;

// Expression formatter getters
const thisExpressionFormatterGetter: ThisExpressionFormatterGetter = () => thisExpressionFormatter!;
const superExpressionFormatterGetter: SuperExpressionFormatterGetter = () => superExpressionFormatter!;
const awaitExpressionFormatterGetter: AwaitExpressionFormatterGetter = () => awaitExpressionFormatter!;
const yieldExpressionFormatterGetter: YieldExpressionFormatterGetter = () => yieldExpressionFormatter!;
const classElementFormatterGetter: ClassElementFormatterGetter = () => classElementFormatter!;
const functionLikeFormatterGetter: FunctionLikeFormatterGetter = () => functionLikeFormatter!;
const functionFormatterGetter: FunctionFormatterGetter = () => functionFormatter!;
const parameterFormatterGetter: ParameterFormatterGetter = () => parameterFormatter!;
const objectLiteralPropertyFormatterGetter: ObjectLiteralPropertyFormatterGetter = () => objectLiteralPropertyFormatter!;
const objectLiteralFormatterGetter: ObjectLiteralFormatterGetter = () => objectLiteralFormatter!;
const blockFormatterGetter: BlockFormatterGetter = () => blockFormatter!;
const accessorFormatterGetter: AccessorFormatterGetter = () => accessorFormatter!;
const classAccessorFormatterGetter: ClassAccessorFormatterGetter = () => classAccessorFormatter!;
const methodFormatterGetter: MethodFormatterGetter = () => methodFormatter!;
const classMethodFormatterGetter: ClassMethodFormatterGetter = () => classMethodFormatter!;
const classConstructorFormatterGetter: ClassConstructorFormatterGetter = () => classConstructorFormatter!;
const classPropertyFormatterGetter: ClassPropertyFormatterGetter = () => classPropertyFormatter!;
const propertyNameFormatterGetter: PropertyNameFormatterGetter = () => propertyNameFormatter!;
const argumentsFormatterGetter: ArgumentsFormatterGetter = () => argumentsFormatter!;
const decoratorFormatterGetter: DecoratorFormatterGetter = () => decoratorFormatter!;
const classFormatterGetter: ClassFormatterGetter = () => classFormatter!;
const heritageFormatterGetter: HeritageFormatterGetter = () => heritageFormatter!;
const callExpressionFormatterGetter: CallExpressionFormatterGetter = () => callExpressionFormatter!;
const propertyAccessExpressionFormatterGetter: PropertyAccessExpressionFormatterGetter = () => propertyAccessExpressionFormatter!;
const identifierFormatterGetter: IdentifierFormatterGetter = () => identifierFormatter!;
const stringLiteralFormatterGetter: StringLiteralFormatterGetter = () => stringLiteralFormatter!;
const numberLiteralFormatterGetter: NumberLiteralFormatterGetter = () => numberLiteralFormatter!;
const booleanLiteralFormatterGetter: BooleanLiteralFormatterGetter = () => booleanLiteralFormatter!;
const regexLiteralFormatterGetter: RegexLiteralFormatterGetter = () => regexLiteralFormatter!;
const expressionFormatterGetter: ExpressionFormatterGetter = () => expressionFormatter!;
const notImplementedFormatterGetter: NotImplementedFormatterGetter = () => notImplementedFormatter!;

// Mapper getters
const astMapperGetter: AstMapperGetter = () => astMapper!;

// Resolver getters
const identifierResolverGetter: IdentifierResolverGetter = () => identifierResolver!;

// Utils
const astUtil: ITypescriptASTUtil = new TypescriptASTUtil();
const fileLoader: IFileLoader = new FileLoader();
const pathUtil: IPathUtil = new PathUtil(fileLoader);
const moduleUtil: IModuleUtil = new ModuleUtil(fileLoader, pathUtil);

// General formatters
objectBindingNameFormatter = new ObjectBindingNameFormatter(astUtil);
arrayBindingNameFormatter = new ArrayBindingNameFormatter(astUtil);

// Type Formatters
neverTypeFormatter = new NeverTypeFormatter();
voidTypeFormatter = new VoidTypeFormatter();
anyTypeFormatter = new AnyTypeFormatter();
undefinedTypeFormatter = new UndefinedTypeFormatter();
nullTypeFormatter = new NullTypeFormatter();
numberTypeFormatter = new NumberTypeFormatter();
numberEnumerationTypeFormatter = new NumberEnumerationTypeFormatter(astUtil);
stringTypeFormatter = new StringTypeFormatter();
stringEnumerationTypeFormatter = new StringEnumerationTypeFormatter(astUtil);
booleanTypeFormatter = new BooleanTypeFormatter();
booleanEnumerationTypeFormatter = new BooleanEnumerationTypeFormatter();
symbolTypeFormatter = new SymbolTypeFormatter();
objectTypeFormatter = new ObjectTypeFormatter();
pojoTypeFormatter = new PojoTypeFormatter(interfaceTypeMemberFormatterGetter);
thisTypeFormatter = new ThisTypeFormatter();
tupleTypeFormatter = new TupleTypeFormatter(typeFormatterGetter);
arrayTypeFormatter = new ArrayTypeFormatter(typeFormatterGetter);
keyofTypeFormatter = new KeyofTypeFormatter(typeFormatterGetter);
typeofTypeFormatter = new TypeofTypeFormatter(referenceTypeFormatterGetter);
parenthesizedTypeFormatter = new ParenthesizedTypeFormatter(typeFormatterGetter);
unionTypeFormatter = new UnionTypeFormatter(typeFormatterGetter);
intersectionTypeFormatter = new IntersectionTypeFormatter(typeFormatterGetter);
functionTypeFormatter = new FunctionTypeFormatter(parameterFormatterGetter, typeFormatterGetter);
indexTypeFormatter = new IndexTypeFormatter(interfaceTypeMemberFormatterGetter, typeFormatterGetter);
referenceTypeFormatter = new ReferenceTypeFormatter(astUtil, typeFormatterGetter);
parameterTypeFormatter = new ParameterTypeFormatter(astUtil, objectBindingNameFormatterGetter, arrayBindingNameFormatterGetter, typeFormatterGetter);
interfaceTypeMemberFormatter = new InterfaceTypeMemberFormatter(astUtil, typeFormatterGetter);
typeParameterFormatter= new TypeParameterFormatter(astUtil, typeFormatterGetter);
interfaceTypeFormatter = new InterfaceTypeFormatter(astUtil, referenceTypeFormatterGetter, interfaceTypeMemberFormatterGetter, typeParameterFormatterGetter);
typeFormatter = new TypeFormatter(
	neverTypeFormatterGetter,
	voidTypeFormatterGetter,
	anyTypeFormatterGetter,
	undefinedTypeFormatterGetter,
	nullTypeFormatterGetter,
	numberTypeFormatterGetter,
	numberEnumerationTypeFormatterGetter,
	stringTypeFormatterGetter,
	stringEnumerationTypeFormatterGetter,
	booleanTypeFormatterGetter,
	booleanEnumerationTypeFormatterGetter,
	symbolTypeFormatterGetter,
	objectTypeFormatterGetter,
	pojoTypeFormatterGetter,
	thisTypeFormatterGetter,
	tupleTypeFormatterGetter,
	arrayTypeFormatterGetter,
	keyofTypeFormatterGetter,
	typeofTypeFormatterGetter,
	functionTypeFormatterGetter,
	indexTypeFormatterGetter,
	referenceTypeFormatterGetter,
	parenthesizedTypeFormatterGetter,
	unionTypeFormatterGetter,
	intersectionTypeFormatterGetter
);

// Expression Formatters
thisExpressionFormatter = new ThisExpressionFormatter(astMapperGetter);
superExpressionFormatter = new SuperExpressionFormatter(astMapperGetter);
yieldExpressionFormatter = new YieldExpressionFormatter(astMapperGetter, expressionFormatterGetter);
awaitExpressionFormatter = new AwaitExpressionFormatter(astMapperGetter, expressionFormatterGetter);
classElementFormatter = new ClassElementFormatter();
functionLikeFormatter = new FunctionLikeFormatter(typeFormatterGetter, blockFormatterGetter);
functionFormatter = new FunctionFormatter(astMapperGetter, functionLikeFormatterGetter, propertyNameFormatterGetter, decoratorFormatterGetter, parameterFormatterGetter, typeParameterFormatterGetter);
parameterFormatter = new ParameterFormatter(astMapperGetter, expressionFormatterGetter, parameterTypeFormatterGetter);
objectLiteralPropertyFormatter = new ObjectLiteralPropertyFormatter(astUtil, astMapperGetter, accessorFormatterGetter, propertyNameFormatterGetter, methodFormatterGetter, expressionFormatterGetter);
objectLiteralFormatter = new ObjectLiteralFormatter(astMapperGetter, objectLiteralPropertyFormatterGetter);
blockFormatter = new BlockFormatter(astMapperGetter, expressionFormatterGetter);
accessorFormatter = new AccessorFormatter(astMapperGetter, functionLikeFormatterGetter, propertyNameFormatterGetter, parameterFormatterGetter);
classAccessorFormatter = new ClassAccessorFormatter(classElementFormatterGetter, astMapperGetter, functionLikeFormatterGetter, propertyNameFormatterGetter, parameterFormatterGetter);
classMethodFormatter = new ClassMethodFormatter(classElementFormatterGetter, astMapperGetter, functionLikeFormatterGetter, propertyNameFormatterGetter, decoratorFormatterGetter, parameterFormatterGetter, typeParameterFormatterGetter);
classConstructorFormatter = new ClassConstructorFormatter(astMapperGetter, blockFormatterGetter, parameterFormatterGetter);
classPropertyFormatter = new ClassPropertyFormatter(astMapperGetter, classElementFormatterGetter, decoratorFormatterGetter, typeFormatterGetter, propertyNameFormatterGetter, expressionFormatterGetter);
methodFormatter = new MethodFormatter(astMapperGetter, functionLikeFormatterGetter, propertyNameFormatterGetter, decoratorFormatterGetter, parameterFormatterGetter, typeParameterFormatterGetter);
propertyNameFormatter = new PropertyNameFormatter(astUtil, astMapperGetter, expressionFormatterGetter);
argumentsFormatter = new ArgumentsFormatter(astMapperGetter, expressionFormatterGetter);
decoratorFormatter = new DecoratorFormatter(astMapperGetter, expressionFormatterGetter);
classFormatter = new ClassFormatter(astMapperGetter, identifierFormatterGetter, classAccessorFormatterGetter, classConstructorFormatterGetter, classMethodFormatterGetter, classPropertyFormatterGetter, heritageFormatterGetter, decoratorFormatterGetter, identifierResolverGetter);
heritageFormatter = new HeritageFormatter(astMapperGetter, expressionFormatterGetter, referenceTypeFormatterGetter);
callExpressionFormatter = new CallExpressionFormatter(astMapperGetter, expressionFormatterGetter, argumentsFormatterGetter, typeFormatterGetter);
propertyAccessExpressionFormatter = new PropertyAccessExpressionFormatter(astUtil, astMapperGetter, expressionFormatterGetter);
identifierFormatter = new IdentifierFormatter(astMapperGetter);
stringLiteralFormatter = new StringLiteralFormatter(astMapperGetter);
numberLiteralFormatter = new NumberLiteralFormatter(astMapperGetter);
booleanLiteralFormatter = new BooleanLiteralFormatter(astMapperGetter);
regexLiteralFormatter = new RegexLiteralFormatter(astMapperGetter);
notImplementedFormatter = new NotImplementedFormatter(astMapperGetter);
expressionFormatter = new ExpressionFormatter(
	thisExpressionFormatterGetter,
	superExpressionFormatterGetter,
	awaitExpressionFormatterGetter,
	yieldExpressionFormatterGetter,
	classFormatterGetter,
	callExpressionFormatterGetter,
	propertyAccessExpressionFormatterGetter,
	identifierFormatterGetter,
	stringLiteralFormatterGetter,
	numberLiteralFormatterGetter,
	booleanLiteralFormatterGetter,
	regexLiteralFormatterGetter,
	objectLiteralFormatterGetter,
	accessorFormatterGetter,
	blockFormatterGetter,
	decoratorFormatterGetter,
	heritageFormatterGetter,
	methodFormatterGetter,
	propertyNameFormatterGetter,
	classPropertyFormatterGetter,
	classConstructorFormatterGetter,
	functionFormatterGetter,
	parameterFormatterGetter,
	notImplementedFormatterGetter
);

// Mappers
astMapper = new AstMapper();

// AST services
const languageService: ITypescriptLanguageService = new TypescriptLanguageService(moduleUtil, pathUtil, fileLoader);
export const interfaceTypeService: IInterfaceTypeService = new InterfaceTypeService(astUtil, languageService, interfaceTypeFormatterGetter);
export const classService: IClassService = new ClassService(astUtil, languageService, classFormatterGetter);
export const callExpressionService: ICallExpressionService = new CallExpressionService(astUtil, languageService, callExpressionFormatterGetter);
export const identifierExpressionService: IIdentifierExpressionService = new IdentifierExpressionService(astUtil, languageService, identifierFormatterGetter);
export const functionService: IFunctionService = new FunctionService(astUtil, languageService, functionFormatterGetter);
export const importService: IImportService = new ImportService(languageService);

// Resolvers
identifierResolver = new IdentifierResolver(astMapperGetter, languageService);