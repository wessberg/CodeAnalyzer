import {Node} from "typescript";

export interface IPlacement {
	node?: Node;
	position: "BEFORE"|"AFTER";
}