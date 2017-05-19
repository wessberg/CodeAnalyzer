import {FileLoader} from "@wessberg/fileloader";
import {Marshaller} from "@wessberg/marshaller";
import {TypeDetector} from "@wessberg/typedetector";
import {test} from "ava";
import {ICodeAnalyzer} from "../../src/service/interface/ICodeAnalyzer";
import {CodeAnalyzer} from "../../src/service/CodeAnalyzer";
import {join} from "path";

// Setup
let base = __dirname;
while (!base.endsWith("test") && !base.endsWith("test/")) base = join(base, "../");
export const fileName = "a_file.ts";
export const filePath = join(base, fileName);
let marshallerIntegrated = new Marshaller(new TypeDetector());
let fileLoaderIntegrated = new FileLoader();
let service: ICodeAnalyzer;

test.beforeEach(() => service = new CodeAnalyzer(marshallerIntegrated, fileLoaderIntegrated));
export const parse = (code: string, file: string = filePath) => service.addFile(file, code);
export {service};