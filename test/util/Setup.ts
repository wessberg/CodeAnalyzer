import {FileLoader} from "@wessberg/fileloader";
import {Marshaller} from "@wessberg/marshaller";
import {TypeDetector} from "@wessberg/typedetector";
import {test} from "ava";
import {ICodeAnalyzer} from "../../src/service/interface/ICodeAnalyzer";
import {CodeAnalyzer} from "../../src/service/CodeAnalyzer";

// Setup
export const fileName = "a_file.ts";
let marshallerIntegrated = new Marshaller(new TypeDetector());
let fileLoaderIntegrated = new FileLoader();
let service: ICodeAnalyzer;

test.beforeEach(() => service = new CodeAnalyzer(marshallerIntegrated, fileLoaderIntegrated));

export const parse = (code: string, file: string = fileName) => service.addFile(file, code);
export {service};