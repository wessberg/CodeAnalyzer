import {ITypeBinding, TypeExpression} from "../../service/interface/ICodeAnalyzer";

export interface ITypeUtil {
	takeTypeBindings (expression: TypeExpression, deep?: boolean): ITypeBinding[];
}