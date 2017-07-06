import {test} from "ava";
import {ICodeAnalyzer} from "../../src/analyzer/interface/ICodeAnalyzer";
import {CodeAnalyzer} from "../../src/analyzer/CodeAnalyzer";
import {join} from "path";

// Setup
let base = __dirname;
while (!base.endsWith("test") && !base.endsWith("test/")) base = join(base, "../");
export const fileName = "a_file.ts";
export const filePath = join(base, fileName);
let service: ICodeAnalyzer;

test.beforeEach(() => service = new CodeAnalyzer());
export const parse = (code: string, file: string = filePath) => service.addFile(file, code);
export {service};