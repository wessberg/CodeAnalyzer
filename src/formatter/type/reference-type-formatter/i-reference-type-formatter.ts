import {IReferenceType} from "@wessberg/type";
import {HeritageClause} from "typescript";

export interface IReferenceTypeFormatter {
	format (heritageClause: HeritageClause): IReferenceType[];
}