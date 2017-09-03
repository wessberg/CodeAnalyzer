import {IService} from "../i-service";
import {IIdentifierServiceBase} from "./i-identifier-service-base";

export interface IIdentifierService extends IIdentifierServiceBase, IService {
	isGettingIdentifiersForFile (file: string): boolean;
}