import {IClassService} from "../service/class/i-class-service";
import {ICallExpressionService} from "../service/call-expression/i-call-expression-service";
import {IConstructorService} from "../service/constructor/i-constructor-service";
import {IDecoratorService} from "../service/decorator/i-decorator-service";
import {IExportService} from "../service/export/i-export-service";
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

export interface ICodeAnalyzer {
	readonly languageService: ITypescriptLanguageService;
	readonly classService: IClassService;
	readonly callExpressionService: ICallExpressionService;
	readonly constructorService: IConstructorService;
	readonly decoratorService: IDecoratorService;
	readonly exportService: IExportService;
	readonly heritageClauseService: IHeritageClauseService;
	readonly importService: IImportService;
	readonly interfaceDeclarationService: IInterfaceDeclarationService;
	readonly methodService: IMethodService;
	readonly modifierService: IModifierService;
	readonly namedExportsService: INamedExportsService;
	readonly namedImportsService: INamedImportsService;
	readonly namespaceImportService: INamespaceImportService;
	readonly parameterService: IParameterService;
	readonly propertyService: IPropertyService;
	readonly typeLiteralNodeService: ITypeLiteralNodeService;
}