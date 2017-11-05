import {MethodDeclaration, ReturnStatement} from "typescript";
import {IClassFunctionLikeService} from "../class-function-like/i-class-function-like-service";

export interface IMethodService extends IClassFunctionLikeService<MethodDeclaration> {
	takeReturnStatement (method: MethodDeclaration): ReturnStatement|undefined;
	getName (method: MethodDeclaration): string;
}