import {ITypeDeclarationService} from "../type-declaration/i-type-declaration-service";
import {TypeLiteralNode} from "typescript";

export interface ITypeLiteralNodeService extends ITypeDeclarationService<TypeLiteralNode> {
}