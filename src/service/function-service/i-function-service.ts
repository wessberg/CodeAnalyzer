import {IService} from "../i-service";
import {IFunctionServiceBase} from "./i-function-service-base";

export interface IFunctionService extends IFunctionServiceBase, IService {
	isGettingFunctionsForFile (file: string): boolean;
}