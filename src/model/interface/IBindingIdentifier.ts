import {Expression, Node, Statement} from "typescript";

export interface IBindingIdentifier {
	name: string;
	location: Statement|Expression|Node;
}