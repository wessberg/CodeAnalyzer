import {ITypeBinding, TypeExpression} from "../../identifier/interface/IIdentifier";

export interface ITypeUtil {
	takeTypeBindings (expression: TypeExpression, deep?: boolean): ITypeBinding[];
}