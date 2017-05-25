import {Statement, Expression, Node} from "typescript";

export interface IBindingIdentifier {
	name: string;
	location: Statement|Expression|Node;
}