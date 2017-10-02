import {INodeMatcherUtil, INodeUpdaterUtil, IPrinter, ITypescriptASTUtil, NodeMatcherUtil, NodeUpdaterUtil, Printer, TypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IFormatter} from "./formatter/i-formatter";
import {Formatter} from "./formatter/formatter";
import {DIContainer} from "@wessberg/di";
import {IModuleUtil, ModuleUtil} from "@wessberg/moduleutil";
import {IPathUtil, PathUtil} from "@wessberg/pathutil";
import {FileLoader, IFileLoader} from "@wessberg/fileloader";
import {ITypescriptLanguageService, TypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypescriptPackageReassembler, TypescriptPackageReassembler} from "@wessberg/typescript-package-reassembler";
import {IParseService} from "./service/parse/i-parse-service";
import {ParseService} from "./service/parse/parse-service";
import {IDecoratorService} from "./service/decorator/i-decorator-service";
import {DecoratorService} from "./service/decorator/decorator-service";
import {ModifierService} from "./service/modifier/modifier-service";
import {IModifierService} from "./service/modifier/i-modifier-service";
import {IClassService} from "./service/class/i-class-service";
import {ClassService} from "./service/class/class-service";
import {ImportService} from "./service/import/import-service";
import {ITypeService} from "./service/type/i-type-service";
import {IImportService} from "./service/import/i-import-service";
import {TypeService} from "./service/type/type-service";
import {IFormatterGetter} from "./formatter/i-formatter-getter";

// Utils
DIContainer.registerSingleton<INodeMatcherUtil, NodeMatcherUtil>();
DIContainer.registerSingleton<INodeUpdaterUtil, NodeUpdaterUtil>();
DIContainer.registerSingleton<IPrinter, Printer>();

// Formatter
DIContainer.registerSingleton<IFormatter, Formatter>();

// Provide a lazy-getter because there are circular dependencies between AST services and the Formatter
DIContainer.registerSingleton<IFormatterGetter, IFormatterGetter>(() => () => DIContainer.get<IFormatter>());

// Utilities
DIContainer.registerSingleton<IModuleUtil, ModuleUtil>();
DIContainer.registerSingleton<IPathUtil, PathUtil>();
DIContainer.registerSingleton<IFileLoader, FileLoader>();
DIContainer.registerSingleton<ITypescriptPackageReassembler, TypescriptPackageReassembler>();
DIContainer.registerSingleton<ITypescriptLanguageService, TypescriptLanguageService>();
DIContainer.registerSingleton<ITypescriptASTUtil, TypescriptASTUtil>();

// Services
DIContainer.registerSingleton<IParseService, ParseService>();
DIContainer.registerSingleton<IDecoratorService, DecoratorService>();
DIContainer.registerSingleton<IModifierService, ModifierService>();
DIContainer.registerSingleton<IClassService, ClassService>();
DIContainer.registerSingleton<IImportService, ImportService>();
DIContainer.registerSingleton<ITypeService, TypeService>();