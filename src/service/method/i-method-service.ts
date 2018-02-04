import {MethodDeclaration} from "typescript";
import {IClassFunctionLikeService} from "../class-function-like/i-class-function-like-service";
import {IPlacement} from "../../placement/i-placement";
import {IParameterCtor} from "../../light-ast/ctor/parameter/i-parameter-ctor";

export interface IMethodService extends IClassFunctionLikeService<MethodDeclaration> {
	prependInstructions (instructions: string, method: MethodDeclaration): MethodDeclaration;
	addParameter (parameter: IParameterCtor, method: MethodDeclaration, placement?: IPlacement): MethodDeclaration;
}