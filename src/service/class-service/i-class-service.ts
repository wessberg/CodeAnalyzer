import {IService} from "../i-service";
import {IClassServiceBase} from "./i-class-service-base";

export interface IClassService extends IClassServiceBase, IService {
	isGettingClassesForFile (file: string): boolean;
}