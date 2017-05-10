import {ITypeBinding, TypeExpression} from "../../service/interface/ISimpleLanguageService";

export interface ITypeUtil {
	takeTypeBindings (expression: TypeExpression, deep?: boolean): ITypeBinding[];
}