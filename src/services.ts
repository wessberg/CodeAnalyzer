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
import {IFileLoader, FileLoader} from "@wessberg/fileloader";
import {IPathUtil, PathUtil} from "@wessberg/pathutil";
import {FunctionTypeFormatter} from "./formatter/type/function-type-formatter/function-type-formatter";
import {IFunctionTypeFormatter} from "./formatter/type/function-type-formatter/i-function-type-formatter";
import {IIndexTypeFormatter} from "./formatter/type/index-type-formatter/i-index-type-formatter";
import {IndexTypeFormatter} from "./formatter/type/index-type-formatter/index-type-formatter";

// Utils
const astUtil: ITypescriptASTUtil = new TypescriptASTUtil();
const fileLoader: IFileLoader = new FileLoader();
const pathUtil: IPathUtil = new PathUtil(fileLoader);
const moduleUtil: IModuleUtil = new ModuleUtil(fileLoader, pathUtil);

// Formatters
const functionTypeFormatter: IFunctionTypeFormatter = new FunctionTypeFormatter();
const indexTypeFormatter: IIndexTypeFormatter = new IndexTypeFormatter();
const referenceTypeFormatter: IReferenceTypeFormatter = new ReferenceTypeFormatter(astUtil);
const typeFormatter: ITypeFormatter = new TypeFormatter(astUtil, functionTypeFormatter, indexTypeFormatter, referenceTypeFormatter);
const objectBindingNameFormatter: IObjectBindingNameFormatter = new ObjectBindingNameFormatter(astUtil);
const arrayBindingNameFormatter: IArrayBindingNameFormatter = new ArrayBindingNameFormatter(astUtil);
const parameterTypeFormatter: IParameterTypeFormatter = new ParameterTypeFormatter(astUtil, objectBindingNameFormatter, arrayBindingNameFormatter, typeFormatter);
const interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter = new InterfaceTypeMemberFormatter(astUtil, parameterTypeFormatter, typeFormatter);
const typeParameterFormatter: ITypeParameterFormatter = new TypeParameterFormatter(astUtil, typeFormatter, interfaceTypeMemberFormatter,parameterTypeFormatter);
const interfaceTypeFormatter: IInterfaceTypeFormatter = new InterfaceTypeFormatter(astUtil, typeFormatter, referenceTypeFormatter, typeParameterFormatter, parameterTypeFormatter, interfaceTypeMemberFormatter);

// Services
const languageService: ITypescriptLanguageService = new TypescriptLanguageService(moduleUtil, pathUtil, fileLoader);
export const interfaceTypeService: IInterfaceTypeService = new InterfaceTypeService(astUtil, languageService, interfaceTypeFormatter);