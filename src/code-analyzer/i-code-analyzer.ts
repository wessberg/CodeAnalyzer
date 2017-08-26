import {IInterfaceTypeServiceBase} from "../service/interface-type-service/i-interface-type-service-base";
import {ICallExpressionServiceBase} from "../service/call-expression-service/i-call-expression-service-base";

export interface ICodeAnalyzer extends IInterfaceTypeServiceBase, ICallExpressionServiceBase {
}