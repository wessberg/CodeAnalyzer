import {ICallExpressionCtor} from "../../ctor/call-expression/i-call-expression-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface ICallExpressionDict extends ICallExpressionCtor, INodeDict {
	nodeKind: "CALL_EXPRESSION";
}