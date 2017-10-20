import {ICodeAnalyzer} from "./i-code-analyzer";
import {DIContainer} from "@wessberg/di";
import {IClassService} from "../service/class/i-class-service";
import {ICallExpressionService} from "../service/call-expression/i-call-expression-service";
import {IConstructorService} from "../service/constructor/i-constructor-service";
import {IExportService} from "../service/export/i-export-service";
import {IDecoratorService} from "../service/decorator/i-decorator-service";
import {IHeritageClauseService} from "../service/heritage-clause/i-heritage-clause-service";
import {IImportService} from "../service/import/i-import-service";
import {IInterfaceDeclarationService} from "../service/interface-declaration/i-interface-declaration-service";
import {IMethodService} from "../service/method/i-method-service";
import {IModifierService} from "../service/modifier/i-modifier-service";
import {INamedExportsService} from "../service/named-exports/i-named-exports-service";
import {INamedImportsService} from "../service/named-imports/i-named-imports-service";
import {INamespaceImportService} from "../service/namespace-import/i-namespace-import-service";
import {IParameterService} from "../service/parameter/i-parameter-service";
import {IPropertyService} from "../service/property/i-property-service";
import {ITypeLiteralNodeService} from "../service/type-literal-node/i-type-literal-node-service";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IPropertyAccessExpressionService} from "../service/property-access-expression/i-property-access-expression-service";
import {IResolver} from "../resolver/i-resolver-getter";
import {IPrinter} from "@wessberg/typescript-ast-util";
import {ITypeElementService} from "../service/type-element/i-type-element-service";
import {ITypeNodeService} from "../service/type-node/i-type-node-service";
import {IPropertyNameService} from "../service/property-name/i-property-name-service";
import {IPropertySignatureService} from "../service/property-signature/i-property-signature-service";
import {IMethodSignatureService} from "../service/method-signature/i-method-signature-service";
import {IIndexSignatureService} from "../service/index-signature/i-index-signature-service";
import {IBindingElementService} from "../service/binding-element/i-binding-element-service";

/**
 * A consumable class that can be used outside a dependency-injection system.
 */
export class CodeAnalyzer implements ICodeAnalyzer {
	/**
	 * A service that can generate SourceFiles from code and/or retrieve them
	 * @type {ITypescriptLanguageService}
	 */
	public readonly languageService: ITypescriptLanguageService;

	/**
	 * A service that can resolve Nodes from identifiers
	 * @type {IResolver}
	 */
	public readonly resolver: IResolver;

	/**
	 * A service that can print nodes
	 * @type {IResolver}
	 */
	public readonly printer: IPrinter;

	/**
	 * A service that helps with working with ClassExpressions and ClassDeclarations
	 * @type {IClassService}
	 */
	public readonly classService: IClassService;

	/**
	 * A service that helps with working with CallExpressions
	 * @type {ICallExpressionService}
	 */
	public readonly callExpressionService: ICallExpressionService;

	/**
	 * A service that helps with working with PropertyAccessExpressions
	 * @type {IPropertyAccessExpressionService}
	 */
	public readonly propertyAccessExpressionService: IPropertyAccessExpressionService;

	/**
	 * A service that helps with working with ConstructorDeclarations
	 * @type {IConstructorService}
	 */
	public readonly constructorService: IConstructorService;

	/**
	 * A service that helps with working with Decorators
	 * @type {IDecoratorService}
	 */
	public readonly decoratorService: IDecoratorService;

	/**
	 * A service that helps with working with ExportDeclarations
	 * @type {IExportService}
	 */
	public readonly exportService: IExportService;

	/**
	 * A service that helps with working with HeritageClauses
	 * @type {IHeritageClauseService}
	 */
	public readonly heritageClauseService: IHeritageClauseService;

	/**
	 * A service that helps with working with ImportDeclarations
	 * @type {IImportService}
	 */
	public readonly importService: IImportService;

	/**
	 * A service that helps with working with InterfaceDeclarations
	 * @type {IInterfaceDeclarationService}
	 */
	public readonly interfaceDeclarationService: IInterfaceDeclarationService;

	/**
	 * A service that helps with working with MethodDeclarations
	 * @type {IMethodService}
	 */
	public readonly methodService: IMethodService;

	/**
	 * A service that helps with working with Modifiers
	 * @type {IModifierService}
	 */
	public readonly modifierService: IModifierService;

	/**
	 * A service that helps with working with NamedExports
	 * @type {INamedExportsService}
	 */
	public readonly namedExportsService: INamedExportsService;

	/**
	 * A service that helps with working with NamedImports
	 * @type {INamedImportsService}
	 */
	public readonly namedImportsService: INamedImportsService;

	/**
	 * A service that helps with working with NamespaceImports
	 * @type {INamespaceImportService}
	 */
	public readonly namespaceImportService: INamespaceImportService;

	/**
	 * A service that helps with working with ParameterDeclarations
	 * @type {IParameterService}
	 */
	public readonly parameterService: IParameterService;

	/**
	 * A service that helps with working with PropertyDeclarations
	 * @type {IPropertyService}
	 */
	public readonly propertyService: IPropertyService;

	/**
	 * A service that helps with working with TypeLiteralNodes
	 * @type {ITypeLiteralNodeService}
	 */
	public readonly typeLiteralNodeService: ITypeLiteralNodeService;

	/**
	 * A service that helps with working with TypeElements
	 * @type {ITypeElementService}
	 */
	public readonly typeElementService: ITypeElementService;

	/**
	 * A service that helps with working with PropertyNames
	 * @type {IPropertyNameService}
	 */
	public readonly propertyNameService: IPropertyNameService;

	/**
	 * A service that helps with working with PropertySignatures
	 * @type {IPropertySignatureService}
	 */
	public readonly propertySignatureService: IPropertySignatureService;

	/**
	 * A service that helps with working with MethodSignatures
	 * @type {IMethodSignatureService}
	 */
	public readonly methodSignatureService: IMethodSignatureService;

	/**
	 * A service that helps with working with IndexSignatureDeclarations
	 * @type {IIndexSignatureService}
	 */
	public readonly indexSignatureService: IIndexSignatureService;

	/**
	 * A service that helps with working with BindingElements
	 * @type {IBindingElementService}
	 */
	public readonly bindingElementService: IBindingElementService;

	/**
	 * A service that helps with working with TypeNodes
	 * @type {ITypeNodeService}
	 */
	public readonly typeNodeService: ITypeNodeService;

	constructor () {
		return DIContainer.get<ICodeAnalyzer>();
	}
}