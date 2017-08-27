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
import {ICacheService} from "./service/cache-service/i-cache-service";
import {CacheService} from "./service/cache-service/cache-service";
import {ArgumentsFormatterGetter} from "./formatter/expression/arguments/arguments-formatter-getter";
import {CallExpressionFormatterGetter} from "./formatter/expression/call-expression/call-expression-formatter-getter";
import {CacheServiceGetter} from "./service/cache-service/cache-service-getter";
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
let argumentsFormatter: IArgumentsFormatter|null = null;
let callExpressionFormatter: ICallExpressionFormatter|null = null;
let propertyAccessExpressionFormatter: IPropertyAccessExpressionFormatter|null = null;
let identifierExpressionFormatter: IIdentifierFormatter|null = null;
let stringLiteralFormatter: IStringLiteralFormatter|null = null;
let numberLiteralFormatter: INumberLiteralFormatter|null = null;
let expressionFormatter: IExpressionFormatter|null = null;
let notImplementedFormatter: INotImplementedFormatter|null = null;

// General service declarations
let cacheService: ICacheService|null = null;

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
const argumentsFormatterGetter: ArgumentsFormatterGetter = () => argumentsFormatter!;
const callExpressionFormatterGetter: CallExpressionFormatterGetter = () => callExpressionFormatter!;
const propertyAccessExpressionFormatterGetter: PropertyAccessExpressionFormatterGetter = () => propertyAccessExpressionFormatter!;
const identifierExpressionFormatterGetter: IdentifierFormatterGetter = () => identifierExpressionFormatter!;
const stringLiteralFormatterGetter: StringLiteralFormatterGetter = () => stringLiteralFormatter!;
const numberLiteralFormatterGetter: NumberLiteralFormatterGetter = () => numberLiteralFormatter!;
const expressionFormatterGetter: ExpressionFormatterGetter = () => expressionFormatter!;
const notImplementedFormatterGetter: NotImplementedFormatterGetter = () => notImplementedFormatter!;

// Service getters
const cacheServiceGetter: CacheServiceGetter = () => cacheService!;

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
parenthesizedTypeFormatter = new ParenthesizedTypeFormatter(typeFormatterGetter);
unionTypeFormatter = new UnionTypeFormatter(typeFormatterGetter);
intersectionTypeFormatter = new IntersectionTypeFormatter(typeFormatterGetter);
functionTypeFormatter = new FunctionTypeFormatter(parameterTypeFormatterGetter, typeFormatterGetter);
indexTypeFormatter = new IndexTypeFormatter(interfaceTypeMemberFormatterGetter, typeFormatterGetter);
referenceTypeFormatter = new ReferenceTypeFormatter(astUtil, typeFormatterGetter);
parameterTypeFormatter = new ParameterTypeFormatter(astUtil, objectBindingNameFormatterGetter, arrayBindingNameFormatterGetter, typeFormatterGetter);
interfaceTypeMemberFormatter = new InterfaceTypeMemberFormatter(astUtil, typeFormatterGetter);
typeParameterFormatter= new TypeParameterFormatter(astUtil, typeFormatterGetter);
interfaceTypeFormatter = new InterfaceTypeFormatter(astUtil, referenceTypeFormatterGetter, interfaceTypeMemberFormatterGetter, typeParameterFormatterGetter);
typeFormatter = new TypeFormatter(neverTypeFormatterGetter, voidTypeFormatterGetter, anyTypeFormatterGetter, undefinedTypeFormatterGetter, nullTypeFormatterGetter, numberTypeFormatterGetter, numberEnumerationTypeFormatterGetter, stringTypeFormatterGetter, stringEnumerationTypeFormatterGetter, booleanTypeFormatterGetter, booleanEnumerationTypeFormatterGetter, symbolTypeFormatterGetter, objectTypeFormatterGetter, pojoTypeFormatterGetter, thisTypeFormatterGetter, tupleTypeFormatterGetter, arrayTypeFormatterGetter, keyofTypeFormatterGetter, functionTypeFormatterGetter, indexTypeFormatterGetter, referenceTypeFormatterGetter, parenthesizedTypeFormatterGetter, unionTypeFormatterGetter, intersectionTypeFormatterGetter);

// Expression Formatters
argumentsFormatter = new ArgumentsFormatter(cacheServiceGetter, expressionFormatterGetter);
callExpressionFormatter = new CallExpressionFormatter(cacheServiceGetter, expressionFormatterGetter, argumentsFormatterGetter, typeFormatterGetter);
propertyAccessExpressionFormatter = new PropertyAccessExpressionFormatter(astUtil, cacheServiceGetter, expressionFormatterGetter);
identifierExpressionFormatter = new IdentifierFormatter(cacheServiceGetter);
stringLiteralFormatter = new StringLiteralFormatter(cacheServiceGetter);
numberLiteralFormatter = new NumberLiteralFormatter(cacheServiceGetter);
notImplementedFormatter = new NotImplementedFormatter(cacheServiceGetter);
expressionFormatter = new ExpressionFormatter(callExpressionFormatterGetter, propertyAccessExpressionFormatterGetter, identifierExpressionFormatterGetter, stringLiteralFormatterGetter, numberLiteralFormatterGetter, notImplementedFormatterGetter);

// General services
cacheService = new CacheService();

// AST services
const languageService: ITypescriptLanguageService = new TypescriptLanguageService(moduleUtil, pathUtil, fileLoader);
export const interfaceTypeService: IInterfaceTypeService = new InterfaceTypeService(astUtil, languageService, interfaceTypeFormatterGetter);
export const callExpressionService: ICallExpressionService = new CallExpressionService(astUtil, languageService, callExpressionFormatterGetter);
export const identifierExpressionService: IIdentifierExpressionService = new IdentifierExpressionService(astUtil, languageService, identifierExpressionFormatterGetter);