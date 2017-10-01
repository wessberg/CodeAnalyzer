import {ClassElementDict} from "../class-element/class-element-dict";
import {DecoratorDict} from "../decorator/decorator-dict";
import {INameWithTypeArguments} from "../name-with-type-arguments/i-name-with-type-arguments";
import {ClassElement, Decorator, HeritageClause, Identifier} from "typescript";

export interface IClassDict {
	name: string|null|Identifier;
	members: Iterable<ClassElementDict|ClassElement>|null;
	decorators: Iterable<DecoratorDict|Decorator>|null;
	isAbstract: boolean;
	extendsClass: INameWithTypeArguments|null|HeritageClause;
	implementsInterfaces: Iterable<INameWithTypeArguments>|null|HeritageClause;
	typeParameters: Iterable<string>|null;
}