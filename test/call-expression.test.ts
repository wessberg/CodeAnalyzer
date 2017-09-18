import {test} from "ava";
import {ICodeAnalyzer} from "../src/code-analyzer/i-code-analyzer";
import {CodeAnalyzer} from "../src/code-analyzer/code-analyzer";
import {createSourceFile, ScriptTarget} from "typescript";

const s = createSourceFile("a_file.ts", `
	@foo()
	class A implements B {}
`, ScriptTarget.ES2017);
console.log(s.statements[0].decorators![0].expression);

let codeAnalyzer: ICodeAnalyzer;
test.beforeEach(() => codeAnalyzer = new CodeAnalyzer());

test("foo", t => {
	const expressions = codeAnalyzer.getCallExpressionsForFile("./test/static/call-expression/a");
	expressions.forEach(_expression => {
		codeAnalyzer.getDefinitionMatchingExpression(_expression.typeArguments[0]);

	});
	t.true(true);
});