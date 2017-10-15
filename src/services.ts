import {INodeMatcherUtil, INodeUpdaterUtil, IPrinter, ITypescriptASTUtil, NodeMatcherUtil, NodeUpdaterUtil, Printer, TypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IFormatterBase} from "./formatter/i-formatter";
import {Formatter} from "./formatter/formatter";
import {DIContainer} from "@wessberg/di";
import {IModuleUtil, ModuleUtil} from "@wessberg/moduleutil";
import {IPathUtil, PathUtil} from "@wessberg/pathutil";
import {FileLoader, IFileLoader} from "@wessberg/fileloader";
import {ITypescriptLanguageService, TypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypescriptPackageReassembler, TypescriptPackageReassembler} from "@wessberg/typescript-package-reassembler";
import {IParser} from "./parser/i-parser";
import {Parser} from "./parser/parser";
import {IDecoratorService} from "./service/decorator/i-decorator-service";
import {DecoratorService} from "./service/decorator/decorator-service";
import {ModifierService} from "./service/modifier/modifier-service";
import {IModifierService} from "./service/modifier/i-modifier-service";
import {IClassService} from "./service/class/i-class-service";
import {ClassService} from "./service/class/class-service";
import {ImportService} from "./service/import/import-service";
import {IImportService} from "./service/import/i-import-service";
import {IFormatter, wrappedIFormatter} from "./formatter/i-formatter-getter";
import {ICallExpressionService} from "./service/call-expression/i-call-expression-service";
import {CallExpressionService} from "./service/call-expression/call-expression-service";
import {IUpdaterBase} from "./updater/i-updater";
import {Updater} from "./updater/updater";
import {Joiner} from "./joiner/joiner";
import {IJoiner, wrappedIJoiner} from "./joiner/i-joiner-getter";
import {IUpdater, wrappedIUpdater} from "./updater/i-updater-getter";
import {IJoinerBase} from "./joiner/i-joiner";
import {IHeritageClauseService} from "./service/heritage-clause/i-heritage-clause-service";
import {HeritageClauseService} from "./service/heritage-clause/heritage-clause-service";
import {IMethodService} from "./service/method/i-method-service";
import {MethodService} from "./service/method/method-service";
import {IConstructorService} from "./service/constructor/i-constructor-service";
import {ConstructorService} from "./service/constructor/constructor-service";
import {INamedImportsService} from "./service/named-imports/i-named-imports-service";
import {NamedImportsService} from "./service/named-imports/named-imports-service";
import {INamespaceImportService} from "./service/namespace-import/i-namespace-import-service";
import {NamespaceImportService} from "./service/namespace-import/namespace-import-service";
import {INodeToDictMapper} from "./node-to-dict-mapper/i-node-to-dict-mapper";
import {NodeToDictMapper} from "./node-to-dict-mapper/node-to-dict-mapper";
import {IRemoverBase} from "./remover/i-remover";
import {Remover} from "./remover/remover";
import {IRemover, wrappedIRemover} from "./remover/i-remover-base";
import {IPropertyService} from "./service/property/i-property-service";
import {PropertyService} from "./service/property/property-service";
import {ITypeUtil} from "./util/type-util/i-type-util";
import {TypeUtil} from "./util/type-util/type-util";
import {IInterfaceDeclarationService} from "./service/interface-declaration/i-interface-declaration-service";
import {InterfaceDeclarationService} from "./service/interface-declaration/interface-declaration-service";
import {ITypeLiteralNodeService} from "./service/type-literal-node/i-type-literal-node-service";
import {TypeLiteralNodeService} from "./service/type-literal-node/type-literal-node-service";

// Utils
DIContainer.registerSingleton<INodeMatcherUtil, NodeMatcherUtil>();
DIContainer.registerSingleton<INodeUpdaterUtil, NodeUpdaterUtil>();
DIContainer.registerSingleton<IPrinter, Printer>();
DIContainer.registerSingleton<ITypeUtil, TypeUtil>();

// Formatter
DIContainer.registerSingleton<IFormatterBase, Formatter>();

// Updater
DIContainer.registerSingleton<IUpdaterBase, Updater>();

// Remover
DIContainer.registerSingleton<IRemoverBase, Remover>();

// Joiner
DIContainer.registerSingleton<IJoinerBase, Joiner>();

// Mappers
DIContainer.registerSingleton<INodeToDictMapper, NodeToDictMapper>();

// Provide lazy-getters because there are circular dependencies between AST services and these
DIContainer.registerSingleton<IJoiner, IJoiner>(() => wrappedIJoiner);
DIContainer.registerSingleton<IUpdater, IUpdater>(() => wrappedIUpdater);
DIContainer.registerSingleton<IFormatter, IFormatter>(() => wrappedIFormatter);
DIContainer.registerSingleton<IRemover, IRemover>(() => wrappedIRemover);

// Parser
DIContainer.registerSingleton<IParser, Parser>();

// Utilities
DIContainer.registerSingleton<IModuleUtil, ModuleUtil>();
DIContainer.registerSingleton<IPathUtil, PathUtil>();
DIContainer.registerSingleton<IFileLoader, FileLoader>();
DIContainer.registerSingleton<ITypescriptPackageReassembler, TypescriptPackageReassembler>();
DIContainer.registerSingleton<ITypescriptLanguageService, TypescriptLanguageService>();
DIContainer.registerSingleton<ITypescriptASTUtil, TypescriptASTUtil>();

// Services
DIContainer.registerSingleton<IHeritageClauseService, HeritageClauseService>();
DIContainer.registerSingleton<INamedImportsService, NamedImportsService>();
DIContainer.registerSingleton<INamespaceImportService, NamespaceImportService>();
DIContainer.registerSingleton<IMethodService, MethodService>();
DIContainer.registerSingleton<IPropertyService, PropertyService>();
DIContainer.registerSingleton<IConstructorService, ConstructorService>();
DIContainer.registerSingleton<IDecoratorService, DecoratorService>();
DIContainer.registerSingleton<IModifierService, ModifierService>();
DIContainer.registerSingleton<IClassService, ClassService>();
DIContainer.registerSingleton<IImportService, ImportService>();
DIContainer.registerSingleton<IInterfaceDeclarationService, InterfaceDeclarationService>();
DIContainer.registerSingleton<ITypeLiteralNodeService, TypeLiteralNodeService>();
DIContainer.registerSingleton<ICallExpressionService, CallExpressionService>();