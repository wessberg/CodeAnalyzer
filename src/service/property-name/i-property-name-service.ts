import {PropertyName} from "typescript";

export interface IPropertyNameService {
	getName (propertyName: PropertyName): string;
}