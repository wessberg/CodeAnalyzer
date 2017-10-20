import {ITypeLiteralCtor} from "../../ctor/type-literal/i-type-literal-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface ITypeLiteralDict extends ITypeLiteralCtor, INodeDict {
	nodeKind: NodeKind.TYPE_LITERAL;
}