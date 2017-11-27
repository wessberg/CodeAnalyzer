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
import {INodeToDictMapperBase} from "./node-to-dict-mapper/i-node-to-dict-mapper";
import {NodeToDictMapper} from "./node-to-dict-mapper/node-to-dict-mapper";
import {IRemoverBase} from "./remover/i-remover";
import {Remover} from "./remover/remover";
import {IRemover, wrappedIRemover} from "./remover/i-remover-base";
import {IPropertyService} from "./service/property/i-property-service";
import {PropertyService} from "./service/property/property-service";
import {IInterfaceDeclarationService} from "./service/interface-declaration/i-interface-declaration-service";
import {InterfaceDeclarationService} from "./service/interface-declaration/interface-declaration-service";
import {ITypeLiteralNodeService} from "./service/type-literal-node/i-type-literal-node-service";
import {TypeLiteralNodeService} from "./service/type-literal-node/type-literal-node-service";
import {IParameterService} from "./service/parameter/i-parameter-service";
import {ParameterService} from "./service/parameter/parameter-service";
import {IResolverBase} from "./resolver/i-resolver";
import {Resolver} from "./resolver/resolver";
import {IResolver, wrappedIResolver} from "./resolver/i-resolver-getter";
import {IExportService} from "./service/export/i-export-service";
import {ExportService} from "./service/export/export-service";
import {INamedExportsService} from "./service/named-exports/i-named-exports-service";
import {NamedExportsService} from "./service/named-exports/named-exports-service";
import {IStringUtil, StringUtil} from "@wessberg/stringutil";
import {CodeAnalyzerBase} from "./code-analyzer/code-analyzer-base";
import {IPropertyAccessExpressionService} from "./service/property-access-expression/i-property-access-expression-service";
import {PropertyAccessExpressionService} from "./service/property-access-expression/property-access-expression-service";
import {ITypeElementService} from "./service/type-element/i-type-element-service";
import {TypeElementService} from "./service/type-element/type-element-service";
import {ITypeNodeService} from "./service/type-node/i-type-node-service";
import {TypeNodeService} from "./service/type-node/type-node-service";
import {INodeToDictMapper, wrappedINodeToDictMapper} from "./node-to-dict-mapper/i-node-to-dict-mapper-getter";
import {IPropertyNameService} from "./service/property-name/i-property-name-service";
import {PropertyNameService} from "./service/property-name/property-name-service";
import {IPropertySignatureService} from "./service/property-signature/i-property-signature-service";
import {PropertySignatureService} from "./service/property-signature/property-signature-service";
import {IMethodSignatureService} from "./service/method-signature/i-method-signature-service";
import {MethodSignatureService} from "./service/method-signature/method-signature-service";
import {IIndexSignatureService} from "./service/index-signature/i-index-signature-service";
import {IndexSignatureService} from "./service/index-signature/index-signature-service";
import {IBindingElementService} from "./service/binding-element/i-binding-element-service";
import {BindingElementService} from "./service/binding-element/binding-element-service";
import {INodeToCtorMapperBase} from "./node-to-ctor-mapper/i-node-to-ctor-mapper";
import {NodeToCtorMapper} from "./node-to-ctor-mapper/node-to-ctor-mapper";
import {INodeToCtorMapper, wrappedINodeToCtorMapper} from "./node-to-ctor-mapper/i-node-to-ctor-mapper-getter";
import {IIdentifierService} from "./service/identifier/i-identifier-service";
import {IdentifierService} from "./service/identifier/identifier-service";
import {IStringLiteralService} from "./service/string-literal/i-string-literal-service";
import {StringLiteralService} from "./service/string-literal/string-literal-service";
import {INumericLiteralService} from "./service/numeric-literal/i-numeric-literal-service";
import {NumericLiteralService} from "./service/numeric-literal/numeric-literal-service";
import {INoSubstitutionTemplateLiteralService} from "./service/no-substitution-template-literal/i-no-substitution-template-literal-service";
import {NoSubstitutionTemplateLiteralService} from "./service/no-substitution-template-literal/no-substitution-template-literal-service";
import {RegularExpressionLiteralService} from "./service/regular-expression-literal/regular-expression-literal-service";
import {IRegularExpressionLiteralService} from "./service/regular-expression-literal/i-regular-expression-literal-service";
import {IComputedPropertyNameService} from "./service/computed-property-name/i-computed-property-name-service";
import {ComputedPropertyNameService} from "./service/computed-property-name/computed-property-name-service";
import {IBindingNameService} from "./service/binding-name/i-binding-name-service";
import {BindingNameService} from "./service/binding-name/binding-name-service";
import {IBindingPatternService} from "./service/binding-pattern/i-binding-pattern-service";
import {BindingPatternService} from "./service/binding-pattern/binding-pattern-service";
import {ICodeAnalyzerBase} from "./code-analyzer/i-code-analyzer-base";
import {ISetAccessorService} from "./service/set-accessor/i-set-accessor-service";
import {SetAccessorService} from "./service/set-accessor/set-accessor-service";
import {GetAccessorService} from "./service/get-accessor/get-accessor-service";
import {IGetAccessorService} from "./service/get-accessor/i-get-accessor-service";
import {ITemplateExpressionService} from "./service/template-expression/i-template-expression-service";
import {TemplateExpressionService} from "./service/template-expression/template-expression-service";

// Formatter
DIContainer.registerSingleton<IFormatterBase, Formatter>();

// Updater
DIContainer.registerSingleton<IUpdaterBase, Updater>();

// Remover
DIContainer.registerSingleton<IRemoverBase, Remover>();

// Joiner
DIContainer.registerSingleton<IJoinerBase, Joiner>();

// Resolver
DIContainer.registerSingleton<IResolverBase, Resolver>();

// Mappers
DIContainer.registerSingleton<INodeToDictMapperBase, NodeToDictMapper>();
DIContainer.registerSingleton<INodeToCtorMapperBase, NodeToCtorMapper>();

// Provide lazy-getters because there are circular dependencies between AST services and these
DIContainer.registerSingleton<IJoiner, IJoiner>(() => wrappedIJoiner);
DIContainer.registerSingleton<IUpdater, IUpdater>(() => wrappedIUpdater);
DIContainer.registerSingleton<IFormatter, IFormatter>(() => wrappedIFormatter);
DIContainer.registerSingleton<IRemover, IRemover>(() => wrappedIRemover);
DIContainer.registerSingleton<IResolver, IResolver>(() => wrappedIResolver);
DIContainer.registerSingleton<INodeToDictMapper, INodeToDictMapper>(() => wrappedINodeToDictMapper);
DIContainer.registerSingleton<INodeToCtorMapper, INodeToCtorMapper>(() => wrappedINodeToCtorMapper);

// Parser
DIContainer.registerSingleton<IParser, Parser>();

// Utilities
DIContainer.registerSingleton<IModuleUtil, ModuleUtil>();
DIContainer.registerSingleton<IPathUtil, PathUtil>();
DIContainer.registerSingleton<IFileLoader, FileLoader>();
DIContainer.registerSingleton<ITypescriptPackageReassembler, TypescriptPackageReassembler>();
DIContainer.registerSingleton<ITypescriptLanguageService, TypescriptLanguageService>();
DIContainer.registerSingleton<ITypescriptASTUtil, TypescriptASTUtil>();
DIContainer.registerSingleton<INodeMatcherUtil, NodeMatcherUtil>();
DIContainer.registerSingleton<INodeUpdaterUtil, NodeUpdaterUtil>();
DIContainer.registerSingleton<IPrinter, Printer>();
DIContainer.registerSingleton<IStringUtil, StringUtil>();

// Services
DIContainer.registerSingleton<IHeritageClauseService, HeritageClauseService>();
DIContainer.registerSingleton<INamedImportsService, NamedImportsService>();
DIContainer.registerSingleton<INamedExportsService, NamedExportsService>();
DIContainer.registerSingleton<IParameterService, ParameterService>();
DIContainer.registerSingleton<INamespaceImportService, NamespaceImportService>();
DIContainer.registerSingleton<IMethodService, MethodService>();
DIContainer.registerSingleton<IPropertyService, PropertyService>();
DIContainer.registerSingleton<IConstructorService, ConstructorService>();
DIContainer.registerSingleton<IDecoratorService, DecoratorService>();
DIContainer.registerSingleton<IModifierService, ModifierService>();
DIContainer.registerSingleton<IClassService, ClassService>();
DIContainer.registerSingleton<IImportService, ImportService>();
DIContainer.registerSingleton<IExportService, ExportService>();
DIContainer.registerSingleton<IInterfaceDeclarationService, InterfaceDeclarationService>();
DIContainer.registerSingleton<ITypeLiteralNodeService, TypeLiteralNodeService>();
DIContainer.registerSingleton<ICallExpressionService, CallExpressionService>();
DIContainer.registerSingleton<IPropertyAccessExpressionService, PropertyAccessExpressionService>();
DIContainer.registerSingleton<ITypeElementService, TypeElementService>();
DIContainer.registerSingleton<ITypeNodeService, TypeNodeService>();
DIContainer.registerSingleton<IPropertyNameService, PropertyNameService>();
DIContainer.registerSingleton<IPropertySignatureService, PropertySignatureService>();
DIContainer.registerSingleton<IMethodSignatureService, MethodSignatureService>();
DIContainer.registerSingleton<IIndexSignatureService, IndexSignatureService>();
DIContainer.registerSingleton<IBindingElementService, BindingElementService>();
DIContainer.registerSingleton<IIdentifierService, IdentifierService>();
DIContainer.registerSingleton<IStringLiteralService, StringLiteralService>();
DIContainer.registerSingleton<INumericLiteralService, NumericLiteralService>();
DIContainer.registerSingleton<INoSubstitutionTemplateLiteralService, NoSubstitutionTemplateLiteralService>();
DIContainer.registerSingleton<IRegularExpressionLiteralService, RegularExpressionLiteralService>();
DIContainer.registerSingleton<IComputedPropertyNameService, ComputedPropertyNameService>();
DIContainer.registerSingleton<IBindingNameService, BindingNameService>();
DIContainer.registerSingleton<IBindingPatternService, BindingPatternService>();
DIContainer.registerSingleton<ISetAccessorService, SetAccessorService>();
DIContainer.registerSingleton<IGetAccessorService, GetAccessorService>();
DIContainer.registerSingleton<ITemplateExpressionService, TemplateExpressionService>();

// CodeAnalyzer
DIContainer.registerSingleton<ICodeAnalyzerBase, CodeAnalyzerBase>();