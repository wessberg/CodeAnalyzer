import {FileLoader} from "@wessberg/fileloader";
import {Marshaller} from "@wessberg/marshaller";
import {TypeDetector} from "@wessberg/typedetector";
import {test} from "ava";
import {ISimpleLanguageService} from "../../src/service/interface/ISimpleLanguageService";
import {SimpleLanguageService} from "../../src/service/SimpleLanguageService";

// Setup
export const fileName = "a_file.ts";
let marshallerIntegrated = new Marshaller(new TypeDetector());
let fileLoaderIntegrated = new FileLoader();
let service: ISimpleLanguageService;

test.beforeEach(() => service = new SimpleLanguageService(marshallerIntegrated, fileLoaderIntegrated));

export const parse = (code: string, file: string = fileName) => service.addFile(file, code);
export {service};