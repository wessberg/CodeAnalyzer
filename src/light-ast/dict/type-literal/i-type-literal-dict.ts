import {ITypeLiteralCtor} from "../../ctor/type-literal/i-type-literal-ctor";
import {INodeDict} from "../node/i-node-dict";
import {ITypeElementDict} from "../type-element/i-type-element-dict";

export interface ITypeLiteralDict extends ITypeLiteralCtor, INodeDict {
	nodeKind: "TYPE_LITERAL";
	members: ITypeElementDict[];
}