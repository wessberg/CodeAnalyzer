import {ITypeLiteralCtor} from "../../ctor/type-literal/i-type-literal-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface ITypeLiteralDict extends ITypeLiteralCtor, INodeDict {
	nodeKind: "TYPE_LITERAL";
}