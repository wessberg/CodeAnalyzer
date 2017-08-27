import {IInterfaceTypeServiceBase} from "../service/interface-type-service/i-interface-type-service-base";
import {ICallExpressionServiceBase} from "../service/call-expression-service/i-call-expression-service-base";
import {IIdentifierExpressionServiceBase} from "../service/identifier-service/i-identifier-expression-service-base";
import {IClassServiceBase} from "../service/class-service/i-class-service-base";
import {IFunctionServiceBase} from "../service/function-service/i-function-service-base";

export interface ICodeAnalyzer extends IInterfaceTypeServiceBase, IClassServiceBase, ICallExpressionServiceBase, IIdentifierExpressionServiceBase, IFunctionServiceBase {
}