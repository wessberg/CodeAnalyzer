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
import {IRegularExpressionLiteralService} from "../service/regular-expression-literal/i-regular-expression-literal-service";
import {IIdentifierService} from "../service/identifier/i-identifier-service";
import {IStringLiteralService} from "../service/string-literal/i-string-literal-service";
import {INumericLiteralService} from "../service/numeric-literal/i-numeric-literal-service";
import {INoSubstitutionTemplateLiteralService} from "../service/no-substitution-template-literal/i-no-substitution-template-literal-service";
import {IComputedPropertyNameService} from "../service/computed-property-name/i-computed-property-name-service";
import {IBindingNameService} from "../service/binding-name/i-binding-name-service";
import {IBindingPatternService} from "../service/binding-pattern/i-binding-pattern-service";
import {ICodeAnalyzerBase} from "./i-code-analyzer-base";
import {ISetAccessorService} from "../service/set-accessor/i-set-accessor-service";
import {IGetAccessorService} from "../service/get-accessor/i-get-accessor-service";

/**
 * A service that contains all underlying services
 */
export class CodeAnalyzerBase implements ICodeAnalyzerBase {
	constructor (public readonly languageService: ITypescriptLanguageService,
							 public readonly resolver: IResolver,
							 public readonly printer: IPrinter,
							 public readonly classService: IClassService,
							 public readonly callExpressionService: ICallExpressionService,
							 public readonly propertyAccessExpressionService: IPropertyAccessExpressionService,
							 public readonly constructorService: IConstructorService,
							 public readonly decoratorService: IDecoratorService,
							 public readonly exportService: IExportService,
							 public readonly heritageClauseService: IHeritageClauseService,
							 public readonly importService: IImportService,
							 public readonly interfaceDeclarationService: IInterfaceDeclarationService,
							 public readonly methodService: IMethodService,
							 public readonly modifierService: IModifierService,
							 public readonly namedExportsService: INamedExportsService,
							 public readonly namedImportsService: INamedImportsService,
							 public readonly namespaceImportService: INamespaceImportService,
							 public readonly parameterService: IParameterService,
							 public readonly propertyService: IPropertyService,
							 public readonly typeLiteralNodeService: ITypeLiteralNodeService,
							 public readonly typeElementService: ITypeElementService,
							 public readonly typeNodeService: ITypeNodeService,
							 public readonly propertyNameService: IPropertyNameService,
							 public readonly propertySignatureService: IPropertySignatureService,
							 public readonly methodSignatureService: IMethodSignatureService,
							 public readonly indexSignatureService: IIndexSignatureService,
							 public readonly bindingElementService: IBindingElementService,
							 public readonly identifierService: IIdentifierService,
							 public readonly stringLiteralService: IStringLiteralService,
							 public readonly numericLiteralService: INumericLiteralService,
							 public readonly noSubstitutionTemplateLiteralService: INoSubstitutionTemplateLiteralService,
							 public readonly regularExpressionLiteralService: IRegularExpressionLiteralService,
							 public readonly computedPropertyNameService: IComputedPropertyNameService,
							 public readonly bindingNameService: IBindingNameService,
							 public readonly bindingPatternService: IBindingPatternService,
							 public readonly getAccessorService: IGetAccessorService,
							 public readonly setAccessorService: ISetAccessorService) {
	}
}