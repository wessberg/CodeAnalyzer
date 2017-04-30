/**
 * All of these code examples are snippets of popular open-source front-end libraries.
 */


export const FULL_CODE_EXAMPLE_1 = `

		var parseXML = function( data ) {
  var xml, tmp;
  if ( !data || typeof data !== "string" ) {
    return null;
  }
  try {
    if ( window.DOMParser ) { // Standard
      tmp = new DOMParser();
      xml = tmp.parseFromString( data , "text/xml" );
    } else { // IE
      xml = new ActiveXObject( "Microsoft.XMLDOM" );
      xml.async = false;
      xml.loadXML( data );
    }
  } catch( e ) {
    xml = undefined;
  }
  if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
    jQuery.error( "Invalid XML: " + data );
  }
  return xml;
};

// Bind a function to a context, optionally partially applying any arguments.
var proxy = function( fn, context ) {
  var tmp, args, proxy;

  if ( typeof context === "string" ) {
    tmp = fn[ context ];
    context = fn;
    fn = tmp;
  }

  // Quick check to determine if target is callable, in the spec
  // this throws a TypeError, but we will just return undefined.
  if ( !jQuery.isFunction( fn ) ) {
    return undefined;
  }

  // Simulated bind
  args = core_slice.call( arguments, 2 );
  proxy = function() {
    return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
  };

  // Set the guid of unique handler to the same of original handler, so it can be removed
  proxy.guid = fn.guid = fn.guid || jQuery.guid++;

  return proxy;
};

Sound.play = function() {}
Sound.prototype = { something; }
Sound.prototype.play = function() {}
Sound.prototype.play = myfunc
var parser = document.createElement('a');
parser.href = "http://example.com:3000/pathname/?search=test#hash";
parser.hostname; // => "example.com"
	`;

export const FULL_CODE_EXAMPLE_2 = `

	"use strict";

var assert = require("assert");
var types = require("ast-types");
var util = require("./util");
var n = types.namedTypes;
var isArray = types.builtInTypes.array;
var isNumber = types.builtInTypes.number;

var forVar = () => {
	for (let i = 0; i < 10; i++) doStuff();
}

var switchVar = () => {
	switch (lol) {
		case 2:
			break;
		default:
			return true;
	}

	while (true) {
		doStuff();
		if (false) continue;
		break;
	}
}

function FastPath(value) {
  assert.ok(this instanceof FastPath);
  this.stack = [value];
}

var FPp = FastPath.prototype;

// Static convenience function for coercing a value to a FastPath.
FastPath.from = function(obj) {
  if (obj instanceof FastPath) {
    // Return a defensive copy of any existing FastPath instances.
    return obj.copy();
  }

  if (obj instanceof types.NodePath) {
    // For backwards compatibility, unroll NodePath instances into
    // lightweight FastPath [..., name, value] stacks.
    var copy = Object.create(FastPath.prototype);
    var stack = [obj.value];
    for (var pp; (pp = obj.parentPath); obj = pp)
      stack.push(obj.name, pp.value);
    copy.stack = stack.reverse();
    return copy;
  }

  // Otherwise use obj as the value of the new FastPath instance.
  return new FastPath(obj);
};

FPp.copy = function copy() {
  var copy = Object.create(FastPath.prototype);
  copy.stack = this.stack.slice(0);
  return copy;
};

// The name of the current property is always the penultimate element of
// this.stack, and always a String.
FPp.getName = function getName() {
  var s = this.stack;
  var len = s.length;
  if (len > 1) {
    return s[len - 2];
  }
  // Since the name is always a string, null is a safe sentinel value to
  // return if we do not know the name of the (root) value.
  return null;
};

// The value of the current property is always the final element of
// this.stack.
FPp.getValue = function getValue() {
  var s = this.stack;
  return s[s.length - 1];
};

function getNodeHelper(path, count) {
  var s = path.stack;

  for (var i = s.length - 1; i >= 0; i -= 2) {
    var value = s[i];
    // Temp: This can be removed when \`ast-types\` knows that TSNodes are Nodes.
    var isTsNode = value && value.type && value.type.startsWith('TS');
    if ((isTsNode || n.Node.check(value)) && --count < 0) {
      return value;
    }
  }

  return null;
}

FPp.getNode = function getNode(count) {
  return getNodeHelper(this, ~~count);
};

FPp.getParentNode = function getParentNode(count) {
  return getNodeHelper(this, ~~count + 1);
};

FPp.isLast = function isLast() {
  var s = this.stack;
  if (this.getParentNode()) {
    var idx = s[s.length - 2];
    // The name of this node should be an index
    assert.ok(typeof idx === "number");

    const arr = s[s.length - 3];
    // We should have an array as a parent node
    assert.ok(Array.isArray(arr));

    return idx === arr.length - 1;
  }
  return false;
};

// Temporarily push properties named by string arguments given after the
// callback function onto this.stack, then call the callback with a
// reference to this (modified) FastPath object. Note that the stack will
// be restored to its original state after the callback is finished, so it
// is probably a mistake to retain a reference to the path.
FPp.call = function call(callback /*, name1, name2, ... */) {
  var s = this.stack;
  var origLen = s.length;
  var value = s[origLen - 1];
  var argc = arguments.length;
  for (var i = 1; i < argc; ++i) {
    var name = arguments[i];
    value = value[name];
    s.push(name, value);
  }
  var result = callback(this);
  s.length = origLen;
  return result;
};

// Similar to FastPath.prototype.call, except that the value obtained by
// accessing this.getValue()[name1][name2]... should be array-like. The
// callback will be called with a reference to this path object for each
// element of the array.
FPp.each = function each(callback /*, name1, name2, ... */) {
  var s = this.stack;
  var origLen = s.length;
  var value = s[origLen - 1];
  var argc = arguments.length;

  for (var i = 1; i < argc; ++i) {
    var name = arguments[i];
    value = value[name];
    s.push(name, value);
  }

  for (var i = 0; i < value.length; ++i) {
    if (i in value) {
      s.push(i, value[i]);
      // If the callback needs to know the value of i, call
      // path.getName(), assuming path is the parameter name.
      callback(this);
      s.length -= 2;
    }
  }

  s.length = origLen;
};

// Similar to FastPath.prototype.each, except that the results of the
// callback function invocations are stored in an array and returned at
// the end of the iteration.
FPp.map = function map(callback /*, name1, name2, ... */) {
  var s = this.stack;
  var origLen = s.length;
  var value = s[origLen - 1];
  var argc = arguments.length;

  for (var i = 1; i < argc; ++i) {
    var name = arguments[i];
    value = value[name];
    s.push(name, value);
  }

  var result = new Array(value.length);

  for (var i = 0; i < value.length; ++i) {
    if (i in value) {
      s.push(i, value[i]);
      result[i] = callback(this, i);
      s.length -= 2;
    }
  }

  s.length = origLen;

  return result;
};

// Inspired by require("ast-types").NodePath.prototype.needsParens, but
// more efficient because we're iterating backwards through a stack.
FPp.needsParens = function() {
  var parent = this.getParentNode();
  if (!parent) {
    return false;
  }

  var name = this.getName();
  var node = this.getNode();

  // If the value of this path is some child of a Node and not a Node
  // itself, then it doesn't need parentheses. Only Node objects (in
  // fact, only Expression nodes) need parentheses.
  if (this.getValue() !== node) {
    return false;
  }

  // Only statements don't need parentheses.
  if (n.Statement.check(node)) {
    return false;
  }

  // Identifiers never need parentheses.
  if (node.type === "Identifier") {
    return false;
  }

  if (parent.type === "ParenthesizedExpression") {
    return false;
  }

  // Add parens around the extends clause of a class. It is needed for almost
  // all expressions.
  if (
    (parent.type === "ClassDeclaration" || parent.type === "ClassExpression") &&
    parent.superClass === node &&
    (node.type === "ArrowFunctionExpression" ||
      node.type === "AssignmentExpression" ||
      node.type === "AwaitExpression" ||
      node.type === "BinaryExpression" ||
      node.type === "ConditionalExpression" ||
      node.type === "LogicalExpression" ||
      node.type === "NewExpression" ||
      node.type === "ObjectExpression" ||
      node.type === "ParenthesizedExpression" ||
      node.type === "SequenceExpression" ||
      node.type === "TaggedTemplateExpression" ||
      node.type === "UnaryExpression" ||
      node.type === "UpdateExpression" ||
      node.type === "YieldExpression")
  ) {
    return true;
  }

  if (
    (parent.type === "ArrowFunctionExpression" &&
      parent.body === node &&
      startsWithNoLookaheadToken(node, /* forbidFunctionAndClass */ false)) ||
    (parent.type === "ExpressionStatement" &&
      startsWithNoLookaheadToken(node, /* forbidFunctionAndClass */ true))
  ) {
    return true;
  }

  switch (node.type) {
    case "CallExpression":
      if (parent.type === "NewExpression" && parent.callee === node) {
        return true;
      }
      return false;

    case "SpreadElement":
    case "SpreadProperty":
      return (
        parent.type === "MemberExpression" &&
        name === "object" &&
        parent.object === node
      );

    case "UpdateExpression":
      if (parent.type === "UnaryExpression") {
        return (
          node.prefix &&
          ((node.operator === "++" && parent.operator === "+") ||
            (node.operator === "--" && parent.operator === "-"))
        );
      }
    // else fall through
    case "UnaryExpression":
      switch (parent.type) {
        case "UnaryExpression":
          return (
            node.operator === parent.operator &&
            (node.operator === "+" || node.operator === "-")
          );

        case "MemberExpression":
          return name === "object" && parent.object === node;

        case "TaggedTemplateExpression":
          return true;

        case "NewExpression":
        case "CallExpression":
          return name === "callee" && parent.callee === node;

        case "BinaryExpression":
          return parent.operator === "**" && name === "left";

        default:
          return false;
      }

    case "BinaryExpression":
      const isLeftOfAForStatement = node => {
        let i = 0;
        while (node) {
          let parent = this.getParentNode(i++);
          if (!parent) {
            return false;
          }
          if (parent.type === "ForStatement" && parent.init === node) {
            return true;
          }
          node = parent;
        }
        return false;
      };
      if (node.operator === "in" && isLeftOfAForStatement(node)) {
        return true;
      }
    // else fall through
    case "LogicalExpression":
      switch (parent.type) {
        case "CallExpression":
        case "NewExpression":
          return name === "callee" && parent.callee === node;

        case "TaggedTemplateExpression":
        case "UnaryExpression":
        case "SpreadElement":
        case "SpreadProperty":
          return true;

        case "MemberExpression":
          return name === "object" && parent.object === node;

        case "BinaryExpression":
        case "LogicalExpression":
          var po = parent.operator;
          var pp = util.getPrecedence(po);
          var no = node.operator;
          var np = util.getPrecedence(no);

          if (po === "||" && no === "&&") {
            return true;
          }

          if (pp > np) {
            return true;
          }

          if (no === "**" && po === "**") {
            return name === "left";
          }

          if (pp === np && name === "right") {
            assert.strictEqual(parent.right, node);
            return true;
          }

          // Add parenthesis when working with binary operators
          // It's not stricly needed but helps with code understanding
          if (["|", "^", "&", ">>", "<<", ">>>"].indexOf(po) !== -1) {
            return true;
          }

        default:
          return false;
      }

    case "SequenceExpression":
      switch (parent.type) {
        case "ReturnStatement":
          return false;

        case "ForStatement":
          // Although parentheses wouldn't hurt around sequence
          // expressions in the head of for loops, traditional style
          // dictates that e.g. i++, j++ should not be wrapped with
          // parentheses.
          return false;

        case "ExpressionStatement":
          return name !== "expression";

        default:
          // Otherwise err on the side of overparenthesization, adding
          // explicit exceptions above if this proves overzealous.
          return true;
      }

    case "YieldExpression":
      if (parent.type === "UnaryExpression") {
        return true;
      }
    // else fall through
    case "AwaitExpression":
      switch (parent.type) {
        case "TaggedTemplateExpression":
        case "BinaryExpression":
        case "LogicalExpression":
        case "SpreadElement":
        case "SpreadProperty":
        case "NewExpression":
        case "MemberExpression":
          return true;

        case "CallExpression":
          return parent.callee === node;

        case "ConditionalExpression":
          return parent.test === node;

        default:
          return false;
      }

    case "ArrayTypeAnnotation":
      return parent.type === "NullableTypeAnnotation";

    case "IntersectionTypeAnnotation":
    case "UnionTypeAnnotation":
      return (
        parent.type === "ArrayTypeAnnotation" ||
        parent.type === "NullableTypeAnnotation" ||
        parent.type === "IntersectionTypeAnnotation" ||
        parent.type === "UnionTypeAnnotation"
      );

    case "NullableTypeAnnotation":
      return parent.type === "ArrayTypeAnnotation";

    case "FunctionTypeAnnotation":
      return (
        parent.type === "UnionTypeAnnotation" ||
        parent.type === "IntersectionTypeAnnotation"
      );

    case "NumericLiteral":
    case "Literal":
      return (
        parent.type === "MemberExpression" &&
        isNumber.check(node.value) &&
        name === "object" &&
        parent.object === node
      );

    case "AssignmentExpression":
      if (parent.type === "ArrowFunctionExpression" && parent.body === node) {
        return true;
      } else if (
        parent.type === "ForStatement" &&
        (parent.init === node || parent.update === node)
      ) {
        return false;
      } else if (parent.type === "ExpressionStatement") {
        return node.left.type === "ObjectPattern";
      } else if (parent.type === "AssignmentExpression") {
        return false;
      }
      return true;

    case "ConditionalExpression":
      switch (parent.type) {
        case "TaggedTemplateExpression":
        case "UnaryExpression":
        case "SpreadElement":
        case "SpreadProperty":
        case "BinaryExpression":
        case "LogicalExpression":
        case "ExportDefaultDeclaration":
        case "AwaitExpression":
        case "JSXSpreadAttribute":
        case "ArrowFunctionExpression":
          return true;

        case "NewExpression":
        case "CallExpression":
          return name === "callee" && parent.callee === node;

        case "ConditionalExpression":
          return name === "test" && parent.test === node;

        case "MemberExpression":
          return name === "object" && parent.object === node;

        default:
          return false;
      }

    case "FunctionExpression":
      switch (parent.type) {
        case "CallExpression":
          return name === "callee"; // Not strictly necessary, but it's clearer to the reader if IIFEs are wrapped in parentheses.
        case "TaggedTemplateExpression":
          return true; // This is basically a kind of IIFE.
        case "ExportDefaultDeclaration":
          return true;
        default:
          return false;
      }

    case "ArrowFunctionExpression":
      switch (parent.type) {
        case "CallExpression":
          return name === "callee";

        case "NewExpression":
          return name === "callee";

        case "MemberExpression":
          return name === "object";

        case "BindExpression":
        case "TaggedTemplateExpression":
        case "UnaryExpression":
        case "LogicalExpression":
        case "BinaryExpression":
          return true;

        case "ConditionalExpression":
          return name === "test";

        default:
          return false;
      }

    case "ClassExpression":
      return parent.type === "ExportDefaultDeclaration";

    case "StringLiteral":
      return parent.type === "ExpressionStatement"; // To avoid becoming a directive
  }

  if (
    parent.type === "NewExpression" &&
    name === "callee" &&
    parent.callee === node
  ) {
    return containsCallExpression(node);
  }

  return false;
};

function containsCallExpression(node) {
  if (n.CallExpression.check(node)) {
    return true;
  }

  if (isArray.check(node)) {
    return node.some(containsCallExpression);
  }

  if (n.Node.check(node)) {
    return types.someField(node, function(name, child) {
      return containsCallExpression(child);
    });
  }

  return false;
}

// Tests if an expression starts with \`{\`, or (if forbidFunctionAndClass holds) \`function\` or \`class\`.
// Will be overzealous if there's already necessary grouping parentheses.
function startsWithNoLookaheadToken(node, forbidFunctionAndClass) {
  node = getLeftMost(node);
  switch (node.type) {
    case "FunctionExpression":
    case "ClassExpression":
      return forbidFunctionAndClass;
    case "ObjectExpression":
      return true;
    case "MemberExpression":
      return startsWithNoLookaheadToken(node.object, forbidFunctionAndClass);
    case "TaggedTemplateExpression":
      if (node.tag.type === "FunctionExpression") {
        // IIFEs are always already parenthesized
        return false;
      }
      return startsWithNoLookaheadToken(node.tag, forbidFunctionAndClass);
    case "CallExpression":
      if (node.callee.type === "FunctionExpression") {
        // IIFEs are always already parenthesized
        return false;
      }
      return startsWithNoLookaheadToken(node.callee, forbidFunctionAndClass);
    case "ConditionalExpression":
      return startsWithNoLookaheadToken(node.test, forbidFunctionAndClass);
    case "UpdateExpression":
      return (
        !node.prefix &&
        startsWithNoLookaheadToken(node.argument, forbidFunctionAndClass)
      );
    case "BindExpression":
      return (
        node.object &&
        startsWithNoLookaheadToken(node.object, forbidFunctionAndClass)
      );
    case "SequenceExpression":
      return startsWithNoLookaheadToken(
        node.expressions[0],
        forbidFunctionAndClass
      );
    default:
      return false;
  }
}

function getLeftMost(node) {
  if (node.left) {
    return getLeftMost(node.left);
  } else {
    return node;
  }
}

module.exports = FastPath;
`;

export const FULL_CODE_EXAMPLE_3 = `

"use strict";

var test = () => {
	throw new Error();
	const wtf = {what};
	module.exports = {what};
}

var assert = require("assert");
var comments = require("./comments");
var FastPath = require("./fast-path");
var util = require("./util");
var isIdentifierName = require("esutils").keyword.isIdentifierNameES6;

var docBuilders = require("./doc-builders");
var concat = docBuilders.concat;
var join = docBuilders.join;
var line = docBuilders.line;
var hardline = docBuilders.hardline;
var softline = docBuilders.softline;
var literalline = docBuilders.literalline;
var group = docBuilders.group;
var indent = docBuilders.indent;
var align = docBuilders.align;
var conditionalGroup = docBuilders.conditionalGroup;
var ifBreak = docBuilders.ifBreak;
var breakParent = docBuilders.breakParent;
var lineSuffixBoundary = docBuilders.lineSuffixBoundary;

var docUtils = require("./doc-utils");
var willBreak = docUtils.willBreak;
var isLineNext = docUtils.isLineNext;
var isEmpty = docUtils.isEmpty;

var types = require("ast-types");
var namedTypes = types.namedTypes;
var isString = types.builtInTypes.string;

function shouldPrintComma(options, level) {
  level = level || "es5";

  switch (options.trailingComma) {
    case "all":
      if (level === "all") {
        return true;
      }
    case "es5":
      if (level === "es5") {
        return true;
      }
    case "none":
    default:
      return false;
  }
}

function genericPrint(path, options, printPath, args) {
  assert.ok(path instanceof FastPath);

  var node = path.getValue();

  // Escape hatch
  if (
    node &&
    node.comments &&
    node.comments.length > 0 &&
    node.comments.some(comment => comment.value.trim() === "prettier-ignore")
  ) {
    return options.originalText.slice(util.locStart(node), util.locEnd(node));
  }

  var parts = [];
  var needsParens = false;
  var linesWithoutParens = genericPrintNoParens(path, options, printPath, args);

  if (!node || isEmpty(linesWithoutParens)) {
    return linesWithoutParens;
  }

  if (
    node.decorators &&
    node.decorators.length > 0 &&
    // If the parent node is an export declaration, it will be
    // responsible for printing node.decorators.
    !util.getParentExportDeclaration(path)
  ) {
    const separator = node.decorators.length === 1 &&
      (node.decorators[0].expression.type === "Identifier" ||
        node.decorators[0].expression.type === "MemberExpression")
      ? " "
      : hardline;
    path.each(function(decoratorPath) {
      parts.push(printPath(decoratorPath), separator);
    }, "decorators");
  } else if (
    util.isExportDeclaration(node) &&
    node.declaration &&
    node.declaration.decorators
  ) {
    // Export declarations are responsible for printing any decorators
    // that logically apply to node.declaration.
    path.each(
      function(decoratorPath) {
        parts.push(printPath(decoratorPath), line);
      },
      "declaration",
      "decorators"
    );
  } else {
    // Nodes with decorators can't have parentheses, so we can avoid
    // computing path.needsParens() except in this case.
    needsParens = path.needsParens();
  }

  if (node.type) {
    // HACK: ASI prevention in no-semi mode relies on knowledge of whether
    // or not a paren has been inserted (see \`exprNeedsASIProtection()\`).
    // For now, we're just passing that information by mutating the AST here,
    // but it would be nice to find a cleaner way to do this.
    node.needsParens = needsParens;
  }

  if (needsParens) {
    parts.unshift("(");
  }

  parts.push(linesWithoutParens);

  if (needsParens) {
    parts.push(")");
  }

  return concat(parts);
}

function genericPrintNoParens(path, options, print, args) {
  var n = path.getValue();
  const semi = options.semi ? ";" : "";

  if (!n) {
    return "";
  }

  if (typeof n === "string") {
    return n;
  }

  // TODO: Investigate types that return not printable.
  // This assert isn't very useful though.
  // namedTypes.Printable.assert(n);

  var parts = [];
  switch (n.type) {
    case "File":
      return path.call(print, "program");
    case "Program":
      // Babel 6
      if (n.directives) {
        path.each(function(childPath) {
          parts.push(print(childPath), semi, hardline);
          if (
            util.isNextLineEmpty(options.originalText, childPath.getValue())
          ) {
            parts.push(hardline);
          }
        }, "directives");
      }

      parts.push(
        path.call(function(bodyPath) {
          return printStatementSequence(bodyPath, options, print);
        }, "body")
      );

      parts.push(
        comments.printDanglingComments(path, options, /* sameIndent */ true)
      );

      // Only force a trailing newline if there were any contents.
      if (n.body.length || n.comments) {
        parts.push(hardline);
      }

      return concat(parts);
    // Babel extension.
    case "Noop":
    case "EmptyStatement":
      return "";
    case "ExpressionStatement":
      return concat([path.call(print, "expression"), semi]); // Babel extension.
    case "ParenthesizedExpression":
      return concat(["(", path.call(print, "expression"), ")"]);
    case "AssignmentExpression":
      return printAssignment(
        n.left,
        path.call(print, "left"),
        n.operator,
        n.right,
        path.call(print, "right"),
        options
      );
    case "BinaryExpression":
    case "LogicalExpression": {
      const parent = path.getParentNode();
      const isInsideParenthesis =
        n !== parent.body &&
        (parent.type === "IfStatement" ||
          parent.type === "WhileStatement" ||
          parent.type === "DoStatement");

      const parts = printBinaryishExpressions(
        path,
        print,
        options,
        /* isNested */ false,
        isInsideParenthesis
      );

      //   if (
      //     this.hasPlugin("dynamicImports") && this.lookahead().type === tt.parenLeft
      //   ) {
      //
      // looks super weird, we want to break the children if the parent breaks
      //
      //   if (
      //     this.hasPlugin("dynamicImports") &&
      //     this.lookahead().type === tt.parenLeft
      //   ) {
      if (isInsideParenthesis) {
        return concat(parts);
      }

      // Avoid indenting sub-expressions in assignment/return/etc statements.
      if (
        parent.type === "AssignmentExpression" ||
        parent.type === "VariableDeclarator" ||
        shouldInlineLogicalExpression(n) ||
        parent.type === "ReturnStatement" ||
        (n === parent.body && parent.type === "ArrowFunctionExpression") ||
        (n !== parent.body && parent.type === "ForStatement")
      ) {
        return group(concat(parts));
      }

      const rest = concat(parts.slice(1));

      return group(
        concat([
          // Don't include the initial expression in the indentation
          // level. The first item is guaranteed to be the first
          // left-most expression.
          parts.length > 0 ? parts[0] : "",
          indent(rest)
        ])
      );
    }
    case "AssignmentPattern":
      return concat([
        path.call(print, "left"),
        " = ",
        path.call(print, "right")
      ]);
    case "MemberExpression": {
      const parent = path.getParentNode();
      let firstNonMemberParent;
      let i = 0;
      do {
        firstNonMemberParent = path.getParentNode(i);
        i++;
      } while (
        firstNonMemberParent &&
        firstNonMemberParent.type === "MemberExpression"
      );

      const shouldInline =
        firstNonMemberParent && (
          (firstNonMemberParent.type === "VariableDeclarator" &&
            firstNonMemberParent.id.type !== "Identifier") ||
          (firstNonMemberParent.type === "AssignmentExpression" &&
            firstNonMemberParent.left.type !== "Identifier")) ||
        n.computed ||
        (n.object.type === "Identifier" &&
          n.property.type === "Identifier" &&
          parent.type !== "MemberExpression");

      return concat([
        path.call(print, "object"),
        shouldInline
          ? printMemberLookup(path, options, print)
          : group(
              indent(
                concat([softline, printMemberLookup(path, options, print)])
              )
            )
      ]);
    }
    case "MetaProperty":
      return concat([
        path.call(print, "meta"),
        ".",
        path.call(print, "property")
      ]);
    case "BindExpression":
      if (n.object) {
        parts.push(path.call(print, "object"));
      }

      parts.push("::", path.call(print, "callee"));

      return concat(parts);
    case "Path":
      return join(".", n.body);
    case "Identifier":
      var parentNode = path.getParentNode()
      var isFunctionDeclarationIdentifier =
        parentNode.type === 'DeclareFunction' &&
        parentNode.id === n

      return concat([
        n.name,
        n.optional ? "?" : "",
        (n.typeAnnotation && !isFunctionDeclarationIdentifier) ? ": " : "",
        path.call(print, "typeAnnotation")
      ]);
    case "SpreadElement":
    case "SpreadElementPattern":
    // Babel 6 for ObjectPattern
    case "RestProperty":
    case "SpreadProperty":
    case "SpreadPropertyPattern":
    case "RestElement":
    case "ObjectTypeSpreadProperty":
      return concat([
        "...",
        path.call(print, "argument"),
        n.typeAnnotation ? ": " : "",
        path.call(print, "typeAnnotation")
      ]);
    case "FunctionDeclaration":
    case "FunctionExpression":
      if (isNodeStartingWithDeclare(n, options)) {
        parts.push("declare ");
      }
      parts.push(printFunctionDeclaration(path, print, options));
      return concat(parts);
    case "ArrowFunctionExpression": {
      if (n.async) parts.push("async ");

      if (n.typeParameters) {
        parts.push(path.call(print, "typeParameters"));
      }

      if (canPrintParamsWithoutParens(n)) {
        parts.push(path.call(print, "params", 0));
      } else {
        parts.push(
          group(
            concat([
              printFunctionParams(
                path,
                print,
                options,
                args && (args.expandLastArg || args.expandFirstArg)
              ),
              printReturnType(path, print)
            ])
          )
        );
      }

      parts.push(" =>");

      const body = path.call(print, "body");
      const collapsed = concat([concat(parts), " ", body]);

      // We want to always keep these types of nodes on the same line
      // as the arrow.
      if (
        n.body.type === "ArrayExpression" ||
        n.body.type === "ObjectExpression" ||
        n.body.type === "JSXElement" ||
        n.body.type === "BlockStatement" ||
        n.body.type === "TaggedTemplateExpression" ||
        n.body.type === "TemplateElement" ||
        n.body.type === "ClassExpression" ||
        n.body.type === "ArrowFunctionExpression"
      ) {
        return group(collapsed);
      }

      // if the arrow function is expanded as last argument, we are adding a
      // level of indentation and need to add a softline to align the closing )
      // with the opening (.
      const shouldAddSoftLine = args && args.expandLastArg;

      return group(
        concat([
          concat(parts),
          group(
            concat([
              indent(concat([line, body])),
              shouldAddSoftLine
                ? concat([
                    ifBreak(shouldPrintComma(options, "all") ? "," : ""),
                    softline
                  ])
                : ""
            ])
          )
        ])
      );
    }
    case "MethodDefinition":
    case "TSAbstractMethodDefinition":
      if (n.static) {
        parts.push("static ");
      }
      if (n.accessibility) {
        parts.push(n.accessibility + " ");
      }
      if (n.type === "TSAbstractMethodDefinition") {
        parts.push("abstract ");
      }

      parts.push(printMethod(path, options, print));

      return concat(parts);
    case "YieldExpression":
      parts.push("yield");

      if (n.delegate) parts.push("*");

      if (n.argument) parts.push(" ", path.call(print, "argument"));

      return concat(parts);
    case "AwaitExpression":
      parts.push("await");

      if (n.all) parts.push("*");

      if (n.argument) parts.push(" ", path.call(print, "argument"));

      return concat(parts);
    case "ModuleDeclaration":
      parts.push("module", path.call(print, "id"));

      if (n.source) {
        assert.ok(!n.body);

        parts.push("from", path.call(print, "source"));
      } else {
        parts.push(path.call(print, "body"));
      }

      return join(" ", parts);
    case "ImportSpecifier":
      if (n.imported) {
        if (n.importKind) {
          parts.push(path.call(print, "importKind"), " ");
        }

        parts.push(path.call(print, "imported"));

        if (n.local && n.local.name !== n.imported.name) {
          parts.push(" as ", path.call(print, "local"));
        }
      } else if (n.id) {
        parts.push(path.call(print, "id"));

        if (n.name) {
          parts.push(" as ", path.call(print, "name"));
        }
      }

      return concat(parts);
    case "ExportSpecifier":
      if (n.local) {
        parts.push(path.call(print, "local"));

        if (n.exported && n.exported.name !== n.local.name) {
          parts.push(" as ", path.call(print, "exported"));
        }
      } else if (n.id) {
        parts.push(path.call(print, "id"));

        if (n.name) {
          parts.push(" as ", path.call(print, "name"));
        }
      }

      return concat(parts);
    case "ExportBatchSpecifier":
      return "*";
    case "ImportNamespaceSpecifier":
      parts.push("* as ");

      if (n.local) {
        parts.push(path.call(print, "local"));
      } else if (n.id) {
        parts.push(path.call(print, "id"));
      }

      return concat(parts);
    case "ImportDefaultSpecifier":
      if (n.local) {
        return path.call(print, "local");
      }

      return path.call(print, "id");
    case "ExportDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
      return printExportDeclaration(path, options, print);
    case "ExportAllDeclaration":
      parts.push("export *");

      if (n.exported) {
        parts.push(" as ", path.call(print, "exported"));
      }

      parts.push(" from ", path.call(print, "source"), semi);

      return concat(parts);
    case "ExportNamespaceSpecifier":
    case "ExportDefaultSpecifier":
      return path.call(print, "exported");
    case "ImportDeclaration":
      parts.push("import ");

      const fromParts = [];

      if (n.importKind && n.importKind !== "value") {
        parts.push(n.importKind + " ");
      }

      var standalones = [];
      var grouped = [];
      if (n.specifiers && n.specifiers.length > 0) {
        path.each(function(specifierPath) {
          var value = specifierPath.getValue();
          if (
            namedTypes.ImportDefaultSpecifier.check(value) ||
            namedTypes.ImportNamespaceSpecifier.check(value)
          ) {
            standalones.push(print(specifierPath));
          } else {
            grouped.push(print(specifierPath));
          }
        }, "specifiers");

        if (standalones.length > 0) {
          parts.push(join(", ", standalones));
        }

        if (standalones.length > 0 && grouped.length > 0) {
          parts.push(", ");
        }

        if (grouped.length > 0) {
          parts.push(
            group(
              concat([
                "{",
                indent(
                  concat([
                    options.bracketSpacing ? line : softline,
                    join(concat([",", line]), grouped)
                  ])
                ),
                ifBreak(shouldPrintComma(options) ? "," : ""),
                options.bracketSpacing ? line : softline,
                "}"
              ])
            )
          );
        }

        fromParts.push(grouped.length === 0 ? line : " ", "from ");
      } else if (n.importKind && n.importKind === "type") {
        parts.push("{} from ");
      }

      fromParts.push(path.call(print, "source"), semi);

      // If there's a very long import, break the following way:
      //
      //   import veryLong
      //     from 'verylong'
      //
      // In case there are grouped elements, they will already break the way
      // we want and this break would take precedence instead.
      if (grouped.length === 0) {
        return group(concat([concat(parts), indent(concat(fromParts))]));
      }

      return concat([concat(parts), concat(fromParts)]);

    case "Import": {
      return "import";
    }
    case "BlockStatement": {
      var naked = path.call(function(bodyPath) {
        return printStatementSequence(bodyPath, options, print);
      }, "body");

      const hasContent = n.body.find(node => node.type !== "EmptyStatement");
      const hasDirectives = n.directives && n.directives.length > 0;

      var parent = path.getParentNode();
      const parentParent = path.getParentNode(1);
      if (
        !hasContent &&
        !hasDirectives &&
        !n.comments &&
        (parent.type === "ArrowFunctionExpression" ||
          parent.type === "FunctionExpression" ||
          parent.type === "FunctionDeclaration" ||
          parent.type === "ObjectMethod" ||
          parent.type === "ClassMethod" ||
          (parent.type === "CatchClause" && !parentParent.finalizer))
      ) {
        return "{}";
      }

      parts.push("{");

      // Babel 6
      if (hasDirectives) {
        path.each(function(childPath) {
          parts.push(indent(concat([hardline, print(childPath), semi])));
        }, "directives");
      }

      if (hasContent) {
        parts.push(indent(concat([hardline, naked])));
      }

      parts.push(comments.printDanglingComments(path, options));
      parts.push(hardline, "}");

      return concat(parts);
    }
    case "ReturnStatement":
      parts.push("return");

      if (n.argument) {
        if (returnArgumentHasLeadingComment(options, n.argument)) {
          parts.push(
            concat([
              " (",
              indent(concat([softline, path.call(print, "argument")])),
              line,
              ")"
            ])
          );
        } else if (
          n.argument.type === "LogicalExpression" ||
          n.argument.type === "BinaryExpression"
        ) {
          parts.push(
            group(
              concat([
                ifBreak(" (", " "),
                indent(concat([softline, path.call(print, "argument")])),
                softline,
                ifBreak(")")
              ])
            )
          );
        } else {
          parts.push(" ", path.call(print, "argument"));
        }
      }

      const hasDanglingComments =
        n.comments &&
        n.comments.some(comment => !comment.leading && !comment.trailing);

      if (hasDanglingComments) {
        parts.push(
          " ",
          comments.printDanglingComments(path, options, /* sameIndent */ true)
        );
      }

      parts.push(semi);

      return concat(parts);
    case "CallExpression": {
      if (
        // We want to keep require calls as a unit
        (n.callee.type === "Identifier" && n.callee.name === "require") ||
        // Keep test declarations on a single line
        // e.g. \`it('long name', () => {\`
        (n.callee.type === "Identifier" &&
          (n.callee.name === "it" ||
            n.callee.name === "test" ||
            n.callee.name === "describe") &&
          n.arguments.length === 2 &&
          (n.arguments[0].type === "StringLiteral" ||
            n.arguments[0].type === "TemplateLiteral" ||
            (n.arguments[0].type === "Literal" &&
              typeof n.arguments[0].value === "string")) &&
          (n.arguments[1].type === "FunctionExpression" ||
            n.arguments[1].type === "ArrowFunctionExpression") &&
          n.arguments[1].params.length <= 1)
      ) {
        return concat([
          path.call(print, "callee"),
          path.call(print, "typeParameters"),
          concat(["(", join(", ", path.map(print, "arguments")), ")"])
        ]);
      }

      // We detect calls on member lookups and possibly print them in a
      // special chain format. See \`printMemberChain\` for more info.
      if (n.callee.type === "MemberExpression") {
        return printMemberChain(path, options, print);
      }

      return concat([
        path.call(print, "callee"),
        path.call(print, "typeParameters"),
        printArgumentsList(path, options, print)
      ]);
    }

    case "ObjectExpression":
    case "ObjectPattern":
    case "ObjectTypeAnnotation":
    case "TSTypeLiteral":
      var isTypeAnnotation = n.type === "ObjectTypeAnnotation";
      var isTypeScriptTypeAnnotaion = n.type === "TSTypeLiteral";
      // Leave this here because we *might* want to make this
      // configurable later -- flow accepts ";" for type separators,
      // typescript accepts ";" and newlines
      var separator = isTypeAnnotation ? "," : ",";
      var fields = [];
      var leftBrace = n.exact ? "{|" : "{";
      var rightBrace = n.exact ? "|}" : "}";
      var parent = path.getParentNode(0);
      var parentIsUnionTypeAnnotation = parent.type === "UnionTypeAnnotation";
      var propertiesField = isTypeScriptTypeAnnotaion
        ? "members"
        : "properties";

      if (isTypeAnnotation) {
        fields.push("indexers", "callProperties");
      }

      fields.push(propertiesField);

      var props = [];
      let separatorParts = [];

      fields.forEach(function(field) {
        path.each(function(childPath) {
          props.push(concat(separatorParts));
          props.push(group(print(childPath)));

          separatorParts = [separator, line];
          if (
            util.isNextLineEmpty(options.originalText, childPath.getValue())
          ) {
            separatorParts.push(hardline);
          }
        }, field);
      });

      const lastElem = util.getLast(n[propertiesField]);

      const canHaveTrailingComma = !(
        lastElem &&
        (lastElem.type === "RestProperty" || lastElem.type === "RestElement")
      );

      const shouldBreak =
        n.type !== "ObjectPattern" &&
        util.hasNewlineInRange(
          options.originalText,
          util.locStart(n),
          util.locEnd(n)
        );

      if (props.length === 0) {
        return group(
          concat([
            leftBrace,
            comments.printDanglingComments(path, options),
            softline,
            rightBrace
          ])
        );
      } else {
        return group(
          concat([
            leftBrace,
            indent(
              align(
                parentIsUnionTypeAnnotation ? 2 : 0,
                concat([
                  options.bracketSpacing ? line : softline,
                  concat(props)
                ])
              )
            ),
            ifBreak(
              canHaveTrailingComma && shouldPrintComma(options) ? "," : ""
            ),
            align(
              parentIsUnionTypeAnnotation ? 2 : 0,
              concat([options.bracketSpacing ? line : softline, rightBrace])
            ),
            n.typeAnnotation ? ": " : "",
            path.call(print, "typeAnnotation")
          ]),
          { shouldBreak }
        );
      }

    case "PropertyPattern":
      return concat([
        path.call(print, "key"),
        ": ",
        path.call(print, "pattern")
      ]);
    // Babel 6
    case "ObjectProperty": // Non-standard AST node type.
    case "Property":
      if (n.method || n.kind === "get" || n.kind === "set") {
        return printMethod(path, options, print);
      }

      if (n.shorthand) {
        parts.push(path.call(print, "value"));
      } else {
        if (n.computed) {
          parts.push("[", path.call(print, "key"), "]");
        } else {
          parts.push(printPropertyKey(path, options, print));
        }
        parts.push(concat([": ", path.call(print, "value")]));
      }

      return concat(parts); // Babel 6
    case "ClassMethod":
      if (n.static) {
        parts.push("static ");
      }

      parts = parts.concat(printObjectMethod(path, options, print));

      return concat(parts); // Babel 6
    case "ObjectMethod":
      return printObjectMethod(path, options, print);
    case "Decorator":
      return concat(["@", path.call(print, "expression")]);
    case "ArrayExpression":
    case "ArrayPattern":
      if (n.elements.length === 0) {
        parts.push(
          group(
            concat([
              "[",
              comments.printDanglingComments(path, options),
              softline,
              "]"
            ])
          )
        );
      } else {
        const lastElem = util.getLast(n.elements);
        const canHaveTrailingComma = !(lastElem &&
          lastElem.type === "RestElement");

        // JavaScript allows you to have empty elements in an array which
        // changes its length based on the number of commas. The algorithm
        // is that if the last argument is null, we need to force insert
        // a comma to ensure JavaScript recognizes it.
        //   [,].length === 1
        //   [1,].length === 1
        //   [1,,].length === 2
        //
        // Note that util.getLast returns null if the array is empty, but
        // we already check for an empty array just above so we are safe
        const needsForcedTrailingComma =
          canHaveTrailingComma && lastElem === null;

        parts.push(
          group(
            concat([
              "[",
              indent(
                concat([
                  softline,
                  printArrayItems(path, options, "elements", print)
                ])
              ),
              needsForcedTrailingComma ? "," : "",
              ifBreak(
                canHaveTrailingComma &&
                  !needsForcedTrailingComma &&
                  shouldPrintComma(options)
                  ? ","
                  : ""
              ),
              comments.printDanglingComments(
                path,
                options,
                /* sameIndent */ true
              ),
              softline,
              "]"
            ])
          )
        );
      }

      if (n.typeAnnotation) parts.push(": ", path.call(print, "typeAnnotation"));

      return concat(parts);
    case "SequenceExpression":
      return join(", ", path.map(print, "expressions"));
    case "ThisExpression":
      return "this";
    case "Super":
      return "super";
    // Babel 6 Literal split
    case "NullLiteral":
      return "null";
    // Babel 6 Literal split
    case "RegExpLiteral":
      return printRegex(n);
    // Babel 6 Literal split
    case "NumericLiteral":
      return printNumber(n.extra.raw);
    // Babel 6 Literal split
    case "BooleanLiteral":
    // Babel 6 Literal split
    case "StringLiteral":
    case "Literal":
      if (typeof n.value === "number") return printNumber(n.raw);
      if (n.regex) return printRegex(n.regex);
      if (typeof n.value !== "string") return "" + n.value;

      return nodeStr(n, options); // Babel 6
    case "Directive":
      return path.call(print, "value"); // Babel 6
    case "DirectiveLiteral":
      return nodeStr(n, options);
    case "ModuleSpecifier":
      if (n.local) {
        throw new Error("The ESTree ModuleSpecifier type should be abstract");
      }

      // The Esprima ModuleSpecifier type is just a string-valued
      // Literal identifying the imported-from module.
      return nodeStr(n, options);
    case "UnaryExpression":
      parts.push(n.operator);

      if (/[a-z]$/.test(n.operator)) parts.push(" ");

      parts.push(path.call(print, "argument"));

      return concat(parts);
    case "UpdateExpression":
      parts.push(path.call(print, "argument"), n.operator);

      if (n.prefix) parts.reverse();

      return concat(parts);
    case "ConditionalExpression":
      return group(
        concat([
          path.call(print, "test"),
          indent(
            concat([
              line,
              "? ",
              align(2, path.call(print, "consequent")),
              line,
              ": ",
              align(2, path.call(print, "alternate"))
            ])
          )
        ])
      );
    case "NewExpression":
      parts.push("new ", path.call(print, "callee"));

      if (n.typeParameters) {
        parts.push(path.call(print, "typeParameters"));
      }

      var args = n.arguments;

      if (args) {
        parts.push(printArgumentsList(path, options, print));
      }

      return concat(parts);
    case "VariableDeclaration":
      var printed = path.map(function(childPath) {
        return print(childPath);
      }, "declarations");

      parts = [
        isNodeStartingWithDeclare(n, options) ? "declare " : "",
        n.kind,
        " ",
        printed[0],
        indent(concat(printed.slice(1).map(p => concat([",", line, p]))))
      ];

      // We generally want to terminate all variable declarations with a
      // semicolon, except when they in the () part of for loops.
      var parentNode = path.getParentNode();

      var isParentForLoop =
        namedTypes.ForStatement.check(parentNode) ||
        namedTypes.ForInStatement.check(parentNode) ||
        (namedTypes.ForOfStatement &&
          namedTypes.ForOfStatement.check(parentNode)) ||
        (namedTypes.ForAwaitStatement &&
          namedTypes.ForAwaitStatement.check(parentNode));

      if (!(isParentForLoop && parentNode.body !== n)) {
        parts.push(semi);
      }

      return group(concat(parts));
    case "VariableDeclarator":
      return printAssignment(
        n.id,
        concat([path.call(print, "id"), path.call(print, "typeParameters")]),
        "=",
        n.init,
        n.init && path.call(print, "init"),
        options
      );
    case "WithStatement":
      return concat([
        "with (",
        path.call(print, "object"),
        ")",
        adjustClause(n.body, path.call(print, "body"))
      ]);
    case "IfStatement":
      const con = adjustClause(n.consequent, path.call(print, "consequent"));
      const opening = group(
        concat([
          "if (",
          group(
            concat([
              indent(concat([softline, path.call(print, "test")])),
              softline
            ])
          ),
          ")",
          con
        ])
      );

      parts.push(opening);

      if (n.alternate) {
        if (n.consequent.type === "BlockStatement") {
          parts.push(" else");
        } else {
          parts.push(hardline, "else");
        }

        parts.push(
          group(
            adjustClause(
              n.alternate,
              path.call(print, "alternate"),
              n.alternate.type === "IfStatement"
            )
          )
        );
      }

      return concat(parts);
    case "ForStatement": {
      const body = adjustClause(n.body, path.call(print, "body"));

      // We want to keep dangling comments above the loop to stay consistent.
      // Any comment positioned between the for statement and the parentheses
      // is going to be printed before the statement.
      const dangling = comments.printDanglingComments(
        path,
        options,
        /* sameLine */ true
      );
      const printedComments = dangling ? concat([dangling, softline]) : "";

      if (!n.init && !n.test && !n.update) {
        return concat([printedComments, "for (;;)", body]);
      }

      return concat([
        printedComments,
        "for (",
        group(
          concat([
            indent(
              concat([
                softline,
                path.call(print, "init"),
                ";",
                line,
                path.call(print, "test"),
                ";",
                line,
                path.call(print, "update")
              ])
            ),
            softline
          ])
        ),
        ")",
        body
      ]);
    }
    case "WhileStatement":
      return concat([
        "while (",
        group(
          concat([
            indent(concat([softline, path.call(print, "test")])),
            softline
          ])
        ),
        ")",
        adjustClause(n.body, path.call(print, "body"))
      ]);
    case "ForInStatement":
      // Note: esprima can't actually parse "for each (".
      return concat([
        n.each ? "for each (" : "for (",
        path.call(print, "left"),
        " in ",
        path.call(print, "right"),
        ")",
        adjustClause(n.body, path.call(print, "body"))
      ]);

    case "ForOfStatement":
    case "ForAwaitStatement":
      // Babylon 7 removed ForAwaitStatement in favor of ForOfStatement
      // with \`"await": true\`:
      // https://github.com/estree/estree/pull/138
      const isAwait = n.type === "ForAwaitStatement" || n.await;

      return concat([
        "for",
        isAwait ? " await" : "",
        " (",
        path.call(print, "left"),
        " of ",
        path.call(print, "right"),
        ")",
        adjustClause(n.body, path.call(print, "body"))
      ]);

    case "DoWhileStatement":
      var clause = adjustClause(n.body, path.call(print, "body"));
      var doBody = concat(["do", clause]);
      var parts = [doBody];

      if (n.body.type === "BlockStatement") {
        parts.push(" ");
      } else {
        parts.push(hardline);
      }
      parts.push("while (");

      parts.push(group(
          concat([
            indent(softline), path.call(print, "test"),
            softline
          ])
        ), ")", semi);

      return concat(parts);
    case "DoExpression":
      return concat(["do ", path.call(print, "body")]);
    case "BreakStatement":
      parts.push("break");

      if (n.label) parts.push(" ", path.call(print, "label"));

      parts.push(semi);

      return concat(parts);
    case "ContinueStatement":
      parts.push("continue");

      if (n.label) parts.push(" ", path.call(print, "label"));

      parts.push(semi);

      return concat(parts);
    case "LabeledStatement":
      if (n.body.type === "EmptyStatement") {
        return concat([path.call(print, "label"), ":;"]);
      }

      return concat([
        path.call(print, "label"),
        ": ",
        path.call(print, "body")
      ]);
    case "TryStatement":
      parts.push("try ", path.call(print, "block"));

      if (n.handler) {
        parts.push(" ", path.call(print, "handler"));
      } else if (n.handlers) {
        path.each(function(handlerPath) {
          parts.push(" ", print(handlerPath));
        }, "handlers");
      }

      if (n.finalizer) {
        parts.push(" finally ", path.call(print, "finalizer"));
      }

      return concat(parts);
    case "CatchClause":
      parts.push("catch (", path.call(print, "param"));

      if (n.guard)
        // Note: esprima does not recognize conditional catch clauses.
        parts.push(" if ", path.call(print, "guard"));

      parts.push(") ", path.call(print, "body"));

      return concat(parts);
    case "ThrowStatement":
      return concat(["throw ", path.call(print, "argument"), semi]);
    // Note: ignoring n.lexical because it has no printing consequences.
    case "SwitchStatement":
      return concat([
        "switch (",
        path.call(print, "discriminant"),
        ") {",
        n.cases.length > 0
          ? indent(concat([hardline, join(hardline, path.map(print, "cases"))]))
          : "",
        hardline,
        "}"
      ]);
    case "SwitchCase":
      if (n.test) parts.push("case ", path.call(print, "test"), ":");
      else parts.push("default:");

      const isFirstCase = path.getNode() === path.getParentNode().cases[0];

      if (
        !isFirstCase &&
        util.isPreviousLineEmpty(options.originalText, path.getValue())
      ) {
        parts.unshift(hardline);
      }

      if (n.consequent.find(node => node.type !== "EmptyStatement")) {
        const cons = path.call(consequentPath => {
          return join(
            hardline,
            consequentPath
              .map((p, i) => {
                if (n.consequent[i].type === "EmptyStatement") {
                  return null;
                }
                const shouldAddLine =
                  i !== n.consequent.length - 1 &&
                  util.isNextLineEmpty(options.originalText, p.getValue());
                return concat([print(p), shouldAddLine ? hardline : ""]);
              })
              .filter(e => e !== null)
          );
        }, "consequent");
        parts.push(
          n.consequent.length === 1 && n.consequent[0].type === "BlockStatement"
            ? concat([" ", cons])
            : indent(concat([hardline, cons]))
        );
      }

      return concat(parts);
    // JSX extensions below.
    case "DebuggerStatement":
      return concat(["debugger", semi]);
    case "JSXAttribute":
      parts.push(path.call(print, "name"));

      if (n.value) {
        let res;
        if (
          (n.value.type === "StringLiteral" || n.value.type === "Literal") &&
          typeof n.value.value === "string"
        ) {
          const value = n.value.extra ? n.value.extra.raw : n.value.raw;
          res =
            '"' +
            value.slice(1, value.length - 1).replace(/"/g, "&quot;") +
            '"';
        } else {
          res = path.call(print, "value");
        }
        parts.push("=", res);
      }

      return concat(parts);
    case "JSXIdentifier":
      return "" + n.name;
    case "JSXNamespacedName":
      return join(":", [
        path.call(print, "namespace"),
        path.call(print, "name")
      ]);
    case "JSXMemberExpression":
      return join(".", [
        path.call(print, "object"),
        path.call(print, "property")
      ]);
    case "JSXSpreadAttribute":
      return concat(["{...", path.call(print, "argument"), "}"]);
    case "JSXExpressionContainer": {
      const parent = path.getParentNode(0);

      const shouldInline =
        n.expression.type === "ArrayExpression" ||
        n.expression.type === "ObjectExpression" ||
        n.expression.type === "ArrowFunctionExpression" ||
        n.expression.type === "CallExpression" ||
        n.expression.type === "FunctionExpression" ||
        n.expression.type === "JSXEmptyExpression" ||
        n.expression.type === "TemplateLiteral" ||
        n.expression.type === "TaggedTemplateExpression" ||
        (parent.type === "JSXElement" &&
          (n.expression.type === "ConditionalExpression" ||
            isBinaryish(n.expression)));

      if (shouldInline) {
        return group(
          concat(["{", path.call(print, "expression"), lineSuffixBoundary, "}"])
        );
      }

      return group(
        concat([
          "{",
          indent(concat([softline, path.call(print, "expression")])),
          softline,
          lineSuffixBoundary,
          "}"
        ])
      );
    }
    case "JSXElement": {
      const elem = printJSXElement(path, options, print);
      return maybeWrapJSXElementInParens(path, elem, options);
    }
    case "JSXOpeningElement": {
      const n = path.getValue();

      // don't break up opening elements with a single long text attribute
      if (
        n.attributes.length === 1 &&
        n.attributes[0].value &&
        (n.attributes[0].value.type === "Literal" ||
          n.attributes[0].value.type === "StringLiteral") &&
        typeof n.attributes[0].value.value === "string"
      ) {
        return group(
          concat([
            "<",
            path.call(print, "name"),
            " ",
            concat(path.map(print, "attributes")),
            n.selfClosing ? " />" : ">"
          ])
        );
      }

      return group(
        concat([
          "<",
          path.call(print, "name"),
          concat([
            indent(
              concat(
                path.map(attr => concat([line, print(attr)]), "attributes")
              )
            ),
            n.selfClosing ? line : options.jsxBracketSameLine ? ">" : softline
          ]),
          n.selfClosing ? "/>" : options.jsxBracketSameLine ? "" : ">"
        ])
      );
    }
    case "JSXClosingElement":
      return concat(["</", path.call(print, "name"), ">"]);
    case "JSXText":
      throw new Error("JSXTest should be handled by JSXElement");
    case "JSXEmptyExpression":
      const requiresHardline = n.comments && n.comments.some(
        comment => comment.type === "Line" || comment.type === "CommentLine"
      );

      return concat([
        comments.printDanglingComments(
          path,
          options,
          /* sameIndent */ !requiresHardline
        ),
        requiresHardline ? hardline : ""
      ]);
    case "TypeAnnotatedIdentifier":
      return concat([
        path.call(print, "annotation"),
        " ",
        path.call(print, "identifier")
      ]);
    case "ClassBody":
      if (!n.comments && n.body.length === 0) {
        return "{}";
      }

      return concat([
        "{",
        n.body.length > 0
          ? indent(
              concat([
                hardline,
                path.call(function(bodyPath) {
                  return printStatementSequence(bodyPath, options, print);
                }, "body")
              ])
            )
          : comments.printDanglingComments(path, options),
        hardline,
        "}"
      ]);
    case "ClassPropertyDefinition":
      parts.push("static ", path.call(print, "definition"));

      if (!namedTypes.MethodDefinition.check(n.definition)) parts.push(semi);

      return concat(parts);
    case "ClassProperty":
      if (n.static) parts.push("static ");

      var key;

      if (n.computed) {
        key = concat(["[", path.call(print, "key"), "]"]);
      } else {
        key = printPropertyKey(path, options, print);

        var variance = getFlowVariance(n, options);

        if (variance) {
          key = concat([variance, key]);
        } else if (n.accessibility === "public") {
          key = concat(["public ", key]);
        } else if (n.accessibility === "protected") {
          key = concat(["protected ", key]);
        } else if (n.accessibility === "private") {
          key = concat(["private ", key]);
        }
      }

      parts.push(key);

      if (n.typeAnnotation) parts.push(": ", path.call(print, "typeAnnotation"));

      if (n.value) parts.push(" = ", path.call(print, "value"));

      parts.push(semi);

      return concat(parts);
    case "ClassDeclaration":
    case "ClassExpression":
    case "TSAbstractClassDeclaration":
      if (isNodeStartingWithDeclare(n, options)) {
        parts.push("declare ");
      }
      parts.push(concat(printClass(path, options, print)));
      return concat(parts);
    case "TemplateElement":
      return join(literalline, n.value.raw.split("\n"));
    case "TemplateLiteral":
      var expressions = path.map(print, "expressions");

      parts.push("\`");

      path.each(function(childPath) {
        var i = childPath.getName();

        parts.push(print(childPath));

        if (i < expressions.length) {
          parts.push(
            "\${",
            removeLines(expressions[i]),
            lineSuffixBoundary,
            "}"
          );
        }
      }, "quasis");

      parts.push("\`");

      return concat(parts);
    // These types are unprintable because they serve as abstract
    // supertypes for other (printable) types.
    case "TaggedTemplateExpression":
      return concat([path.call(print, "tag"), path.call(print, "quasi")]);
    case "Node":
    case "Printable":
    case "SourceLocation":
    case "Position":
    case "Statement":
    case "Function":
    case "Pattern":
    case "Expression":
    case "Declaration":
    case "Specifier":
    case "NamedSpecifier":
    // Supertype of Block and Line.
    case "Comment":
    // Flow
    case "MemberTypeAnnotation": // Flow
    case "Type":
      throw new Error("unprintable type: " + JSON.stringify(n.type));
    // Type Annotations for Facebook Flow, typically stripped out or
    // transformed away before printing.
    case "TypeAnnotation":
      if (n.typeAnnotation) {
        return path.call(print, 'typeAnnotation')
      }

      return "";
    case "TSTupleType":
    case "TupleTypeAnnotation":
      let typesField = n.type === "TSTupleType" ? "elementTypes" : "types";
      return group(
        concat([
          "[",
          indent(
            concat([
              softline,
              printArrayItems(path, options, typesField, print)
            ])
          ),
          ifBreak(shouldPrintComma(options) ? "," : ""),
          comments.printDanglingComments(path, options, /* sameIndent */ true),
          softline,
          "]"
        ])
      );

    case "ExistsTypeAnnotation":
      return "*";
    case "EmptyTypeAnnotation":
      return "empty";
    case "AnyTypeAnnotation":
      return "any";
    case "MixedTypeAnnotation":
      return "mixed";
    case "ArrayTypeAnnotation":
      return concat([path.call(print, "elementType"), "[]"]);
    case "BooleanTypeAnnotation":
      return "boolean";
    case "BooleanLiteralTypeAnnotation":
      return "" + n.value;
    case "DeclareClass":
      return printFlowDeclaration(path, printClass(path, options, print));
    case "DeclareFunction":
      // For TypeScript the DeclareFunction node shares the AST
      // structure with FunctionDeclaration
      if (n.params) {
        return concat([
          "declare ",
          printFunctionDeclaration(path, print, options)
        ]);
      }
      return printFlowDeclaration(path, [
        "function ",
        path.call(print, "id"),
        n.predicate ? " " : "",
        path.call(print, "predicate"),
        semi
      ]);
    case "DeclareModule":
      return printFlowDeclaration(path, [
        "module ",
        path.call(print, "id"),
        " ",
        path.call(print, "body")
      ]);
    case "DeclareModuleExports":
      return printFlowDeclaration(path, [
        "module.exports",
        ": ",
        path.call(print, "typeAnnotation"),
        semi
      ]);
    case "DeclareVariable":
      return printFlowDeclaration(path, ["var ", path.call(print, "id"), semi]);
    case "DeclareExportAllDeclaration":
      return concat(["declare export * from ", path.call(print, "source")]);
    case "DeclareExportDeclaration":
      return concat(["declare ", printExportDeclaration(path, options, print)]);
    case "FunctionTypeAnnotation":
    case "TSFunctionType":
      // FunctionTypeAnnotation is ambiguous:
      // declare function foo(a: B): void; OR
      // var A: (a: B) => void;
      var parent = path.getParentNode(0);
      var parentParent = path.getParentNode(1);
      var isArrowFunctionTypeAnnotation =
        n.type === "TSFunctionType" ||
        !((!getFlowVariance(parent, options) &&
          !parent.optional &&
          namedTypes.ObjectTypeProperty.check(parent)) ||
          namedTypes.ObjectTypeCallProperty.check(parent) ||
          namedTypes.DeclareFunction.check(path.getParentNode(2)));

      var needsColon =
        isArrowFunctionTypeAnnotation &&
        namedTypes.TypeAnnotation.check(parent);

      // Sadly we can't put it inside of FastPath::needsColon because we are
      // printing ":" as part of the expression and it would put parenthesis
      // around :(
      const needsParens =
        needsColon &&
        isArrowFunctionTypeAnnotation &&
        parent.type === "TypeAnnotation" &&
        parentParent.type === "ArrowFunctionExpression";

      if (isObjectTypePropertyAFunction(parent)) {
        isArrowFunctionTypeAnnotation = true;
        needsColon = true;
      }

      if (needsParens) {
        parts.push("(");
      }

      // With TypeScript \`typeParameters\` is an array of \`TSTypeParameter\` and
      // with flow they are one \`TypeParameterDeclaration\` node.
      if (n.type === 'TSFunctionType' && n.typeParameters) {
        parts.push(
          "<",
          join(", ", path.map(print, "typeParameters")),
          ">"
        )
      } else {
        parts.push(path.call(print, "typeParameters"));
      }

      parts.push(printFunctionParams(path, print, options));

      // The returnType is not wrapped in a TypeAnnotation, so the colon
      // needs to be added separately.
      if (n.returnType || n.predicate || n.typeAnnotation) {
        parts.push(
          isArrowFunctionTypeAnnotation ? " => " : ": ",
          path.call(print, "returnType"),
          path.call(print, "predicate"),
          path.call(print, "typeAnnotation")
        );
      }
      if (needsParens) {
        parts.push(")");
      }

      return group(concat(parts));
    case "FunctionTypeParam":
      return concat([
        path.call(print, "name"),
        n.optional ? "?" : "",
        n.name ? ": " : "",
        path.call(print, "typeAnnotation")
      ]);
    case "GenericTypeAnnotation":
      return concat([
        path.call(print, "id"),
        path.call(print, "typeParameters")
      ]);
    case "DeclareInterface":
    case "InterfaceDeclaration": {
      if (
        n.type === "DeclareInterface" ||
        isNodeStartingWithDeclare(n, options)
      ) {
        parts.push("declare ");
      }

      parts.push(
        "interface ",
        path.call(print, "id"),
        path.call(print, "typeParameters")
      );

      if (n["extends"].length > 0) {
        parts.push(
          group(
            indent(
              concat([line, "extends ", join(", ", path.map(print, "extends"))])
            )
          )
        );
      }

      parts.push(" ");
      parts.push(path.call(print, "body"));

      return group(concat(parts));
    }
    case "ClassImplements":
    case "InterfaceExtends":
      return concat([
        path.call(print, "id"),
        path.call(print, "typeParameters")
      ]);
    case "TSIntersectionType":
    case "IntersectionTypeAnnotation": {
      const types = path.map(print, "types");
      const result = [];
      for (let i = 0; i < types.length; ++i) {
        if (i === 0) {
          result.push(types[i]);
        } else if (
          n.types[i - 1].type !== "ObjectTypeAnnotation" &&
          n.types[i].type !== "ObjectTypeAnnotation"
        ) {
          // If no object is involved, go to the next line if it breaks
          result.push(indent(concat([" &", line, types[i]])));
        } else {
          // If you go from object to non-object or vis-versa, then inline it
          result.push(" & ", i > 1 ? indent(types[i]) : types[i]);
        }
      }
      return group(concat(result));
    }
    case "TSUnionType":
    case "UnionTypeAnnotation": {
      // single-line variation
      // A | B | C

      // multi-line variation
      // | A
      // | B
      // | C

      const parent = path.getParentNode();
      // If there's a leading comment, the parent is doing the indentation
      const shouldIndent = !(parent.type === "TypeAlias" &&
        hasLeadingOwnLineComment(options.originalText, n));

      //const token = isIntersection ? "&" : "|";
      const code = concat([
        ifBreak(concat([shouldIndent ? line : "", "| "])),
        join(concat([line, "| "]), path.map(print, "types"))
      ]);

      return group(shouldIndent ? indent(code) : code);
    }
    case "NullableTypeAnnotation":
      return concat(["?", path.call(print, "typeAnnotation")]);
    case "NullLiteralTypeAnnotation":
      return "null";
    case "ThisTypeAnnotation":
      return "this";
    case "NumberTypeAnnotation":
      return "number";
    case "ObjectTypeCallProperty":
      if (n.static) {
        parts.push("static ");
      }

      parts.push(path.call(print, "value"));

      return concat(parts);
    case "ObjectTypeIndexer":
      var variance = getFlowVariance(n, options);
      return concat([
        variance || "",
        "[",
        path.call(print, "id"),
        n.id ? ": " : "",
        path.call(print, "key"),
        "]: ",
        path.call(print, "value")
      ]);
    case "ObjectTypeProperty":
      var variance = getFlowVariance(n, options);
      // TODO: This is a bad hack and we need a better way to know
      // when to emit an arrow function or not.
      var isFunctionNotation = util.locStart(n) === util.locStart(n.value)
      var isGetterOrSetter = n.kind === "get" || n.kind === "set"

      return concat([
        n.static ? "static " : "",
        variance || "",
        path.call(print, "key"),
        n.optional ? "?" : "",
        (isFunctionNotation && !isGetterOrSetter) ? "" : ": ",
        path.call(print, "value")
      ]);
    case "QualifiedTypeIdentifier":
      return concat([
        path.call(print, "qualification"),
        ".",
        path.call(print, "id")
      ]);
    case "StringLiteralTypeAnnotation":
      return nodeStr(n, options);
    case "NumberLiteralTypeAnnotation":
      assert.strictEqual(typeof n.value, "number");

      if (n.extra != null) {
        return printNumber(n.extra.raw);
      } else {
        return printNumber(n.raw);
      }
    case "StringTypeAnnotation":
      return "string";
    case "DeclareTypeAlias":
    case "TypeAlias": {
      if (
        n.type === "DeclareTypeAlias" ||
        isNodeStartingWithDeclare(n, options)
      ) {
        parts.push("declare ");
      }

      const canBreak = (
        n.right.type === "StringLiteralTypeAnnotation"
      );

      const printed = printAssignmentRight(
        n.right,
        path.call(print, "right"),
        canBreak,
        options
      );

      parts.push(
        "type ",
        path.call(print, "id"),
        path.call(print, "typeParameters"),
        " =",
        printed,
        semi
      );

      return group(concat(parts));
    }
    case "TypeCastExpression":
      return concat([
        "(",
        path.call(print, "expression"),
        ": ",
        path.call(print, "typeAnnotation"),
        ")"
      ]);
    case "TypeParameterDeclaration":
    case "TypeParameterInstantiation": {
      const shouldInline =
        n.params.length === 1 &&
        (n.params[0].type === "ObjectTypeAnnotation" ||
          n.params[0].type === "NullableTypeAnnotation");

      if (shouldInline) {
        return concat(["<", join(", ", path.map(print, "params")), ">"]);
      }

      return group(
        concat([
          "<",
          indent(
            concat([
              softline,
              join(concat([",", line]), path.map(print, "params"))
            ])
          ),
          ifBreak(shouldPrintComma(options, "all") ? "," : ""),
          softline,
          ">"
        ])
      );
    }
    case "TypeParameter":
      var variance = getFlowVariance(n, options);

      if (variance) {
        parts.push(variance);
      }

      parts.push(path.call(print, "name"));

      if (n.bound) {
        parts.push(": ");
        parts.push(path.call(print, "bound"));
      }

      if (n.constraint) {
        parts.push(" extends ", path.call(print, "constraint"));
      }

      if (n["default"]) {
        parts.push("=", path.call(print, "default"));
      }

      return concat(parts);
    case "TypeofTypeAnnotation":
      return concat(["typeof ", path.call(print, "argument")]);
    case "VoidTypeAnnotation":
      return "void";
    case "NullTypeAnnotation":
      return "null";
    case "InferredPredicate":
      return "%checks";
    // Unhandled types below. If encountered, nodes of these types should
    // be either left alone or desugared into AST types that are fully
    // supported by the pretty-printer.
    case "DeclaredPredicate":
      return concat(["%checks(", path.call(print, "value"), ")"]);
    case "TSAnyKeyword":
      return "any";
    case "TSBooleanKeyword":
      return "boolean";
    case "TSNumberKeyword":
      return "number";
    case "TSObjectKeyword":
      return "object";
    case "TSStringKeyword":
      return "string";
    case "TSVoidKeyword":
      return "void";
    case "TSAsExpression":
      return concat([
        path.call(print, "expression"),
        " as ",
        path.call(print, "typeAnnotation")
      ]);
    case "TSArrayType":
      return concat([path.call(print, "elementType"), "[]"]);
    case "TSPropertySignature":
      parts.push(path.call(print, "name"));
      parts.push(": ");
      parts.push(path.call(print, "typeAnnotation"));

      return concat(parts);
    case "TSParameterProperty":
      if (n.accessibility) {
        parts.push(n.accessibility + " ");
      }
      if (n.isReadonly) {
        parts.push("readonly ");
      }

      parts.push(path.call(print, "parameter"));

      return concat(parts);
    case "TSTypeReference":
      parts.push(path.call(print, "typeName"))

      if (n.typeArguments) {
        parts.push(
          "<",
          join(", ", path.map(print, "typeArguments")),
          ">"
        )
      }

      return concat(parts);
    case "TSCallSignature":
      return concat([
        "(",
        join(", ", path.map(print, "parameters")),
        "): ",
        path.call(print, "typeAnnotation")
      ]);
    case "TSConstructSignature":
      return concat([
        "new (",
        join(", ", path.map(print, "parameters")),
        "): ",
        path.call(print, "typeAnnotation")
      ]);
    case "TSTypeQuery":
      return concat(["typeof ", path.call(print, "exprName")]);
    case "TSParenthesizedType":
      return concat(["(", path.call(print, "typeAnnotation"), ")"]);
    case "TSIndexSignature":
      return concat([
        "[",
        // This should only contain a single element, however TypeScript parses
        // it using parseDelimitedList that uses commas as delimiter.
        join(", ", path.map(print, "parameters")),
        "]: ",
        path.call(print, "typeAnnotation")
      ]);
    case "TSFirstTypeNode":
      return concat([n.parameterName.name, " is ", path.call(print, "typeAnnotation")])
    case "TSNeverKeyword":
      return "never";
    case "TSUndefinedKeyword":
      return "undefined";
    case "TSSymbolKeyword":
      return "symbol";
    case "TSNonNullExpression":
      return concat([path.call(print, "expression"), "!"]);
    case "TSThisType":
      return "this";
    case "TSLastTypeNode":
      return path.call(print, "literal")
    case "TSIndexedAccessType":
      return concat([
        path.call(print, "objectType"),
        "[",
        path.call(print, "indexType"),
        "]"
      ])
    case "TSConstructorType":
      return concat([
        "new(",
        join(", ", path.map(print, "parameters")),
        ") => ",
        path.call(print, "typeAnnotation"),
      ])
    case "TSTypeOperator":
      return concat([
        "keyof ",
        path.call(print, "typeAnnotation")
      ])
    case "TSMappedType":
      return concat([
        "{",
        options.bracketSpacing ? line : softline,
        "[",
        path.call(print, "typeParameter"),
        "]: ",
        path.call(print, "typeAnnotation"),
        options.bracketSpacing ? line : softline,
        "}"
      ])
    case "TSTypeParameter":
      parts.push(path.call(print, "name"))

      if (n.constraint) {
        parts.push(
          " in ",
          path.call(print, "constraint")
        )
      }

      return concat(parts)
    case "TSMethodSignature":
      return concat([
        path.call(print, 'name'),
        "(",
        join(", ", path.map(print, "parameters")),
        ")"
      ])
    // TODO
    case "ClassHeritage":
    // TODO
    case "ComprehensionBlock":
    // TODO
    case "ComprehensionExpression":
    // TODO
    case "Glob":
    // TODO
    case "GeneratorExpression":
    // TODO
    case "LetStatement":
    // TODO
    case "LetExpression":
    // TODO
    case "GraphExpression":
    // TODO
    // XML types that nobody cares about or needs to print.
    case "GraphIndexExpression":
    case "XMLDefaultDeclaration":
    case "XMLAnyName":
    case "XMLQualifiedIdentifier":
    case "XMLFunctionQualifiedIdentifier":
    case "XMLAttributeSelector":
    case "XMLFilterExpression":
    case "XML":
    case "XMLElement":
    case "XMLList":
    case "XMLEscape":
    case "XMLText":
    case "XMLStartTag":
    case "XMLEndTag":
    case "XMLPointTag":
    case "XMLName":
    case "XMLAttribute":
    case "XMLCdata":
    case "XMLComment":
    case "XMLProcessingInstruction":
    default:
      throw new Error("unknown type: " + JSON.stringify(n.type));
  }
}

function printStatementSequence(path, options, print) {
  let printed = [];

  const bodyNode = path.getNode();
  const isClass = bodyNode.type === "ClassBody";

  path.map((stmtPath, i) => {
    var stmt = stmtPath.getValue();

    // Just in case the AST has been modified to contain falsy
    // "statements," it's safer simply to skip them.
    if (!stmt) {
      return;
    }

    // Skip printing EmptyStatement nodes to avoid leaving stray
    // semicolons lying around.
    if (stmt.type === "EmptyStatement") {
      return;
    }

    const stmtPrinted = print(stmtPath);
    const text = options.originalText;
    const parts = [];

    // in no-semi mode, prepend statement with semicolon if it might break ASI
    if (!options.semi && !isClass && stmtNeedsASIProtection(stmtPath)) {
      if (
        stmt.comments &&
        stmt.comments.some(comment => comment.leading)
      ) {
        // Note: stmtNeedsASIProtection requires stmtPath to already be printed
        // as it reads needsParens which is mutated on the instance
        parts.push(print(stmtPath, { needsSemi: true }));
      } else {
        parts.push(";", stmtPrinted);
      }
    } else {
      parts.push(stmtPrinted);
    }

    if (!options.semi && isClass) {
      if (classPropMayCauseASIProblems(stmtPath)) {
        parts.push(";");
      } else if (stmt.type === "ClassProperty") {
        const nextChild = bodyNode.body[i + 1];
        if (classChildNeedsASIProtection(nextChild)) {
          parts.push(";");
        }
      }
    }

    if (util.isNextLineEmpty(text, stmt) && !isLastStatement(stmtPath)) {
      parts.push(hardline);
    }

    printed.push(concat(parts));
  });

  return join(hardline, printed);
}

function printPropertyKey(path, options, print) {
  const node = path.getNode();
  const key = node.key;

  if (
    (key.type === "StringLiteral" ||
      (key.type === "Literal" && typeof key.value === "string")) &&
    isIdentifierName(key.value) &&
    !node.computed
  ) {
    // 'a' -> a
    return path.call(
      keyPath => comments.printComments(keyPath, () => key.value, options),
      "key"
    );
  }
  return path.call(print, "key");
}

function printMethod(path, options, print) {
  var node = path.getNode();
  var semi = options.semi ? ";" : "";
  var kind = node.kind;
  var parts = [];

  if (node.type === "ObjectMethod" || node.type === "ClassMethod") {
    node.value = node;
  } else {
    namedTypes.FunctionExpression.assert(node.value);
  }

  if (node.value.async) {
    parts.push("async ");
  }

  if (!kind || kind === "init" || kind === "method" || kind === "constructor") {
    if (node.value.generator) {
      parts.push("*");
    }
  } else {
    assert.ok(kind === "get" || kind === "set");

    parts.push(kind, " ");
  }

  var key = printPropertyKey(path, options, print);

  if (node.computed) {
    key = concat(["[", key, "]"]);
  }

  parts.push(
    key,
    path.call(print, "value", "typeParameters"),
    group(
      concat([
        path.call(function(valuePath) {
          return printFunctionParams(valuePath, print, options);
        }, "value"),
        path.call(p => printReturnType(p, print), "value")
      ])
    )
  );

  if (!node.value.body || node.value.body.length === 0) {
    parts.push(semi);
  } else {
    parts.push(" ", path.call(print, "value", "body"));
  }

  return concat(parts);
}

function couldGroupArg(arg) {
  return (
    (arg.type === "ObjectExpression" && arg.properties.length > 0) ||
    (arg.type === "ArrayExpression" && arg.elements.length > 0) ||
    arg.type === "FunctionExpression" ||
    (arg.type === "ArrowFunctionExpression" &&
      (arg.body.type === "BlockStatement" ||
        arg.body.type === "ArrowFunctionExpression" ||
        arg.body.type === "ObjectExpression" ||
        arg.body.type === "ArrayExpression" ||
        arg.body.type === "CallExpression" ||
        arg.body.type === "JSXElement"))
  );
}

function shouldGroupLastArg(args) {
  const lastArg = util.getLast(args);
  const penultimateArg = util.getPenultimate(args);
  return (
    (!lastArg.comments || !lastArg.comments.length) &&
    couldGroupArg(lastArg) &&
    // If the last two arguments are of the same type,
    // disable last element expansion.
    (!penultimateArg || penultimateArg.type !== lastArg.type)
  );
}

function shouldGroupFirstArg(args) {
  if (args.length !== 2) {
    return false;
  }

  const firstArg = args[0];
  const secondArg = args[1];
  return (
    (!firstArg.comments || !firstArg.comments.length) &&
    (firstArg.type === "FunctionExpression" ||
      (firstArg.type === "ArrowFunctionExpression" &&
        firstArg.body.type === "BlockStatement")) &&
    !couldGroupArg(secondArg)
  );
}

function printArgumentsList(path, options, print) {
  var printed = path.map(print, "arguments");

  if (printed.length === 0) {
    return concat([
      "(",
      comments.printDanglingComments(path, options, /* sameIndent */ true),
      ")"
    ]);
  }

  const args = path.getValue().arguments;
  // This is just an optimization; I think we could return the
  // conditional group for all function calls, but it's more expensive
  // so only do it for specific forms.
  const shouldGroupFirst = shouldGroupFirstArg(args);
  const shouldGroupLast = shouldGroupLastArg(args);
  if (shouldGroupFirst || shouldGroupLast) {
    const shouldBreak = shouldGroupFirst
      ? printed.slice(1).some(willBreak)
      : printed.slice(0, -1).some(willBreak);

    // We want to print the last argument with a special flag
    let printedExpanded;
    let i = 0;
    path.each(function(argPath) {
      if (shouldGroupFirst && i === 0) {
        printedExpanded =
          [argPath.call(p => print(p, { expandFirstArg: true }))]
            .concat(printed.slice(1));
      }
      if (shouldGroupLast && i === args.length - 1) {
        printedExpanded = printed
          .slice(0, -1)
          .concat(argPath.call(p => print(p, { expandLastArg: true })));
      }
      i++;
    }, "arguments");

    return concat([
      printed.some(willBreak) ? breakParent : "",
      conditionalGroup(
        [
          concat(["(", join(concat([", "]), printedExpanded), ")"]),
          shouldGroupFirst
            ? concat([
                "(",
                group(printedExpanded[0], { shouldBreak: true }),
                printed.length > 1 ? ", " : "",
                join(concat([",", line]), printed.slice(1)),
                ")"
              ])
            : concat([
                "(",
                join(concat([",", line]), printed.slice(0, -1)),
                printed.length > 1 ? ", " : "",
                group(util.getLast(printedExpanded), {
                  shouldBreak: true
                }),
                ")"
              ]),
          group(
            concat([
              "(",
              indent(concat([line, join(concat([",", line]), printed)])),
              shouldPrintComma(options, "all") ? "," : "",
              line,
              ")"
            ]),
            { shouldBreak: true }
          )
        ],
        { shouldBreak }
      )
    ]);
  }

  return group(
    concat([
      "(",
      indent(concat([softline, join(concat([",", line]), printed)])),
      ifBreak(shouldPrintComma(options, "all") ? "," : ""),
      softline,
      ")"
    ]),
    { shouldBreak: printed.some(willBreak) }
  );
}

function printFunctionParams(path, print, options, expandArg) {
  var fun = path.getValue();
  // namedTypes.Function.assert(fun);
  var paramsField = fun.type === "TSFunctionType" ? "parameters" : "params";
  var printed = path.map(print, paramsField);

  if (fun.defaults) {
    path.each(function(defExprPath) {
      var i = defExprPath.getName();
      var p = printed[i];

      if (p && defExprPath.getValue()) {
        printed[i] = concat([p, " = ", print(defExprPath)]);
      }
    }, "defaults");
  }

  if (fun.rest) {
    printed.push(concat(["...", path.call(print, "rest")]));
  }

  if (printed.length === 0) {
    return concat([
      "(",
      comments.printDanglingComments(path, options, /* sameIndent */ true),
      ")"
    ]);
  }

  const lastParam = util.getLast(fun[paramsField]);

  // If the parent is a call with the first/last argument expansion and this is the
  // params of the first/last argument, we dont want the arguments to break and instead
  // want the whole expression to be on a new line.
  //
  // Good:                 Bad:
  //   verylongcall(         verylongcall((
  //     (a, b) => {           a,
  //     }                     b,
  //   })                    ) => {
  //                         })
  if (expandArg) {
    return group(concat(["(", join(", ", printed.map(removeLines)), ")"]));
  }

  // Single object destructuring should hug
  //
  // function({
  //   a,
  //   b,
  //   c
  // }) {}
  if (
    fun.params &&
    fun.params.length === 1 &&
    !fun.params[0].comments &&
    (fun.params[0].type === "ObjectPattern" ||
      (fun.params[0].type === "FunctionTypeParam" &&
        fun.params[0].typeAnnotation.type === "ObjectTypeAnnotation")) &&
    !fun.rest
  ) {
    return concat(["(", join(", ", printed), ")"]);
  }

  const parent = path.getParentNode();

  const flowTypeAnnotations = [
    "AnyTypeAnnotation",
    "NullLiteralTypeAnnotation",
    "GenericTypeAnnotation",
    "ThisTypeAnnotation",
    "NumberTypeAnnotation",
    "VoidTypeAnnotation",
    "NullTypeAnnotation",
    "EmptyTypeAnnotation",
    "MixedTypeAnnotation",
    "BooleanTypeAnnotation",
    "BooleanLiteralTypeAnnotation",
    "StringTypeAnnotation"
  ];

  const isFlowShorthandWithOneArg =
    (isObjectTypePropertyAFunction(parent) ||
      isTypeAnnotationAFunction(parent) ||
      parent.type === "TypeAlias" ||
      parent.type === "UnionTypeAnnotation" ||
      parent.type === "IntersectionTypeAnnotation" ||
      (parent.type === "FunctionTypeAnnotation" &&
        parent.returnType === fun)) &&
    fun[paramsField].length === 1 &&
    fun[paramsField][0].name === null &&
    fun[paramsField][0].typeAnnotation &&
    flowTypeAnnotations.indexOf(fun[paramsField][0].typeAnnotation.type) !== -1 &&
    !fun.rest;

  const canHaveTrailingComma =
    !isFlowShorthandWithOneArg &&
    !(lastParam && lastParam.type === "RestElement") &&
    !fun.rest;

  return concat([
    isFlowShorthandWithOneArg ? "" : "(",
    indent(concat([softline, join(concat([",", line]), printed)])),
    ifBreak(
      canHaveTrailingComma && shouldPrintComma(options, "all") ? "," : ""
    ),
    softline,
    isFlowShorthandWithOneArg ? "" : ")"
  ]);
}

function canPrintParamsWithoutParens(node) {
  return (
    node.params.length === 1 &&
    !node.rest &&
    node.params[0].type === "Identifier" &&
    !node.params[0].typeAnnotation &&
    !node.params[0].comments &&
    !node.params[0].optional &&
    !node.predicate &&
    !node.returnType
  );
}

function printFunctionDeclaration(path, print, options) {
  var n = path.getValue();
  var parts = [];

  if (n.async) parts.push("async ");

  parts.push("function");

  if (n.generator) parts.push("*");

  if (n.id) {
    parts.push(" ", path.call(print, "id"));
  }

  parts.push(
    path.call(print, "typeParameters"),
    group(
      concat([
        printFunctionParams(path, print, options),
        printReturnType(path, print)
      ])
    ),
    " ",
    path.call(print, "body")
  );

  return concat(parts);
}

function printObjectMethod(path, options, print) {
  var objMethod = path.getValue();
  var parts = [];

  if (objMethod.async) parts.push("async ");

  if (objMethod.generator) parts.push("*");

  if (
    objMethod.method || objMethod.kind === "get" || objMethod.kind === "set"
  ) {
    return printMethod(path, options, print);
  }

  var key = printPropertyKey(path, options, print);

  if (objMethod.computed) {
    parts.push("[", key, "]");
  } else {
    parts.push(key);
  }

  if (objMethod.typeParameters) {
    parts.push(path.call(print, "typeParameters"));
  }

  parts.push(
    group(
      concat([
        printFunctionParams(path, print, options),
        printReturnType(path, print)
      ])
    ),
    " ",
    path.call(print, "body")
  );

  return concat(parts);
}

function printReturnType(path, print) {
  const n = path.getValue();
  const parts = [path.call(print, "returnType")];

  // prepend colon to TypeScript type annotation
  if (n.returnType && n.returnType.typeAnnotation) {
    parts.unshift(": ");
  }

  if (n.predicate) {
    // The return type will already add the colon, but otherwise we
    // need to do it ourselves
    parts.push(n.returnType ? " " : ": ", path.call(print, "predicate"));
  }

  return concat(parts);
}

function printExportDeclaration(path, options, print) {
  const decl = path.getValue();
  const semi = options.semi ? ";" : "";
  let parts = ["export "];

  namedTypes.Declaration.assert(decl);

  if (decl["default"] || decl.type === "ExportDefaultDeclaration") {
    parts.push("default ");
  }

  parts.push(
    comments.printDanglingComments(path, options, /* sameIndent */ true)
  );

  if (decl.declaration) {
    parts.push(path.call(print, "declaration"));

    if (
      decl.type === "ExportDefaultDeclaration" &&
      (decl.declaration.type !== "ClassDeclaration" &&
        decl.declaration.type !== "FunctionDeclaration")
    ) {
      parts.push(semi);
    }
  } else {
    if (decl.specifiers && decl.specifiers.length > 0) {
      if (
        decl.specifiers.length === 1 &&
        decl.specifiers[0].type === "ExportBatchSpecifier"
      ) {
        parts.push("*");
      } else {
        let specifiers = [];
        let defaultSpecifiers = [];
        let namespaceSpecifiers = [];

        path.map(specifierPath => {
          const specifierType = path.getValue().type;
          if (specifierType === "ExportSpecifier") {
            specifiers.push(print(specifierPath));
          } else if (specifierType === "ExportDefaultSpecifier") {
            defaultSpecifiers.push(print(specifierPath));
          } else if (specifierType === "ExportNamespaceSpecifier") {
            namespaceSpecifiers.push(concat(["* as ", print(specifierPath)]));
          }
        }, "specifiers");

        const isNamespaceFollowed =
          namespaceSpecifiers.length !== 0 &&
          (specifiers.length !== 0 || defaultSpecifiers.length !== 0);
        const isDefaultFollowed =
          defaultSpecifiers.length !== 0 && specifiers.length !== 0;

        parts.push(
          decl.exportKind === "type" ? "type " : "",
          concat(namespaceSpecifiers),
          concat([isNamespaceFollowed ? ", " : ""]),
          concat(defaultSpecifiers),
          concat([isDefaultFollowed ? ", " : ""]),
          specifiers.length !== 0
            ? group(
                concat([
                  "{",
                  indent(
                    concat([
                      options.bracketSpacing ? line : softline,
                      join(concat([",", line]), specifiers)
                    ])
                  ),
                  ifBreak(shouldPrintComma(options) ? "," : ""),
                  options.bracketSpacing ? line : softline,
                  "}"
                ])
              )
            : ""
        );
      }
    } else {
      parts.push("{}");
    }

    if (decl.source) {
      parts.push(" from ", path.call(print, "source"));
    }

    parts.push(semi);
  }

  return concat(parts);
}

function printFlowDeclaration(path, parts) {
  var parentExportDecl = util.getParentExportDeclaration(path);

  if (parentExportDecl) {
    assert.strictEqual(parentExportDecl.type, "DeclareExportDeclaration");
  } else {
    // If the parent node has type DeclareExportDeclaration, then it
    // will be responsible for printing the "declare" token. Otherwise
    // it needs to be printed with this non-exported declaration node.
    parts.unshift("declare ");
  }

  return concat(parts);
}

function getFlowVariance(path) {
  if (!path.variance) {
    return null;
  }

  // Babylon 7.0 currently uses variance node type, and flow should
  // follow suit soon:
  // https://github.com/babel/babel/issues/4722
  const variance = path.variance.kind || path.variance;

  switch (variance) {
    case "plus":
      return "+";

    case "minus":
      return "-";

    default:
      return variance;
  }
}

function printClass(path, options, print) {
  const n = path.getValue();
  const parts = [];

  if (n.accessibility) {
    parts.push(n.accessibility + " ");
  }
  if (n.type === "TSAbstractClassDeclaration") {
    parts.push("abstract ");
  }

  parts.push("class");

  if (n.id) {
    parts.push(" ", path.call(print, "id"), path.call(print, "typeParameters"));
  }

  const partsGroup = [];
  if (n.superClass) {
    partsGroup.push(
      line,
      "extends ",
      path.call(print, "superClass"),
      path.call(print, "superTypeParameters")
    );
  } else if (n.extends && n.extends.length > 0) {
    partsGroup.push(line, "extends ", join(", ", path.map(print, "extends")));
  }

  if (n["implements"] && n["implements"].length > 0) {
    partsGroup.push(
      line,
      "implements ",
      join(", ", path.map(print, "implements"))
    );
  }

  if (partsGroup.length > 0) {
    parts.push(group(indent(concat(partsGroup))));
  }

  parts.push(" ", path.call(print, "body"));

  return parts;
}

function printMemberLookup(path, options, print) {
  const property = path.call(print, "property");
  const n = path.getValue();

  return concat(
    n.computed
      ? [
          "[",
          group(concat([indent(concat([softline, property])), softline])),
          "]"
        ]
      : [".", property]
  );
}

// We detect calls on member expressions specially to format a
// comman pattern better. The pattern we are looking for is this:
//
// arr
//   .map(x => x + 1)
//   .filter(x => x > 10)
//   .some(x => x % 2)
//
// The way it is structured in the AST is via a nested sequence of
// MemberExpression and CallExpression. We need to traverse the AST
// and make groups out of it to print it in the desired way.
function printMemberChain(path, options, print) {
  // The first phase is to linearize the AST by traversing it down.
  //
  //   a().b()
  // has the following AST structure:
  //   CallExpression(MemberExpression(CallExpression(Identifier)))
  // and we transform it into
  //   [Identifier, CallExpression, MemberExpression, CallExpression]
  const printedNodes = [];

  function rec(path) {
    const node = path.getValue();
    if (node.type === "CallExpression") {
      printedNodes.unshift({
        node: node,
        printed: comments.printComments(
          path,
          () => printArgumentsList(path, options, print),
          options
        )
      });
      path.call(callee => rec(callee), "callee");
    } else if (node.type === "MemberExpression") {
      printedNodes.unshift({
        node: node,
        printed: comments.printComments(
          path,
          () => printMemberLookup(path, options, print),
          options
        )
      });
      path.call(object => rec(object), "object");
    } else {
      printedNodes.unshift({
        node: node,
        printed: path.call(print)
      });
    }
  }
  // Note: the comments of the root node have already been printed, so we
  // need to extract this first call without printing them as they would
  // if handled inside of the recursive call.
  printedNodes.unshift({
    node: path.getValue(),
    printed: printArgumentsList(path, options, print)
  });
  path.call(callee => rec(callee), "callee");

  // Once we have a linear list of printed nodes, we want to create groups out
  // of it.
  //
  //   a().b.c().d().e
  // will be grouped as
  //   [
  //     [Identifier, CallExpression],
  //     [MemberExpression, MemberExpression, CallExpression],
  //     [MemberExpression, CallExpression],
  //     [MemberExpression],
  //   ]
  // so that we can print it as
  //   a()
  //     .b.c()
  //     .d()
  //     .e

  // The first group is the first node followed by
  //   - as many CallExpression as possible
  //       < fn()()() >.something()
  //   - then, as many MemberExpression as possible but the last one
  //       < this.items >.something()
  var groups = [];
  var currentGroup = [printedNodes[0]];
  var i = 1;
  for (; i < printedNodes.length; ++i) {
    if (printedNodes[i].node.type === "CallExpression") {
      currentGroup.push(printedNodes[i]);
    } else {
      break;
    }
  }
  for (; i + 1 < printedNodes.length; ++i) {
    if (
      printedNodes[i].node.type === "MemberExpression" &&
      printedNodes[i + 1].node.type === "MemberExpression"
    ) {
      currentGroup.push(printedNodes[i]);
    } else {
      break;
    }
  }
  groups.push(currentGroup);
  currentGroup = [];

  // Then, each following group is a sequence of MemberExpression followed by
  // a sequence of CallExpression. To compute it, we keep adding things to the
  // group until we has seen a CallExpression in the past and reach a
  // MemberExpression
  var hasSeenCallExpression = false;
  for (; i < printedNodes.length; ++i) {
    if (
      hasSeenCallExpression && printedNodes[i].node.type === "MemberExpression"
    ) {
      // [0] should be appended at the end of the group instead of the
      // beginning of the next one
      if (printedNodes[i].node.computed) {
        currentGroup.push(printedNodes[i]);
        continue;
      }

      groups.push(currentGroup);
      currentGroup = [];
      hasSeenCallExpression = false;
    }

    if (printedNodes[i].node.type === "CallExpression") {
      hasSeenCallExpression = true;
    }
    currentGroup.push(printedNodes[i]);
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  // There are cases like Object.keys(), Observable.of(), _.values() where
  // they are the subject of all the chained calls and therefore should
  // be kept on the same line:
  //
  //   Object.keys(items)
  //     .filter(x => x)
  //     .map(x => x)
  //
  // In order to detect those cases, we use an heuristic: if the first
  // node is just an identifier with the name starting with a capital
  // letter, just a sequence of _$ or this. The rationale is that they are
  // likely to be factories.
  const shouldMerge =
    groups.length >= 2 &&
    !groups[1][0].node.comments &&
    groups[0].length === 1 &&
    (groups[0][0].node.type === "ThisExpression" ||
      (groups[0][0].node.type === "Identifier" &&
        groups[0][0].node.name.match(/(^[A-Z])|^[_$]+$/)));

  function printGroup(printedGroup) {
    return concat(printedGroup.map(tuple => tuple.printed));
  }

  function printIndentedGroup(groups) {
    return indent(
      group(concat([hardline, join(hardline, groups.map(printGroup))]))
    );
  }

  const printedGroups = groups.map(printGroup);
  const oneLine = concat(printedGroups);
  const hasComment =
    (groups.length >= 2 && groups[1][0].node.comments) ||
    (groups.length >= 3 && groups[2][0].node.comments);

  // If we only have a single \`.\`, we shouldn't do anything fancy and just
  // render everything concatenated together.
  if (
    groups.length <= (shouldMerge ? 3 : 2) &&
    !hasComment &&
    // (a || b).map() should be break before .map() instead of ||
    groups[0][0].node.type !== "LogicalExpression"
  ) {
    return group(oneLine);
  }

  const expanded = concat([
    printGroup(groups[0]),
    shouldMerge ? concat(groups.slice(1, 2).map(printGroup)) : "",
    printIndentedGroup(groups.slice(shouldMerge ? 2 : 1))
  ]);

  // If there's a comment, we don't want to print in one line.
  if (hasComment) {
    return group(expanded);
  }

  // If any group but the last one has a hard line, we want to force expand
  // it. If the last group is a function it's okay to inline if it fits.
  if (printedGroups.slice(0, -1).some(willBreak)) {
    return group(expanded);
  }

  return concat([
    // We only need to check \`oneLine\` because if \`expanded\` is chosen
    // that means that the parent group has already been broken
    // naturally
    willBreak(oneLine) ? breakParent : "",
    conditionalGroup([oneLine, expanded])
  ]);
}

function isEmptyJSXElement(node) {
  if (node.children.length === 0) return true;
  if (node.children.length > 1) return false;

  // if there is one child but it's just a newline, treat as empty
  const value = node.children[0].value;
  if (!/\S/.test(value) && /\n/.test(value)) {
    return true;
  } else {
    return false;
  }
}

// JSX Children are strange, mostly for two reasons:
// 1. JSX reads newlines into string values, instead of skipping them like JS
// 2. up to one whitespace between elements within a line is significant,
//    but not between lines.
//
// So for one thing, '\n' needs to be parsed out of string literals
// and turned into hardlines (with string boundaries otherwise using softline)
//
// For another, leading, trailing, and lone whitespace all need to
// turn themselves into the rather ugly \`{' '}\` when breaking.
function printJSXChildren(path, options, print, jsxWhitespace) {
  const n = path.getValue();
  const children = [];

  // using \`map\` instead of \`each\` because it provides \`i\`
  path.map(function(childPath, i) {
    const child = childPath.getValue();
    const isLiteral = namedTypes.Literal.check(child);

    if (isLiteral && typeof child.value === "string") {
      // There's a bug in the flow parser where it doesn't unescape the
      // value field. To workaround this, we can use rawValue which is
      // correctly escaped (since it parsed).
      // We really want to use value and re-escape it ourself when possible
      // though.
      const partiallyEscapedValue = options.parser === "flow"
        ? child.raw
        : util.htmlEscapeInsideAngleBracket(child.value);
      const value = partiallyEscapedValue.replace(/\u00a0/g, "&nbsp;");

      if (/\S/.test(value)) {
        // treat each line of text as its own entity
        value.split(/(\r?\n\s*)/).forEach(line => {
          const newlines = line.match(/\n/g);
          if (newlines) {
            children.push(hardline);

            // allow one extra newline
            if (newlines.length > 1) {
              children.push(hardline);
            }
            return;
          }

          const beginSpace = /^\s+/.test(line);
          if (beginSpace) {
            children.push(jsxWhitespace);
            children.push(softline);
          }

          const stripped = line.replace(/^\s+|\s+$/g, "");
          if (stripped) {
            children.push(stripped);
          }

          const endSpace = /\s+$/.test(line);
          if (endSpace) {
            children.push(softline);
            children.push(jsxWhitespace);
          }
        });

        if (!isLineNext(util.getLast(children))) {
          children.push(softline);
        }
      } else if (/\n/.test(value)) {
        children.push(hardline);

        // allow one extra newline
        if (value.match(/\n/g).length > 1) {
          children.push(hardline);
        }
      } else if (/\s/.test(value)) {
        // whitespace-only without newlines,
        // eg; a single space separating two elements
        children.push(jsxWhitespace);
        children.push(softline);
      }
    } else {
      children.push(print(childPath));

      // add a line unless it's followed by a JSX newline
      let next = n.children[i + 1];
      if (!(next && /^\s*\n/.test(next.value))) {
        children.push(softline);
      }
    }
  }, "children");

  return children;
}

// JSX expands children from the inside-out, instead of the outside-in.
// This is both to break children before attributes,
// and to ensure that when children break, their parents do as well.
//
// Any element that is written without any newlines and fits on a single line
// is left that way.
// Not only that, any user-written-line containing multiple JSX siblings
// should also be kept on one line if possible,
// so each user-written-line is wrapped in its own group.
//
// Elements that contain newlines or don't fit on a single line (recursively)
// are fully-split, using hardline and shouldBreak: true.
//
// To support that case properly, all leading and trailing spaces
// are stripped from the list of children, and replaced with a single hardline.
function printJSXElement(path, options, print) {
  const n = path.getValue();

  // Turn <div></div> into <div />
  if (isEmptyJSXElement(n)) {
    n.openingElement.selfClosing = true;
    delete n.closingElement;
  }

  const openingLines = path.call(print, "openingElement");
  const closingLines = path.call(print, "closingElement");

  if (
    n.children.length === 1 &&
    n.children[0].type === "JSXExpressionContainer" &&
    (n.children[0].expression.type === "TemplateLiteral" ||
      n.children[0].expression.type === "TaggedTemplateExpression")
  ) {
    return concat([
      openingLines,
      concat(path.map(print, "children")),
      closingLines
    ]);
  }

  // If no children, just print the opening element
  if (n.openingElement.selfClosing) {
    assert.ok(!n.closingElement);
    return openingLines;
  }
  // Record any breaks. Should never go from true to false, only false to true.
  let forcedBreak = willBreak(openingLines);

  const jsxWhitespace = options.singleQuote
    ? ifBreak("{' '}", " ")
    : ifBreak('{" "}', " ");
  const children = printJSXChildren(path, options, print, jsxWhitespace);

  // Trim trailing lines, recording if there was a hardline
  let numTrailingHard = 0;
  while (children.length && isLineNext(util.getLast(children))) {
    if (willBreak(util.getLast(children))) {
      ++numTrailingHard;
      forcedBreak = true;
    }
    children.pop();
  }
  // allow one extra newline
  if (numTrailingHard > 1) {
    children.push(hardline);
  }

  // Trim leading lines, recording if there was a hardline
  let numLeadingHard = 0;
  while (children.length && isLineNext(children[0])) {
    if (willBreak(children[0])) {
      ++numLeadingHard;
      forcedBreak = true;
    }
    children.shift();
  }
  // allow one extra newline
  if (numLeadingHard > 1) {
    children.unshift(hardline);
  }

  // Group by line, recording if there was a hardline.
  let groups = [[]]; // Initialize the first line's group
  children.forEach((child, i) => {
    // leading and trailing JSX whitespace don't go into a group
    if (child === jsxWhitespace) {
      if (i === 0) {
        groups.unshift(child);
        return;
      } else if (i === children.length - 1) {
        groups.push(child);
        return;
      }
    }

    let prev = children[i - 1];
    if (prev && willBreak(prev)) {
      forcedBreak = true;

      // On a new line, so create a new group and put this element in it.
      groups.push([child]);
    } else {
      // Not on a newline, so add this element to the current group.
      util.getLast(groups).push(child);
    }

    // Ensure we record hardline of last element.
    if (!forcedBreak && i === children.length - 1) {
      if (willBreak(child)) forcedBreak = true;
    }
  });

  const childrenGroupedByLine = [
    hardline,
    // Conditional groups suppress break propagation; we want to output
    // hard lines without breaking up the entire jsx element.
    // Note that leading and trailing JSX Whitespace don't go into a group.
    concat(
      groups.map(
        contents =>
          (Array.isArray(contents)
            ? conditionalGroup([concat(contents)])
            : contents)
      )
    )
  ];

  const multiLineElem = group(
    concat([
      openingLines,
      indent(group(concat(childrenGroupedByLine), { shouldBreak: true })),
      hardline,
      closingLines
    ])
  );

  if (forcedBreak) {
    return multiLineElem;
  }

  return conditionalGroup([
    group(concat([openingLines, concat(children), closingLines])),
    multiLineElem
  ]);
}

function maybeWrapJSXElementInParens(path, elem) {
  const parent = path.getParentNode();
  if (!parent) return elem;

  const NO_WRAP_PARENTS = {
    ArrayExpression: true,
    JSXElement: true,
    JSXExpressionContainer: true,
    ExpressionStatement: true,
    CallExpression: true,
    ConditionalExpression: true,
    LogicalExpression: true
  };
  if (NO_WRAP_PARENTS[parent.type]) {
    return elem;
  }

  return group(
    concat([
      ifBreak("("),
      indent(concat([softline, elem])),
      softline,
      ifBreak(")")
    ])
  );
}

function isBinaryish(node) {
  return node.type === "BinaryExpression" || node.type === "LogicalExpression";
}

function shouldInlineLogicalExpression(node) {
  return (
    node.type === "LogicalExpression" &&
    (node.right.type === "ObjectExpression" ||
      node.right.type === "ArrayExpression")
  );
}

function printBinaryishExpressions(path, print, options, isNested, isInsideParenthesis) {
  let parts = [];
  let node = path.getValue();

  // We treat BinaryExpression and LogicalExpression nodes the same.
  if (isBinaryish(node)) {

    if (
      util.getPrecedence(node.left.operator) ===
        util.getPrecedence(node.operator) && node.operator !== "**"
    ) {
      // Flatten them out by recursively calling this function.
      parts = parts.concat(
        path.call(
          left =>
            printBinaryishExpressions(
              left,
              print,
              options,
              /* isNested */ true,
              isInsideParenthesis
            ),
          "left"
        )
      );
    } else {
      parts.push(path.call(print, "left"));
    }

    const right = concat([
      node.operator,
      shouldInlineLogicalExpression(node) ? " " : line,
      path.call(print, "right")
    ]);

    // If there's only a single binary expression, we want to create a group
    // in order to avoid having a small right part like -1 be on its own line.
    const parent = path.getParentNode();
    const shouldGroup =
      !(isInsideParenthesis && node.type === "LogicalExpression") &&
      parent.type !== node.type &&
      node.left.type !== node.type &&
      node.right.type !== node.type;

    parts.push(" ", shouldGroup ? group(right) : right);

    // The root comments are already printed, but we need to manually print
    // the other ones since we don't call the normal print on BinaryExpression,
    // only for the left and right parts
    if (isNested && node.comments) {
      parts = comments.printComments(path, () => concat(parts), options);
    }
  } else {
    // Our stopping case. Simply print the node normally.
    parts.push(path.call(print));
  }

  return parts;
}

function printAssignmentRight(rightNode, printedRight, canBreak, options) {
  if (hasLeadingOwnLineComment(options.originalText, rightNode)) {
    return indent(concat([hardline, printedRight]));
  }

  if (canBreak) {
    return indent(concat([line, printedRight]));
  }

  return concat([" ", printedRight]);
}

function printAssignment(
  leftNode,
  printedLeft,
  operator,
  rightNode,
  printedRight,
  options
) {
  if (!rightNode) {
    return printedLeft;
  }

  const canBreak = (
    (isBinaryish(rightNode) && !shouldInlineLogicalExpression(rightNode)) ||
    (leftNode.type === "Identifier" || leftNode.type === "MemberExpression") &&
      (rightNode.type === "StringLiteral" ||
        (rightNode.type === "Literal" && typeof rightNode.value === "string") ||
        isMemberExpressionChain(rightNode))
  );

  const printed = printAssignmentRight(
    rightNode,
    printedRight,
    canBreak,
    options
  );

  return group(concat([printedLeft, " ", operator, printed]));
}

function adjustClause(node, clause, forceSpace) {
  if (node.type === "EmptyStatement") {
    return ";";
  }

  if (node.type === "BlockStatement" || forceSpace) {
    return concat([" ", clause]);
  }

  return indent(concat([line, clause]));
}

function nodeStr(node, options) {
  const str = node.value;
  isString.assert(str);

  const raw = node.extra ? node.extra.raw : node.raw;

  const rawContent = raw.slice(1, -1);

  const double = { quote: '"', regex: /"/g };
  const single = { quote: "'", regex: /'/g };

  const preferred = options.singleQuote ? single : double;
  const alternate = preferred === single ? double : single;

  let shouldUseAlternateQuote = false;

  if (rawContent.includes(preferred.quote)) {
    const numPreferredQuotes = (rawContent.match(preferred.regex) || []).length;
    const numAlternateQuotes = (rawContent.match(alternate.regex) || []).length;

    shouldUseAlternateQuote = numPreferredQuotes > numAlternateQuotes;
  }

  const enclosingQuote = shouldUseAlternateQuote
    ? alternate.quote
    : preferred.quote;

  return makeString(rawContent, enclosingQuote);
}

function makeString(rawContent, enclosingQuote) {
  const otherQuote = enclosingQuote === '"' ? "'" : '"';

  // Matches _any_ escape and unescaped quotes (both single and double).
  const regex = /\\([\s\S])|(['"])/g;

    if (escaped === otherQuote) {
      return escaped;
    }

    // If we matched an unescaped quote and it is of the _same_ type as we
    // intend to enclose the string with, it must be escaped, so return it with
    // a backslash.
    if (quote === enclosingQuote) {
      return "\\" + quote;
    }

    // Otherwise return the escape or unescaped quote as-is.
    return match;
  });

  return enclosingQuote + newContent + enclosingQuote;
}

function printRegex(node) {
  const flags = node.flags.split('').sort().join('');
  return \`/\${node.pattern}/\${flags}\`;
}

function printNumber(rawNumber) {
  return (
    rawNumber
      .toLowerCase()
      // Remove unnecessary plus and zeroes from scientific notation.
      .replace(/^([\d.]+e)(?:\+|(-))?0*(\d)/, "$1$2$3")
      // Remove unnecessary scientific notation (1e0).
      .replace(/^([\d.]+)e[+-]?0+$/, "$1")
      // Make sure numbers always start with a digit.
      .replace(/^\./, "0.")
      // Remove trailing dot.
      .replace(/\.(?=e|$)/, "")
  );
}

function isLastStatement(path) {
  const parent = path.getParentNode();
  const node = path.getValue();
  const body = parent.body.filter(stmt => stmt.type !== "EmptyStatement");
  return body && body[body.length - 1] === node;
}

function hasLeadingOwnLineComment(text, node) {
  const res =
    node.comments &&
    node.comments.some(
      comment => comment.leading && util.hasNewline(text, util.locEnd(comment))
    );
  return res;
}

function hasNakedLeftSide(node) {
  return (
    node.type === "AssignmentExpression" ||
    node.type === "BinaryExpression" ||
    node.type === "LogicalExpression" ||
    node.type === "ConditionalExpression" ||
    node.type === "CallExpression" ||
    node.type === "MemberExpression" ||
    node.type === "SequenceExpression" ||
    node.type === "TaggedTemplateExpression" ||
    (node.type === "UpdateExpression" && !node.prefix)
  );
}

function getLeftSide(node) {
  if (node.expressions) {
    return node.expressions[0];
  }
  return node.left || node.test || node.callee || node.object || node.tag || node.argument;
}

function exprNeedsASIProtection(node) {
  const maybeASIProblem =
    node.needsParens ||
    node.type === "ParenthesizedExpression" ||
    node.type === "TypeCastExpression" ||
    (node.type === "ArrowFunctionExpression" &&
      !canPrintParamsWithoutParens(node)) ||
    node.type === "ArrayExpression" ||
    node.type === "ArrayPattern" ||
    (node.type === "UnaryExpression" &&
      node.prefix &&
      (node.operator === "+" || node.operator === "-")) ||
    node.type === "TemplateLiteral" ||
    node.type === "TemplateElement" ||
    node.type === "JSXElement" ||
    node.type === "BindExpression" ||
    node.type === "RegExpLiteral" ||
    (node.type === "Literal" && node.pattern) ||
    (node.type === "Literal" && node.regex);

  if (maybeASIProblem) {
    return true;
  }

  if (!hasNakedLeftSide(node)) {
    return false;
  }

  return exprNeedsASIProtection(getLeftSide(node));
}

function stmtNeedsASIProtection(path) {
  if (!path) return false;
  const node = path.getNode();

  if (node.type !== "ExpressionStatement") {
    return false;
  }

  return exprNeedsASIProtection(node.expression);
}

function classPropMayCauseASIProblems(path) {
  const node = path.getNode();

  if (node.type !== "ClassProperty") {
    return false;
  }

  const name = node.key && node.key.name;
  if (!name) {
    return false;
  }

  // this isn't actually possible yet with most parsers available today
  // so isn't properly tested yet.
  if (name === "static" || name === "get" || name === "set") {
    return true;
  }
}

function classChildNeedsASIProtection(node) {
  if (!node) return;

  switch (node.type) {
    case "ClassProperty":
      return node.computed;
    // flow
    case "MethodDefinition":
    // typescript
    case "TSAbstractMethodDefinition":
    // babylon
    case "ClassMethod": {
      const isAsync = node.value ? node.value.async : node.async;
      const isGenerator = node.value ? node.value.generator : node.generator;
      if (
        isAsync || node.static || node.kind === "get" || node.kind === "set"
      ) {
        return false;
      }
      if (node.computed || isGenerator) {
        return true;
      }
    }

    default:
      return false;
  }
}

// This recurses the return argument, looking for the first token
// (the leftmost leaf node) and, if it (or its parents) has any
// leadingComments, returns true (so it can be wrapped in parens).
function returnArgumentHasLeadingComment(options, argument) {
  if (hasLeadingOwnLineComment(options.originalText, argument)) {
    return true;
  }

  if (hasNakedLeftSide(argument)) {
    let leftMost = argument;
    let newLeftMost;
    while ((newLeftMost = getLeftSide(leftMost))) {
      leftMost = newLeftMost;

      if (hasLeadingOwnLineComment(options.originalText, leftMost)) {
        return true;
      }
    }
  }

  return false;
}

function isMemberExpressionChain(node) {
  if (node.type !== "MemberExpression") {
    return false;
  }
  if (node.object.type === "Identifier") {
    return true;
  }
  return isMemberExpressionChain(node.object);
}

// Hack to differentiate between the following two which have the same ast
// type T = { method: () => void };
// type T = { method(): void };
function isObjectTypePropertyAFunction(node) {
  return (
    node.type === "ObjectTypeProperty" &&
    node.value.type === "FunctionTypeAnnotation" &&
    !node.static &&
    util.locStart(node.key) !== util.locStart(node.value)
  );
}

// Hack to differentiate between the following two which have the same ast
// declare function f(a): void;
// var f: (a) => void;
function isTypeAnnotationAFunction(node) {
  return (
    node.type === "TypeAnnotation" &&
    node.typeAnnotation.type === "FunctionTypeAnnotation" &&
    !node.static &&
    util.locStart(node) !== util.locStart(node.typeAnnotation)
  );
}

function isNodeStartingWithDeclare(node, options) {
  if (!(options.parser === "flow" || options.parser === "typescript")) {
    return false;
  }
  return (
    options.originalText.slice(0, util.locStart(node)).match(/declare\s*$/) ||
    options.originalText
      .slice(node.range[0], node.range[1])
      .startsWith("declare ")
  );
}

function printArrayItems(path, options, printPath, print) {
  const printedElements = [];
  let separatorParts = [];

  path.each(function(childPath) {
    printedElements.push(concat(separatorParts));
    printedElements.push(group(print(childPath)));

    separatorParts = [",", line];
    if (
      childPath.getValue() &&
      util.isNextLineEmpty(options.originalText, childPath.getValue())
    ) {
      separatorParts.push(softline);
    }
  }, printPath);

  return concat(printedElements);
}

function removeLines(doc) {
  // Force this doc into flat mode by statically converting all
  // lines into spaces (or soft lines into nothing). Hard lines
  // should still output because there's too great of a chance
  // of breaking existing assumptions otherwise.
  return docUtils.mapDoc(doc, d => {
    if (d.type === "line" && !d.hard) {
      return d.soft ? "" : " ";
    } else if (d.type === "if-break") {
      return d.flatContents || "";
    }
    return d;
  });
}

function printAstToDoc(ast, options) {
  function printGenerically(path, args) {
    return comments.printComments(
      path,
      p => genericPrint(p, options, printGenerically, args),
      options,
      args && args.needsSemi
    );
  }

  const doc = printGenerically(FastPath.from(ast));
  docUtils.propagateBreaks(doc);
  return doc;
}

module.exports = { printAstToDoc };
`;

export const FULL_CODE_EXAMPLE_4 = `

import {IMarshaller} from "@wessberg/marshaller";
import {BindingIdentifier, IArbitraryObject, IClassDeclaration, IModuleDependency, InitializationValue, ISimpleLanguageService, NullableInitializationValue} from "@wessberg/simplelanguageservice";
import {ITypeDetector} from "@wessberg/typedetector";
import {ClassElement, ClassLikeDeclaration, NodeArray, Statement, VariableDeclaration} from "typescript";
import {IFoveaConfig} from "../../Static/Interface/IFoveaConfig";
import {setOnHost} from "../Decorator/setOnHost";
import {IFileLoader} from "../FileLoader/Interface/IFileLoader";
import {IFileSaver} from "../FileSaver/Interface/IFileSaver";
import {IResolvedComputedSubstitution, IResolvedStateSnapshot, IResolvedSubstitution, IStateSnapshot, IStateSnapshotter, ResolvedSubstitutionMap, SnapshotIndexer, SubstitutionIndexer} from "./Interface/IStateSnapshotter";

const myVar = () => {

	for await (const test of something) {
		doStuff();
	}

	for (const otherTest in otherSomething) {
		doOtherStuff();
	}
}

export class StateSnapshotter implements IStateSnapshotter {
	public snapshots: SnapshotIndexer = {};
	// A map between filepaths and maps of substitutions
	private resolvedSubstitutions: Map<string, IResolvedSubstitution> = new Map();

	// A map between identifiers and computed values.
	private computedSubstitutions: Map<string, IResolvedComputedSubstitution> = new Map();
	private classes: Map<string, IClassDeclaration> = new Map();
	private isBuilt: boolean = false;
	private static readonly orderedExtensions: string[] = ["ts", "js"];
	private static readonly blacklistedFilepaths: RegExp[] = [
		/node_modules\/tslib\/tslib\.[^.]*\.(js|ts)/,
		/typescript-helpers/,
		/rollup-plugin-/
	];

	constructor (private options: IFoveaConfig,
							 private typeDetector: ITypeDetector,
							 private fileLoader: IFileLoader,
							 private fileSaver: IFileSaver,
							 private host: ISimpleLanguageService,
							 private marshaller: IMarshaller) {
	}

	private hasExtension (path: string): boolean {
		return StateSnapshotter.orderedExtensions.some(ext => path.endsWith(\`.\${ext}\`));
	}

	private getScriptVersionWithHeuristics (path: string): [number, string] {

		const version = parseInt(this.host.getScriptVersion(path));
		if (version >= 0) return [version, path];

		for (const extension of StateSnapshotter.orderedExtensions) {
			const pathWithExtension = \`\${path}.\${extension}\`;
			const versionWithExtension = parseInt(this.host.getScriptVersion(pathWithExtension));
			if (versionWithExtension >= 0) return [versionWithExtension, pathWithExtension];
		}
		return [-1, this.hasExtension(path) ? path : \`\${path}.\${StateSnapshotter.orderedExtensions[0]}\`];
	}

	public storeStateSnapshot (filepath: string, updateVersion: boolean = false): IStateSnapshot | null {
		if (filepath == null || StateSnapshotter.blacklistedFilepaths.some(path => path.test(filepath))) return null;
		let normalizedPath = filepath;

		try {
			const [existingVersion, path] = this.getScriptVersionWithHeuristics(filepath);

			if (existingVersion === -1 || updateVersion) {
				const source = this.fileLoader.loadWithAutoPrioritizedExtensionSync(path, StateSnapshotter.orderedExtensions);
				if (source == null) return null;
				const [buffer, resolvedPath] = source;
				normalizedPath = resolvedPath;
				if (this.snapshots[normalizedPath] == null) this.snapshots[normalizedPath] = {
					filepath: normalizedPath,
					classes: new Set<string>(),
					substitutions: {},
					dependencies: []
				};
				const resolvedMap = this.resolvedSubstitutions.get(normalizedPath);
				if (resolvedMap != null) resolvedMap.needsUpdate = true;

				const stringified = buffer.toString();
				const statements = this.host.addFile(normalizedPath, stringified, existingVersion + 1);

				this.recurse(statements, normalizedPath, undefined, stringified);

				if (existingVersion >= 0 && this.isBuilt) this.checkForDerivedClassesAndForceReevaluation(this.getStateSnapshot(normalizedPath)[0]);
			}
		} catch (e) {
			console.error(\`Substitutions could not be extracted for file: \${normalizedPath}:\`);
			if (this.options.debug) console.error(e.stack);
		}

		return this.getStateSnapshot(normalizedPath)[0];
	}

	/**
	 * Set the 'isBuilt' property once so that we know the difference between
	 * the first build-step and procedural file-changes.
	 * @returns {Promise<void>}
	 */
	public async onBuilt (): Promise<void> {
		this.isBuilt = true;
	}

	public classHasUpgradeableMethods (classDeclaration: IClassDeclaration): boolean {
		return Object.keys(classDeclaration.methods).some(method => method === this.options.naming.markupMethodName || method === this.options.naming.stylesMethodName);
	}

	public classHasUpgradeableProps (classDeclaration: IClassDeclaration): boolean {
		return Object.keys(classDeclaration.props).some(key => classDeclaration.props[key].includes(setOnHost.name));
	}

	public classHasUpgradeableMethodsOrProps (classDeclaration: IClassDeclaration): boolean {
		return this.classHasUpgradeableMethods(classDeclaration) || this.classHasUpgradeableProps(classDeclaration);
	}

	/**
	 * This method makes working with file watchers play nice with Fovea.
	 * Due to the complex inheritance, we need to recompile child classes when the base class changes.
	 * Thus, we simply read and write the same file contents to disk to force the file watcher to recompile.
	 * @param {IStateSnapshot} snapshot
	 * @returns {void}
	 */
	private checkForDerivedClassesAndForceReevaluation (snapshot: IStateSnapshot): void {
		// Use a timeout since the children will be assigned a few ticks after the class has been snapshotted.
		setTimeout(() => {
			snapshot.classes.forEach(classIdentifier => {
				const classDeclaration = this.getClassFromIdentifier(classIdentifier);
				const children = this.getChildrenOfClass(classIdentifier);
				children.forEach(async child => {

					if (this.classHasUpgradeableMethodsOrProps(child)) {
						if (this.options.debug) {
							console.log(\`\${classDeclaration.name} changed! Force-changing \${child.name}...\`);
						}

						// Load and save the same contents to force the build-tool to recompile the file.
						const contents = await this.fileLoader.load(child.filepath);
						const stringified = contents.toString();
						const lastChar = stringified[stringified.length - 1];
						const isWhitespace = /\s/.test(lastChar);

						// Add a whitespace to the end of the file or remove it again to force a recompilation.
						await this.fileSaver.save(isWhitespace ? \`\${stringified.slice(0, stringified.length - 1)}\` : \`\${stringified} \`, child.filepath);
					}
				});
			});
		});
	}

	public getStateSnapshot (filepath: string): [IStateSnapshot, string] {
		let match = this.snapshots[filepath];
		if (match != null) return [match, filepath];

		for (const extension of StateSnapshotter.orderedExtensions) {
			const path = \`\${filepath}.\${extension}\`;
			match = this.snapshots[path];
			if (match != null) return [match, path];
		}
		throw new ReferenceError(\`Could not find a state snapshot for the given filepath: \${filepath}\`);
	}

	public getResolvedStateSnapshotForIdentifier (identifier: string): [IResolvedStateSnapshot, string] | null {
		for (const key of Object.keys(this.snapshots)) {
			const snapshot = this.getStateSnapshot(key)[0];
			for (const classSnapshot of snapshot.classes) {
				if (classSnapshot === identifier) return [this.getResolvedStateSnapshot(key), key];
			}
		}
		return null;
	}

	private getChildrenOfClass (identifier: string): IClassDeclaration[] {
		return [...this.classes.values()].filter(classDeclaration => classDeclaration.derives === identifier);
	}

	public getClassFromIdentifier (identifier: string): IClassDeclaration {
		const match = this.classes.get(identifier);
		if (match == null) throw new ReferenceError(\`Could not get class: \${identifier} from snapshot!\`);
		return match;
	}

	public importsBinding (binding: string, snapshot: IResolvedStateSnapshot): boolean {
		for (const dependency of snapshot.dependencies) {
			for (const dependencyBinding of dependency.bindings) {
				if (binding === dependencyBinding) return true;
			}
		}
		return false;
	}

	public getResolvedStateSnapshot (filepath: string): IResolvedStateSnapshot {
		const snapshot = this.getStateSnapshot(filepath)[0];
		return {
			filepath,
			substitutions: this.resolveIdentifierValues(),
			dependencies: snapshot.dependencies,
			classes: snapshot.classes
		};
	}

	public resolveIdentifierValues (filepath?: string): ResolvedSubstitutionMap {
		if (filepath != null) return this.resolveIdentifierValuesForFilepath(filepath);

		const obj: ResolvedSubstitutionMap = {};
		Object.keys(this.snapshots).forEach(substitutionFilepath => {
			Object.assign(obj, this.resolveIdentifierValuesForFilepath(substitutionFilepath));
		});
		return obj;
	}

	private resolveIdentifierValuesForFilepath (filepath: string): ResolvedSubstitutionMap {
		const [snapshot, path] = this.getStateSnapshot(filepath);
		const resolvedMap = this.resolvedSubstitutions.get(path) || {needsUpdate: true, substitutions: {}};

		if (resolvedMap == null || resolvedMap.needsUpdate) {
			const substitutions = snapshot.substitutions;

			Object.keys(substitutions).forEach(item => {

				const existingComputedSubstitution = this.computedSubstitutions.get(item);
				let value: string | null;

				if (existingComputedSubstitution == null || existingComputedSubstitution.needsUpdate) {

					const result = this.flattenIdentifierValue(substitutions[item].value, filepath);
					if (result == null) throw new Error(\`Could not resolve the value for identifier: \${item} from filepath: \${filepath}. Is it initialized to a value?\`);

					value = this.computeIdentifierValue(result);
					// TODO: Do we want null values in the substitutions maybe?
					if (value != null) this.computedSubstitutions.set(item, {value, needsUpdate: false});
				} else {
					value = existingComputedSubstitution.value;
				}
				// TODO: Do we want null values in the substitutions maybe?
				if (value != null) resolvedMap.substitutions[item] = value;

			});
			resolvedMap.needsUpdate = false;
			this.resolvedSubstitutions.set(path, resolvedMap);
		}

		return resolvedMap.substitutions;
	}

	private startsWithNumberButShouldEnforceStringOnComputation (value: string): boolean {
		// If the value starts with a digit and possibly a '.' character but then goes on with something
		// else, enforce a string.
		return /^\d+[.]*[^\d.]+/.test(value.trim());
	}

	private normalizeValuePreCompute (value: string): string {
		const newIdentifier = this.getNewExpressionIdentifier(value);
		if (newIdentifier != null) return newIdentifier;
		return value;
	}

	private getNewExpressionIdentifier (value: string): string | null {
		const match = value.match(/^new\s+([^(]*)\(/);
		if (match == null) return null;
		return match[1];
	}

	private computeIdentifierValue (value: string): string | null {
		const normalizedValue = this.normalizeValuePreCompute(value);
		try { return new Function(\`return (\${normalizedValue})\`)(); } catch (ex) {
			try {
				return new Function(\`return ("\${normalizedValue}")\`)();
			} catch (ex) {

				console.log(\`\${this.constructor.name} could not compute value: \${value}.\`);
				if (this.options.debug) {
					console.error(ex.stack);
				}
			}
		}
		return null;
	}

	private resolveIdentifierValue (identifier: BindingIdentifier | string, filepath: string): string | null {
		const [snapshot] = this.getStateSnapshot(filepath);
		const name = typeof identifier === "string" ? identifier : identifier.name;
		const resolved = this.resolve(name, snapshot.substitutions);

		if (resolved != null) return this.flattenIdentifierValue(resolved, filepath);
		return null;
	}

	private resolve (path: string, scope: SubstitutionIndexer): NullableInitializationValue {
		const match = scope[path];
		if (match != null) return match.value;

		// TODO: Fix this soon. It's just too damn hard right now.
		/* tslint:disable */
		let currentScope: any = scope;
		/* tslint:enable */
		let hasResolvedSomething: boolean = false;

		const filtered = path.split(/\.|[\[\]]/).filter(part => part.length > 0);
		for (const part of filtered) {
			let normalizedCurrentScope = currentScope.value != null ? currentScope.value : currentScope;
			normalizedCurrentScope = Array.isArray(normalizedCurrentScope) ? normalizedCurrentScope[0] : normalizedCurrentScope;
			const attempt = normalizedCurrentScope[part];
			if (attempt == null) {
				currentScope = hasResolvedSomething ? currentScope : null;
				break;
			}
			currentScope = attempt;
			hasResolvedSomething = true;
		}
		return currentScope == null ? null : currentScope.value != null ? currentScope.value : currentScope;
	}

	private orderSnapshots (filepath: string): string[] {
		return [filepath].concat(Object.keys(this.snapshots).filter(snapshot => snapshot !== filepath));
	}

	private findIdentifierValue (identifier: BindingIdentifier | string, filepath?: string): string | null {
		const orderedSubs = filepath != null ? this.orderSnapshots(filepath) : Object.keys(this.snapshots);
		for (const orderedFilepath of orderedSubs) {
			const resolved = this.resolveIdentifierValue(identifier, orderedFilepath);
			if (resolved != null) {
				if (typeof resolved === "string") {
					return this.startsWithQuote(resolved) && this.endsWithQuote(resolved) ? resolved : this.computeIdentifierValue(resolved);
				}
				return resolved;
			}
		}
		return null;
	}

	private startsWithQuote (str: string): boolean {
		return /["'\`]/.test(str.trim().slice(0, 1));
	}

	private endsWithQuote (str: string): boolean {
		const trimmed = str.trim();
		return /["'\`]/.test(trimmed.slice(trimmed.length - 1));
	}

	private flattenIdentifierValue (value: InitializationValue, filepath: string): string | null {
		if (value == null) return null;
		return this.host.join(value.map((item, index) => {
			let resolvedItem = item instanceof BindingIdentifier ? this.findIdentifierValue(item, filepath) : item;

			if (item instanceof BindingIdentifier) {
				// If it could not be resolved, expect the reason to be that the resolved item is actually part of
				// Ecmascript or the browser itself (and NOT an unresolved dependency).
				if (resolvedItem == null) resolvedItem = item.name;
				const marshalled = \`\${this.marshaller.marshal(resolvedItem, "")}\`;

				if (this.startsWithQuote(marshalled) && this.endsWithQuote(marshalled) && index !== (value.length - 1)) {
					const trimmed = marshalled.trim();
					return trimmed.slice(1, trimmed.length - 1);
				}
				return marshalled;
			}

			const isObject = this.typeDetector.isObject(resolvedItem);
			if (isObject) {
				const obj: IArbitraryObject<string | null> = {};
				Object.keys(resolvedItem).forEach((key) => {

					// TODO: remove this any declaration and write the code better.
					/* tslint:disable */
					const flattened = resolvedItem == null ? null : this.flattenIdentifierValue((<any>resolvedItem)[key], filepath);
					/* tslint:enable */
					obj[key] = flattened == null ? null : this.computeIdentifierValue(flattened);
				});
				resolvedItem = obj;
			}

			return <string>this.marshaller.marshal(resolvedItem, "");
		}));
	}

	/**
	 * Will serialize any object.
	 * @param obj
	 * @param indentation
	 * @param name
	 * @returns {string}
	 */
	private serializeObject (obj: IArbitraryObject<{}>, indentation: number = 0, name?: string): string {
		const dotLimit: number = 200;
		if (this.typeDetector.isPrimitive(obj) || obj instanceof BindingIdentifier) return obj === null
			? "null"
			: obj === undefined
				? "undefined"
				: this.typeDetector.isString(obj)
					? \`"\${obj.length > dotLimit ? obj.slice(0, dotLimit) + "..." : obj}"\`
					: obj.toString();

		if (Array.isArray(obj)) {
			return \`[ \${obj.map(entry => this.serializeObject(entry)).join(", ")} ]\`;
		}

		else {
			const keys = Object.keys(obj);
			let str = \`\${name || obj.constructor.name} {\`;
			if (keys.length > 0) {
				str += "\n";
				str += "\t".repeat(++indentation);
				keys.forEach((key, index) => {
					const isLast = index === keys.length - 1;
					str += \`\${key}: \${this.serializeObject(obj[key], indentation)}\`;
					if (!isLast) {
						str += ",";
						str += "\n";
						str += "\t".repeat(indentation);
					}
				});
				str += "\n";
				str += "\t".repeat(--indentation);
			}

			str += "}";
			return str;
		}

	}

	private recurse (statements: NodeArray<Statement | VariableDeclaration | ClassElement>, filepath: string, currentScope: string | null = null, fileContents: string): void {
		const snapshot = this.getStateSnapshot(filepath)[0];

		statements.forEach(statement => {

			if (this.host.isVariableDeclaration(statement)) {
				const declarations = statement.declarationList.declarations;
				return this.recurse(declarations, filepath, currentScope, fileContents);
			}

			const name = this.host.getName(statement, true);
			const scope = this.host.getScope(statement);
			if (scope != null) currentScope = scope;
			const initializer = this.host.getInitializedValue(statement, currentScope);

			if (name != null && initializer != null) {
				this.getStateSnapshot(filepath)[0].substitutions[name] = {
					value: initializer
				};

				// If the computed substitution map contains this identifier, make sure to mark it for updates.
				const existingComputedSubstitution = this.computedSubstitutions.get(name);
				if (existingComputedSubstitution != null) existingComputedSubstitution.needsUpdate = true;
			}

			if (this.host.isImportDeclaration(statement)) {
				const declaration = this.host.getImportDeclaration(statement, filepath);

				if (declaration != null) {
					const existingIndex = this.findDependencyIndex(snapshot.dependencies, declaration);
					if (existingIndex < 0) snapshot.dependencies.push(declaration);
					else snapshot.dependencies.splice(existingIndex, 1, declaration);
					return this.storeStateSnapshot(declaration.fullPath);
				}
			}

			if (this.host.isClassDeclaration(statement)) {
				const declaration = this.host.getClassDeclaration(statement, filepath, fileContents);
				if (declaration != null) {
					snapshot.classes.add(declaration.name);
					this.classes.set(declaration.name, declaration);

					if (declaration.derives != null) {
						const superPath = this.findClassPath(declaration.derives, filepath);
						if (superPath != null) this.storeStateSnapshot(superPath);
						// Set 'derives' to null if the class couldn't be found. For example, it might be a built-in such as HTMLElement.
						else declaration.derives = null;
					}
				}
			}

			if ((<ClassLikeDeclaration>statement).members != null) this.recurse((<ClassLikeDeclaration>statement).members, filepath, currentScope, fileContents);
		});
	}

	private classIsHTMLElement (identifier: string): boolean {
		return /HTML.*Element/.test(identifier);
	}

	private findClassPath (identifier: string, fromFilepath: string): string | null {
		if (this.classIsHTMLElement(identifier)) return null;

		const existing = this.getClassFromIdentifier(identifier);
		if (existing != null) return existing.filepath;


		const {classes, dependencies} = this.snapshots[fromFilepath];

		// The superclass might be declared in the same file.
		if (classes.has(identifier)) return fromFilepath;

		// Otherwise, check if it is a import-dependency.
		const superDependency = dependencies.find(dependency => dependency.bindings.some((binding: string) => binding === identifier));
		if (superDependency != null) return superDependency.fullPath;
		return null;
	}

	private findDependencyIndex (dependencies: IModuleDependency[], declaration: IModuleDependency): number {
		return dependencies.findIndex(existingDependency => existingDependency.fullPath === declaration.fullPath);
	}

}

`;

export const FULL_CODE_EXAMPLE_5 = `

import {Config} from "../../Common/Config/Config";
import {deepProp} from "../../Fovea/Engine/Decorator/deepProp";
import {prop} from "../../Fovea/Engine/Decorator/prop";
import {setOnHost} from "../../Fovea/Engine/Decorator/setOnHost";
import {ActionKind} from "../Flux/Action/ActionKind";
import {IAction} from "../Flux/Action/Interface/IAction";
import {IScrollStore} from "../Flux/Store/Interface/IScrollStore";
import {IOption} from "../Model/Interface/IOption";
import {services} from "../services";
import {Color} from "../Style/Atomic/Color";
import {Duration} from "../Style/Atomic/Duration";
import {Easing} from "../Style/Atomic/Easing";
import {Icon} from "../Style/Atomic/Icon";
import {Layout} from "../Style/Atomic/Layout";
import {Typography} from "../Style/Atomic/Typography";
import {IDateOperations} from "../Util/DateOperations/Interface/IDateOperations";
import {DatePickerComponentConfiguration} from "./Configuration/DatePickerComponentConfiguration";
import { ConfirmDialogComponent } from "./ConfirmDialogComponent";
import "./DismissableSwipeableComposite";
import "./IconButtonComponent";
import {IDatePickerComponent, NullableDate, DayOrdinal} from "./Interface/IDatePickerComponent";
import {IDismissableSwipeableComposite, IOpenedSwipePosition} from "./Interface/IDismissableSwipeableComposite";
import {IListComponent} from "./Interface/IListComponent";
import {IOptionPickerComponent} from "./Interface/IOptionPickerComponent";
import {SwipeDirectionKind} from "./Interface/ISwipeableComposite";
import {ICellData} from "./Interface/ITableComponent";
import "./OptionPickerComponent";
import "./TableComponent";
import {IPropChangeRecord} from "../../Fovea/Engine/ProxyObserverConsumer/IPropObserverConsumer";

export class DatePickerComponent extends ConfirmDialogComponent<Date|null> implements IDatePickerComponent {
	@setOnHost @prop private dateGridVisible: boolean = true;
	@setOnHost @prop private scrollBorder: boolean = false;
	@setOnHost @prop private animatingPrevious: boolean = false;
	@setOnHost @prop private animatingNext: boolean = false;
	@setOnHost @prop private ready: boolean = false;
	@prop public range: [Date, Date];
	@prop public disabledDates: Date[] = [];
	@prop public selectedDate: Date | null;
	@prop public visibleMonth: number;
	@prop private visibleYear: number;
	@prop private visibleYearOptions: IOption[];
	@prop private selectedDateYearFormatted: number | null;
	@prop private selectedDateFormatted: string | null;
	@prop private visibleMonthFormatted: string;
	@prop private lastVisibleMonthFormatted: string;
	@prop private lastVisibleYear: number;
	@prop private nextVisibleMonthFormatted: string;
	@prop private nextVisibleYear: number;
	@prop private weekDayLabels: ICellData[];
	@deepProp private previousMonthData: ICellData[][];
	@deepProp private currentMonthData: ICellData[][];
	@deepProp private nextMonthData: ICellData[][];
	private actualDate: Date = this.dateOperations.date;
	private initialized: boolean = false;
	private static readonly INITIALIZATION_TIMEOUT: number = Config.MOBILE ? Duration.longMs : Duration.mediumMs;
	private static readonly DAYS_OF_WEEK: number = 7;
	private static readonly GRID_COLUMNS: number = 37;
	private static readonly LANDSCAPE_BREAKPOINT: number = 550;
	private static readonly SELECTED_DATE_TRANSFORM_LANDSCAPE: number = 30;
	private static readonly SELECTED_DATE_TRANSFORM_PORTRAIT: number = 23;

	private setDefaultState () {
		if (this.range == null) this.range = [this.dateOperations.yearsIntoPast(100), this.dateOperations.yearsIntoFuture(100)];
		if (this.selectedDate == null) this.selectedDate = this.dateOperations.date;
		if (this.visibleMonth == null) this.visibleMonth = this.selectedDate != null ? this.selectedDate.getMonth() : this.dateOperations.month;
		if (this.visibleYear == null) this.visibleYear = this.selectedDate != null ? this.selectedDate.getFullYear() : this.dateOperations.year;
		if (this.weekDayLabels == null) this.weekDayLabels = [
			{label: this.dateOperations.dayOfWeekFormatted(DayOrdinal.DAY_0, true).slice(0, 1), disabled: false, highlighted: false, selected: false, selectable: false},
			{label: this.dateOperations.dayOfWeekFormatted(DayOrdinal.DAY_1, true).slice(0, 1), disabled: false, highlighted: false, selected: false, selectable: false},
			{label: this.dateOperations.dayOfWeekFormatted(DayOrdinal.DAY_2, true).slice(0, 1), disabled: false, highlighted: false, selected: false, selectable: false},
			{label: this.dateOperations.dayOfWeekFormatted(DayOrdinal.DAY_3, true).slice(0, 1), disabled: false, highlighted: false, selected: false, selectable: false},
			{label: this.dateOperations.dayOfWeekFormatted(DayOrdinal.DAY_4, true).slice(0, 1), disabled: false, highlighted: false, selected: false, selectable: false},
			{label: this.dateOperations.dayOfWeekFormatted(DayOrdinal.DAY_5, true).slice(0, 1), disabled: false, highlighted: false, selected: false, selectable: false},
			{label: this.dateOperations.dayOfWeekFormatted(DayOrdinal.DAY_6, true).slice(0, 1), disabled: false, highlighted: false, selected: false, selectable: false}
		];
		this.initialized = true;
	}

	constructor (configuration = DatePickerComponentConfiguration,
							 private scrollStore = services.get<IScrollStore>(),
							 private dateOperations = services.get<IDateOperations>()) {
		super(configuration);
		if (configuration.range != null) this.range = configuration.range;
		if (configuration.disabledDates != null) this.disabledDates = configuration.disabledDates;

		this.subscribeToStore(scrollStore, this.onContainerScrollReachedEnd, ActionKind.SCROLLING_REACHED_END);
		this.subscribeToStore(scrollStore, this.onContainerScrollStarted, ActionKind.STARTED_SCROLLING);
		this.eventOperations.listen(this, "resize", window, this.onWindowResize);
	}

	public async awaitAction (): Promise<Date|null> {
		return new Promise<Date|null>(resolve => this.currentActionCallback = date => resolve(date));
	}

	public markup (): string {
		return \`
			<div id="container">

				<div id="pickedDateContainer">
					<div id="dateFadeWrapper"></div>
					<h6 id="year" onclick="\${this.showYearSelector}">\${this.selectedDateYearFormatted}</h6>
					<h5 id="date" onclick="\${this.showDateSelector}">\${this.selectedDateFormatted}</h5>
				</div>

				<div id="mainContainer">

					<div id="yearGridContainer">
						<div id="yearScrollWrapper">
								<option-picker-component id="optionPicker" labels=\${this.visibleYearOptions} onselection="\${this.onYearSelection}"></option-picker-component>
						</div>
					</div>

					<div id="dateGridContainer">
						<div id="monthSelectorContainer">
							<icon-button-component class="monthSelectorButton" icon="\${Icon.chevronLeft}" onclick="\${this.requestPreviousMonth}" light></icon-button-component>
							<icon-button-component class="monthSelectorButton" icon="\${Icon.chevronRight}" onclick="\${this.requestNextMonth}" light></icon-button-component>
						</div>

						<div id="dateSelectorContainer">
							<dismissable-swipeable-composite if="\${Config.MOBILE}" id="swiper" onswipestarted="\${this.onSwipeStarted}" onswipeended="\${this.onSwipeEnded}" ondismissended="\${this.onSwipeSuccessfulEnded}"></dismissable-swipeable-composite>
							<table-component id="previousMonthTable" data="\${this.previousMonthData}" caption="\${this.lastVisibleMonthFormatted} \${this.lastVisibleYear}"></table-component>
							<table-component id="currentMonthTable"
								data="\${this.currentMonthData}"
								caption="\${this.visibleMonthFormatted} \${this.visibleYear}"
								onselection="\${this.onDateSelection}">
							</table-component>
							<table-component id="nextMonthTable" data="\${this.nextMonthData}" caption="\${this.nextVisibleMonthFormatted} \${this.nextVisibleYear}"></table-component>
						</div>
					</div>

				</div>

				<div id="filler"></div>
				<div id="actionButtonContainer">
					<button-component onclick="\${this.onPressedCancelAction}" id="cancelAction" content-color="\${Color.primary100}" text="\${this.localeService.string.cancel}"></button-component>
					<button-component onclick="\${this.onPressedOkayAction}" id="okayAction" content-color="\${Color.primary100}" text="\${this.localeService.string.okay}"></button-component>
				</div>
			</div>
		\`;
	}


	public styles (): string {
		return \`
			\${super.styles()}

			:host {
				contain: strict;
				backface-visibility: hidden;
			}

			:host table-component caption {
				font-size: \${Typography.bodyEmphasizedSize}px;
				line-height: \${Typography.bodyEmphasizedSize}px;
				font-weight: \${Typography.bodyEmphasizedWeight};
				color: \${Color.bodyEmphasizedDark};
				margin-bottom: 20px;
			}

			#container {
				min-width: 310px;
				min-height: 300px;
				max-height: 444px;
				padding: 0;
			}

			#filler {
				contain: strict;
				flex-grow: 1;
				transition: box-shadow \${Duration.complexTransition}s \${Easing.standardCurve};
			}

			#mainContainer {
				transform: translate3d(0,0,0);
				contain: content;
			}

			#pickedDateContainer {
				box-sizing: border-box;
				transform: translate3d(0,0,0);
				contain: strict;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				width: 100%;
				height: 90px;
				padding: 24px 24px 15px 24px;
				background-color: \${Color.primary100};
				overflow: hidden;
				z-index: 2;
			}

			:host:not([date-grid-visible]) #dateGridContainer,
			:host[date-grid-visible] #yearGridContainer {
				display: none;
			}

			#dateGridContainer {
				transform: translate3d(0,0,0);
			}

			#yearGridContainer {
				\${Layout.flexCenterChildrenVerticallyHorizontally}
				overflow: hidden;
				min-width: 282px;
				height: 303px;
				contain: strict;
			}

			#yearScrollWrapper {
				\${Layout.flexCenterChildrenVerticallyHorizontally}
				position: relative;
				width: 100%;
				height: 100%;
				text-align: center;
			}

			#dateGridContainer,
			#yearGridContainer {
				margin-top: 90px;
				position: relative;
			}

			#monthSelectorContainer {
				position: absolute;
				\${Layout.flexChildrenHorizontallyCenterVerticallyStretchHorizontally}
				width: 100%;
				padding: 5px 10px 0 10px;
				z-index: 2;
			}

			.monthSelectorButton {
				border-radius: 50%;
			}

			#dateSelectorContainer {
				backface-visibility: hidden;
				transform: translate3d(0,0,0);
				display: block;
				position: relative;
				height: 302px;
			}

			:host table-component {
				position: absolute;
				top: 22px;
				left: 0;
				right: 0;
				margin: 0 auto;
				z-index: 1000;
				contain: content;
			}

			#previousMonthTable,
			#nextMonthTable {
				pointer-events: none;
			}

			:host:not([ready]) #previousMonthTable,
			:host:not([ready]) #nextMonthTable {
				display: none;
			}

			:host[animating-previous] #dateSelectorContainer,
			:host[animating-next] #dateSelectorContainer {
				will-change: transform;
			}

			#previousMonthTable {
				transform: translate3d(-100%, 0, 0);
			}

			#nextMonthTable {
				transform: translate3d(100%, 0, 0);
			}

			#currentMonthTable {
				transform: translate3d(0, 0, 0);
			}

			#dateFadeWrapper {
				z-index: 1;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				height: 50px;
				width: 100%;
				background-color: \${Color.primary100};
				transform: translate3d(0,0,0);
				contain: strict;
			}

			#year {
				position: relative;
				z-index: 2;
				margin: 0 0 10px 0;
			}

			#date {
				z-index: 1;
				font-size: 22px;
				line-height: 22px;
				margin: 0;
			}

			#date,
			#year {
				cursor: pointer;
				transition: color \${Duration.enteringScreen}s \${Easing.standardCurve};
			}

			:host[date-grid-visible] #year,
			:host:not([date-grid-visible]) #date {
				color: \${Color.secondaryTextLight};
			}

			:host[date-grid-visible] #date,
			:host:not([date-grid-visible]) #year {
				color: \${Color.primaryTextLight};
			}

			#date:first-letter {
				text-transform: capitalize;
			}

			#actionButtonContainer {
		 		padding: 0 8px 8px 0;
		 		margin-top: 8px;
		 	}

		 	:host[scroll-border] #filler {
		 		box-shadow: 0 -1px 0px 0.5px \${Color.dividerOnLightBackground};
		 	}


			@media all and (max-width: 400px) {

				#container {
					max-width: 100%;
				}
		 }

			@media all and (max-height: 430px) and (max-width: 549px) {

				#container {
					max-height: auto;
				}

				#pickedDateContainer {
					height: 80px;
					padding: 6px 24px 0 24px;
				}

				#dateGridContainer,
				#yearGridContainer {
					margin-top: 80px;
					contain: strict;
				}
		 }

			@media all and (min-width: \${DatePickerComponent.LANDSCAPE_BREAKPOINT}px) {
				#container  {
					min-width: \${DatePickerComponent.LANDSCAPE_BREAKPOINT}px;
				}

				#actionButtonContainer {
		 			margin-top: 3px;
		 		}

				#dateGridContainer,
				#yearGridContainer {
					height: 308px
				}

				#pickedDateContainer {
					left: 0;
					right: auto;
					width: 175px;
					height: 100%;
				}

				#dateGridContainer,
				#yearGridContainer {
					margin-top: initial;
					margin-left: 175px;
				}
		 }

		 @media all and (min-width: \${DatePickerComponent.LANDSCAPE_BREAKPOINT}px) and (max-height: 500px) {

		 		#container {
		 			max-height: 100%;
		 		}

		 }

		 @media all and (max-width: \${DatePickerComponent.LANDSCAPE_BREAKPOINT}px) and (max-height: 535px) {

		 		#container {
		 			max-height: 100%;
		 		}

		 		#filler {
		 			display: none;
		 		}

		 }

		 @media all and (min-width: \${DatePickerComponent.LANDSCAPE_BREAKPOINT}px) and (max-height: 387px) {

		 		#container {
		 			min-height: auto;
		 		}

		 		#filler {
		 			display: none;
		 		}

				#dateGridContainer,
				#yearGridContainer {
					height: 270px;
				}
		 }

		\`;
	}

	protected disconnectedCallback (): void {
		super.disconnectedCallback();
		this.unsubscribeFromStore(this.scrollStore, this.onContainerScrollReachedEnd, ActionKind.SCROLLING_REACHED_END);
		this.unsubscribeFromStore(this.scrollStore, this.onContainerScrollStarted, ActionKind.STARTED_SCROLLING);
	}

	private async updateSelectedDate (oldSelectedDate: Date | null): Promise<void> {
		if (this.selectedDate == null) return;

		const landscape = this.isInLandscape();
		if (oldSelectedDate != null) {
			await this.animationOperations.animate(
				this.$.date,
				{
					transform: [\`translate3d(0,0,0)\`, \`translate3d(0, \${landscape ? -DatePickerComponent.SELECTED_DATE_TRANSFORM_LANDSCAPE : -DatePickerComponent.SELECTED_DATE_TRANSFORM_PORTRAIT}px,0)\`],
					opacity: [1, 0]
				},
				{
					duration: landscape ? Duration.leavingScreen * 1000 : (Duration.leavingScreen / 2) * 1000,
					easing: Easing.accelerationCurve,
					delay: (Duration.leavingScreen * 1000) / 2,
					fill: "forwards"
				});
		}
		this.selectedDateFormatted = this.dateOperations.dayOfWeekMonthDateOfMonth(this.selectedDate);
		this.selectedDateYearFormatted = this.selectedDate.getFullYear();

		if (oldSelectedDate != null) await this.animationOperations.animate(
			this.$.date,
			{
				transform: [\`translate3d(0,\${landscape ? DatePickerComponent.SELECTED_DATE_TRANSFORM_LANDSCAPE : DatePickerComponent.SELECTED_DATE_TRANSFORM_PORTRAIT}px,0)\`, \`translate3d(0,0,0)\`],
				opacity: [0, 1]
			},
			{
				duration: landscape ? Duration.leavingScreen * 1000 : (Duration.enteringScreen / 2) * 1000,
				easing: Easing.decelerationCurve,
				fill: "forwards"
			});
	}

	private updateVisibleYearOption (): void {
		this.visibleYearOptions.forEach(option => {
			if (option.selected && (this.selectedDate == null || option.label !== this.selectedDate.getFullYear())) {
				option.selected = false;
			}
			if (this.selectedDate != null && !option.selected && option.label === this.selectedDate.getFullYear()) {
				option.selected = true;
			}
		});
	}

	public async onPropChanged ({prop, newValue, oldValue}: IPropChangeRecord): Promise<void> {
		await super.onPropChanged({prop, newValue, oldValue});

		switch (prop) {

			case "visible":
				if (newValue) {
					await this.waitOperations.wait(Duration.enteringScreen * (1000 + Duration.longMs));
					this.onWindowResize();
					this.ready = true;
				} else {
					this.ready = false;
				}
				break;

			case "range":
				this.visibleYearOptions = this.getVisibleYearOptions();
				break;

			case "selectedDate":
				if (newValue != null) {
					await this.updateSelectedDate(<NullableDate>oldValue);
					this.updateVisibleYearOption();
				}
				break;

			case "visibleMonth":
				if (newValue != null) {
					this.visibleMonthFormatted = this.dateOperations.monthFormatted(this.visibleMonth);
					this.lastVisibleMonthFormatted = this.dateOperations.monthFormatted(this.dateOperations.lastMonth(this.visibleMonth));
					this.nextVisibleMonthFormatted = this.dateOperations.monthFormatted(this.dateOperations.nextMonth(this.visibleMonth));
					this.lastVisibleYear = this.dateOperations.lastYearFromMonth(this.visibleMonth, this.visibleYear);
					this.nextVisibleYear = this.dateOperations.nextYearFromMonth(this.visibleMonth, this.visibleYear);
					this.setDates();
				}

				break;
		}
	}

	private isInLandscape (): boolean {
		return window.innerWidth >= DatePickerComponent.LANDSCAPE_BREAKPOINT;
	}

	private isDateDisabled (date: Date | null): boolean {
		if (date == null) return false;

		const [startDate, endDate] = this.range;
		return (date < startDate || date > endDate || this.disabledDates.some(disabledDate => disabledDate.toDateString() === date.toDateString()));
	}

	private isSelectedDate (date: Date | null): boolean {
		if (date == null || this.selectedDate == null) return false;
		return date === this.selectedDate ||
			(this.selectedDate.getFullYear() === date.getFullYear() &&
			this.selectedDate.getMonth() === date.getMonth() &&
			this.selectedDate.getDate() === date.getDate());
	}

	private isDateCurrentDay (date: Date | null): boolean {
		if (date == null) return false;
		return this.actualDate.getFullYear() === date.getFullYear() &&
			this.actualDate.getMonth() === date.getMonth() &&
			this.actualDate.getDate() === date.getDate();
	}

	private getVisibleYearSelectionRange (): [number, number] {
		const [startDate, endDate] = this.range;
		return [startDate.getFullYear(), endDate.getFullYear()];
	}

	private getVisibleYearOptions (): IOption[] {
		const [start, end] = this.getVisibleYearSelectionRange();

		const arr: IOption[] = [];
		let counter = 0;
		for (let i = start; i <= end; i++) arr[counter++] = {label: i, selected: i === this.dateOperations.year, disabled: false};
		return arr;
	}

	private getMatchingDatesForWeekDaysForMonth (month: number, year: number): NullableDate[] {
		const date = new Date(year, month);
		date.setDate(1);
		const firstWeekDayOfMonth = this.dateOperations.localizedDay(date.getDay());
		const days: NullableDate[] = [];

		for (let i = 0; i < DatePickerComponent.GRID_COLUMNS; i++) {
			days[i] = null;
		}

		for (let i = 0; i <= DatePickerComponent.GRID_COLUMNS; i++) {
			date.setDate(i + 1);
			if (date.getMonth() !== month) break;
			days[i + firstWeekDayOfMonth] = new Date(date);
		}

		return days;
	}

	private mapTableData (dates: (Date | null)[], isPrimary: boolean = true): ICellData[][] {
		const mappedDates: ICellData[][] = [[...this.weekDayLabels]];
		let currentDateRow = 0;
		dates.forEach((date, index) => {
			if (index % DatePickerComponent.DAYS_OF_WEEK === 0) currentDateRow++;
			mappedDates[currentDateRow] = mappedDates[currentDateRow] || [];
			mappedDates[currentDateRow].push({
				label: date != null ? date.getDate() : null,
				selectable: isPrimary ? date != null : false,
				selected: isPrimary ? this.isSelectedDate(date) : false,
				highlighted: this.isDateCurrentDay(date),
				disabled: this.isDateDisabled(date)
			});
		});
		return mappedDates;
	}

	private setMappedTableData (existing: ICellData[][], mappedTableData: ICellData[][]): void {

		existing.forEach((row, rowIndex) => row.forEach((cell, cellIndex) => {

			const mappedCell = mappedTableData[rowIndex][cellIndex];
			if (cell.label !== mappedCell.label) cell.label = mappedCell.label;
			if (cell.selectable !== mappedCell.selectable) cell.selectable = mappedCell.selectable;
			if (cell.selected !== mappedCell.selected) cell.selected = mappedCell.selected;
			if (cell.highlighted !== mappedCell.highlighted) cell.highlighted = mappedCell.highlighted;
			if (cell.disabled !== mappedCell.disabled) cell.disabled = mappedCell.disabled;
		}));
	}

	private onDateSelection (e: CustomEvent): void {
		const option = <IOption>e.detail;
		if (option.label != null) this.selectedDate = this.dateOperations.dateFrom(this.visibleYear, this.visibleMonth, <string>option.label);
	}

	private setDates (): void {
		const previousDates = this.getMatchingDatesForWeekDaysForMonth(this.dateOperations.lastMonth(this.visibleMonth), this.dateOperations.lastYearFromMonth(this.visibleMonth, this.visibleYear));
		const currentDates = this.getMatchingDatesForWeekDaysForMonth(this.visibleMonth, this.visibleYear);
		const nextDates = this.getMatchingDatesForWeekDaysForMonth(this.dateOperations.nextMonth(this.visibleMonth), this.dateOperations.nextYearFromMonth(this.visibleMonth, this.visibleYear));

		const mappedPreviousDates = this.mapTableData(previousDates, false);
		const mappedCurrentDates = this.mapTableData(currentDates);
		const mappedNextDates = this.mapTableData(nextDates, false);

		if (this.previousMonthData == null) this.previousMonthData = mappedPreviousDates;
		else this.setMappedTableData(this.previousMonthData, mappedPreviousDates);

		if (this.currentMonthData == null) this.currentMonthData = mappedCurrentDates;
		else this.setMappedTableData(this.currentMonthData, mappedCurrentDates);

		if (this.nextMonthData == null) this.nextMonthData = mappedNextDates;
		else this.setMappedTableData(this.nextMonthData, mappedNextDates);
	}

	private goToPreviousMonth (): void {
		const visibleMonth = this.visibleMonth;
		this.visibleMonth = this.dateOperations.lastMonth(visibleMonth);
		this.visibleYear = this.dateOperations.lastYearFromMonth(visibleMonth, this.visibleYear);
	}


	private async requestPreviousMonth (): Promise<void> {

		this.animatingPrevious = true;
		await this.waitOperations.wait(100);
		await this.animationOperations.animate(this.$.dateSelectorContainer,
			{
				transform: ["translate3d(0, 0, 0)", "translate3d(100%, 0, 0)"]
			},
			{
				duration: Duration.standardTransition * 1000,
				easing: Easing.standardCurve
			});

		this.animatingPrevious = false;
		this.goToPreviousMonth();
	}

	private goToNextMonth (): void {
		const visibleMonth = this.visibleMonth;
		this.visibleMonth = this.dateOperations.nextMonth(visibleMonth);
		this.visibleYear = this.dateOperations.nextYearFromMonth(visibleMonth, this.visibleYear);
	}

	private async requestNextMonth (): Promise<void> {

		this.animatingNext = true;
		await this.waitOperations.wait(Duration.shortMs);
		await this.animationOperations.animate(this.$.dateSelectorContainer,
			{
				transform: ["translate3d(0, 0, 0)", "translate3d(-100%, 0, 0)"]
			},
			{
				duration: Duration.standardTransition * 1000,
				easing: Easing.standardCurve
			});

		this.animatingNext = false;
		this.goToNextMonth();
	}

	protected onPressedCancelAction (): void {
		if (this.currentActionCallback != null) {
			this.currentActionCallback(null);
			this.currentActionCallback = null;
		}
		this.onDismissRequest();
	}

	private async showYearSelector (): Promise<void> {
		if (!this.dateGridVisible) return;
		const optionPicker = <IOptionPickerComponent>this.$.optionPicker;
		await Promise.all([
			this.dateGridVisible = false,
			optionPicker.focusSelectedOption()
		]);

	}

	private async showDateSelector (): Promise<void> {
		if (this.dateGridVisible) return;
		await Promise.all([
			this.dateGridVisible = true,
			this.scrollBorder = false
		]);
	}

	private async onYearSelection (e: CustomEvent): Promise<void> {
		const year = parseInt(e.detail);
		this.visibleYear = year;
		this.selectedDate = this.dateOperations.dateFrom(year);
		this.setDates();
		await this.showDateSelector();
	}

	protected onPressedOkayAction (): void {
		if (this.currentActionCallback != null) {
			this.currentActionCallback(this.selectedDate);
			this.currentActionCallback = null;
		}
		this.onDismissRequest();
	}

	private onContainerScrollStarted (action: IAction<IListComponent<IOption>>): void {
		const optionPicker = <IOptionPickerComponent>this.$.optionPicker;
		if (action.payload !== optionPicker.$.list) return;
		this.scrollBorder = true;
	}

	private onContainerScrollReachedEnd (action: IAction<IListComponent<IOption>>): void {
		const optionPicker = <IOptionPickerComponent>this.$.optionPicker;
		if (action.payload !== optionPicker.$.list) return;
		this.scrollBorder = false;
	}

	private onSwipeStarted (): void {
		this.animatingPrevious = true;
		this.animatingNext = true;
	}

	private onSwipeEnded (): void {
		this.animatingPrevious = false;
		this.animatingNext = false;
	}

	private onSwipeSuccessfulEnded (e: CustomEvent): void {
		const [xDict] = <[IOpenedSwipePosition, IOpenedSwipePosition]> e.detail;
		if (xDict.direction === SwipeDirectionKind.NEGATIVE) this.goToNextMonth();
		else if (xDict.direction === SwipeDirectionKind.POSITIVE) this.goToPreviousMonth();
		const swiper = <IDismissableSwipeableComposite>this.$.swiper;
		swiper.reset();
	}

	private onWindowResize (): void {
		const swiper = <IDismissableSwipeableComposite>this.$.swiper;
		if (swiper != null && this.visible) {
			swiper.setDefaultSwipeLimit();
			swiper.swipeLimit = [this.$.dateSelectorContainer.offsetWidth, this.$.dateSelectorContainer.offsetHeight];
		}
	}

	protected async preAnimateFocusIn (): Promise<void> {
		if (!this.initialized) {
			this.setDefaultState();
			// Allow the date picker to prepare itself before proceeding with the focus-in.
			await this.waitOperations.wait(DatePickerComponent.INITIALIZATION_TIMEOUT);
		}
		await super.preAnimateFocusIn();
	}

}
		
`;

export const FULL_CODE_EXAMPLE_6 = `

	/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
(function (global, factory) {

	"use strict";

	if (typeof module === "object" && typeof module.exports === "object") {

		module.exports = global.document ?
			factory(global, true) :
			function (w) {
				if (!w.document) {
					throw new Error("jQuery requires a window with a document");
				}
				return factory(w);
			};
	} else {
		factory(global);
	}

	// Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {

	// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
	// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
	// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
	// enough that all such attempts are guarded in a try block.
	"use strict";

	var arr = [];

	var document = window.document;

	var getProto = Object.getPrototypeOf;

	var slice = arr.slice;

	var concat = arr.concat;

	var push = arr.push;

	var indexOf = arr.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var fnToString = hasOwn.toString;

	var ObjectFunctionString = fnToString.call(Object);

	var support = {};



	function DOMEval(code, doc) {
		doc = doc || document;

		var script = doc.createElement("script");

		script.text = code;
		doc.head.appendChild(script).parentNode.removeChild(script);
	}
	/* global Symbol */
	// Defining this global in .eslintrc.json would create a danger of using the global
	// unguarded in another place, it seems safer to define global only for this module



	var
		version = "3.2.1",

		// Define a local copy of jQuery
		jQuery = function (selector, context) {

			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init(selector, context);
		},

		// Support: Android <=4.0 only
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([a-z])/g,

		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function (all, letter) {
			return letter.toUpperCase();
		};

	jQuery.fn = jQuery.prototype = {

		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// The default length of a jQuery object is 0
		length: 0,

		toArray: function () {
			return slice.call(this);
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function (num) {

			// Return all the elements in a clean array
			if (num == null) {
				return slice.call(this);
			}

			// Return just the one element from the set
			return num < 0 ? this[num + this.length] : this[num];
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function (elems) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge(this.constructor(), elems);

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		each: function (callback) {
			return jQuery.each(this, callback);
		},

		map: function (callback) {
			return this.pushStack(jQuery.map(this, function (elem, i) {
				return callback.call(elem, i, elem);
			}));
		},

		slice: function () {
			return this.pushStack(slice.apply(this, arguments));
		},

		first: function () {
			return this.eq(0);
		},

		last: function () {
			return this.eq(-1);
		},

		eq: function (i) {
			var len = this.length,
				j = +i + (i < 0 ? len : 0);
			return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
		},

		end: function () {
			return this.prevObject || this.constructor();
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	jQuery.extend = jQuery.fn.extend = function () {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;

			// Skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if (typeof target !== "object" && !jQuery.isFunction(target)) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {

			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {

				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (jQuery.isPlainObject(copy) ||
						(copyIsArray = Array.isArray(copy)))) {

						if (copyIsArray) {
							copyIsArray = false;
							clone = src && Array.isArray(src) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = jQuery.extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend({

		// Unique for each copy of jQuery on the page
		expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function (msg) {
			throw new Error(msg);
		},

		noop: function () { },

		isFunction: function (obj) {
			return jQuery.type(obj) === "function";
		},

		isWindow: function (obj) {
			return obj != null && obj === obj.window;
		},

		isNumeric: function (obj) {

			// As of jQuery 3.0, isNumeric is limited to
			// strings and numbers (primitives or objects)
			// that can be coerced to finite numbers (gh-2662)
			var type = jQuery.type(obj);
			return (type === "number" || type === "string") &&

				// parseFloat NaNs numeric-cast false positives ("")
				// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
				// subtraction forces infinities to NaN
				!isNaN(obj - parseFloat(obj));
		},

		isPlainObject: function (obj) {
			var proto, Ctor;

			// Detect obvious negatives
			// Use toString instead of jQuery.type to catch host objects
			if (!obj || toString.call(obj) !== "[object Object]") {
				return false;
			}

			proto = getProto(obj);

			if (!proto) {
				return true;
			}

			// Objects with prototype are plain iff they were constructed by a global Object function
			Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
			return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
		},

		isEmptyObject: function (obj) {

			/* eslint-disable no-unused-vars */
			// See https://github.com/eslint/eslint/issues/6125
			var name;

			for (name in obj) {
				return false;
			}
			return true;
		},

		type: function (obj) {
			if (obj == null) {
				return obj + "";
			}

			// Support: Android <=2.3 only (functionish RegExp)
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[toString.call(obj)] || "object" :
				typeof obj;
		},

		// Evaluates a script in a global context
		globalEval: function (code) {
			DOMEval(code);
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE <=9 - 11, Edge 12 - 13
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function (string) {
			return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
		},

		each: function (obj, callback) {
			var length, i = 0;

			if (isArrayLike(obj)) {
				length = obj.length;
				for (; i < length; i++) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			} else {
				for (i in obj) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			}

			return obj;
		},

		// Support: Android <=4.0 only
		trim: function (text) {
			return text == null ?
				"" :
				(text + "").replace(rtrim, "");
		},

		// results is for internal usage only
		makeArray: function (arr, results) {
			var ret = results || [];

			if (arr != null) {
				if (isArrayLike(Object(arr))) {
					jQuery.merge(ret,
						typeof arr === "string" ?
							[arr] : arr
					);
				} else {
					push.call(ret, arr);
				}
			}

			return ret;
		},

		inArray: function (elem, arr, i) {
			return arr == null ? -1 : indexOf.call(arr, elem, i);
		},

		// Support: Android <=4.0 only, PhantomJS 1 only
		// push.apply(_, arraylike) throws on ancient WebKit
		merge: function (first, second) {
			var len = +second.length,
				j = 0,
				i = first.length;

			for (; j < len; j++) {
				first[i++] = second[j];
			}

			first.length = i;

			return first;
		},

		grep: function (elems, callback, invert) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for (; i < length; i++) {
				callbackInverse = !callback(elems[i], i);
				if (callbackInverse !== callbackExpect) {
					matches.push(elems[i]);
				}
			}

			return matches;
		},

		// arg is for internal usage only
		map: function (elems, callback, arg) {
			var length, value,
				i = 0,
				ret = [];

			// Go through the array, translating each of the items to their new values
			if (isArrayLike(elems)) {
				length = elems.length;
				for (; i < length; i++) {
					value = callback(elems[i], i, arg);

					if (value != null) {
						ret.push(value);
					}
				}

				// Go through every key on the object,
			} else {
				for (i in elems) {
					value = callback(elems[i], i, arg);

					if (value != null) {
						ret.push(value);
					}
				}
			}

			// Flatten any nested arrays
			return concat.apply([], ret);
		},

		// A global GUID counter for objects
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function (fn, context) {
			var tmp, args, proxy;

			if (typeof context === "string") {
				tmp = fn[context];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if (!jQuery.isFunction(fn)) {
				return undefined;
			}

			// Simulated bind
			args = slice.call(arguments, 2);
			proxy = function () {
				return fn.apply(context || this, args.concat(slice.call(arguments)));
			};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		now: Date.now,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	});

	if (typeof Symbol === "function") {
		jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
	}

	// Populate the class2type map
	jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
		function (i, name) {
			class2type["[object " + name + "]"] = name.toLowerCase();
		});

	function isArrayLike(obj) {

		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type(obj);

		if (type === "function" || jQuery.isWindow(obj)) {
			return false;
		}

		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && (length - 1) in obj;
	}
	var Sizzle =
		/*!
		 * Sizzle CSS Selector Engine v2.3.3
		 * https://sizzlejs.com/
		 *
		 * Copyright jQuery Foundation and other contributors
		 * Released under the MIT license
		 * http://jquery.org/license
		 *
		 * Date: 2016-08-08
		 */
		(function (window) {

			var i,
				support,
				Expr,
				getText,
				isXML,
				tokenize,
				compile,
				select,
				outermostContext,
				sortInput,
				hasDuplicate,

				// Local document vars
				setDocument,
				document,
				docElem,
				documentIsHTML,
				rbuggyQSA,
				rbuggyMatches,
				matches,
				contains,

				// Instance-specific data
				expando = "sizzle" + 1 * new Date(),
				preferredDoc = window.document,
				dirruns = 0,
				done = 0,
				classCache = createCache(),
				tokenCache = createCache(),
				compilerCache = createCache(),
				sortOrder = function (a, b) {
					if (a === b) {
						hasDuplicate = true;
					}
					return 0;
				},

				// Instance methods
				hasOwn = ({}).hasOwnProperty,
				arr = [],
				pop = arr.pop,
				push_native = arr.push,
				push = arr.push,
				slice = arr.slice,
				// Use a stripped-down indexOf as it's faster than native
				// https://jsperf.com/thor-indexof-vs-for/5
				indexOf = function (list, elem) {
					var i = 0,
						len = list.length;
					for (; i < len; i++) {
						if (list[i] === elem) {
							return i;
						}
					}
					return -1;
				},

				booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

				// Regular expressions

				// http://www.w3.org/TR/css3-selectors/#whitespace
				whitespace = "[\\x20\\t\\r\\n\\f]",

				// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
				identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

				// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
				attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
					// Operator (capture 2)
					"*([*^$|!~]?=)" + whitespace +
					// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
					"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
					"*\\]",

				pseudos = ":(" + identifier + ")(?:\\((" +
					// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
					// 1. quoted (capture 3; capture 4 or capture 5)
					"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
					// 2. simple (capture 6)
					"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
					// 3. anything else (capture 2)
					".*" +
					")\\)|)",

				// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
				rwhitespace = new RegExp(whitespace + "+", "g"),
				rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),

				rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
				rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),

				rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),

				rpseudo = new RegExp(pseudos),
				ridentifier = new RegExp("^" + identifier + "$"),

				matchExpr = {
					"ID": new RegExp("^#(" + identifier + ")"),
					"CLASS": new RegExp("^\\.(" + identifier + ")"),
					"TAG": new RegExp("^(" + identifier + "|[*])"),
					"ATTR": new RegExp("^" + attributes),
					"PSEUDO": new RegExp("^" + pseudos),
					"CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
						"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
						"*(\\d+)|))" + whitespace + "*\\)|)", "i"),
					"bool": new RegExp("^(?:" + booleans + ")$", "i"),

					"needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
						whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
				},

				rinputs = /^(?:input|select|textarea|button)$/i,
				rheader = /^h\d$/i,

				rnative = /^[^{]+\{\s*\[native \w/,

				// Easily-parseable/retrievable ID or TAG or CLASS selectors
				rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

				rsibling = /[+~]/,

				// CSS escapes
				// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
				runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
				funescape = function (_, escaped, escapedWhitespace) {
					var high = "0x" + escaped - 0x10000;
					// NaN means non-codepoint
					// Support: Firefox<24
					// Workaround erroneous numeric interpretation of +"0x"
					return high !== high || escapedWhitespace ?
						escaped :
						high < 0 ?
							// BMP codepoint
							String.fromCharCode(high + 0x10000) :
							// Supplemental Plane codepoint (surrogate pair)
							String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
				},

				// CSS string/identifier serialization
				// https://drafts.csswg.org/cssom/#common-serializing-idioms
				rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
				fcssescape = function (ch, asCodePoint) {
					if (asCodePoint) {

						// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
						if (ch === "\0") {
							return "\uFFFD";
						}

						// Control characters and (dependent upon position) numbers get escaped as code points
						return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
					}

					// Other potentially-special ASCII characters get backslash-escaped
					return "\\" + ch;
				},

				// Used for iframes
				// See setDocument()
				// Removing the function wrapper causes a "Permission Denied"
				// error in IE
				unloadHandler = function () {
					setDocument();
				},

				disabledAncestor = addCombinator(
					function (elem) {
						return elem.disabled === true && ("form" in elem || "label" in elem);
					},
					{ dir: "parentNode", next: "legend" }
				);

			// Optimize for push.apply( _, NodeList )
			try {
				push.apply(
					(arr = slice.call(preferredDoc.childNodes)),
					preferredDoc.childNodes
				);
				// Support: Android<4.0
				// Detect silently failing push.apply
				arr[preferredDoc.childNodes.length].nodeType;
			} catch (e) {
				push = {
					apply: arr.length ?

						// Leverage slice if possible
						function (target, els) {
							push_native.apply(target, slice.call(els));
						} :

						// Support: IE<9
						// Otherwise append directly
						function (target, els) {
							var j = target.length,
								i = 0;
							// Can't trust NodeList.length
							while ((target[j++] = els[i++])) { }
							target.length = j - 1;
						}
				};
			}

			function Sizzle(selector, context, results, seed) {
				var m, i, elem, nid, match, groups, newSelector,
					newContext = context && context.ownerDocument,

					// nodeType defaults to 9, since context defaults to document
					nodeType = context ? context.nodeType : 9;

				results = results || [];

				// Return early from calls with invalid selector or context
				if (typeof selector !== "string" || !selector ||
					nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {

					return results;
				}

				// Try to shortcut find operations (as opposed to filters) in HTML documents
				if (!seed) {

					if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
						setDocument(context);
					}
					context = context || document;

					if (documentIsHTML) {

						// If the selector is sufficiently simple, try using a "get*By*" DOM method
						// (excepting DocumentFragment context, where the methods don't exist)
						if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {

							// ID selector
							if ((m = match[1])) {

								// Document context
								if (nodeType === 9) {
									if ((elem = context.getElementById(m))) {

										// Support: IE, Opera, Webkit
										// TODO: identify versions
										// getElementById can match elements by name instead of ID
										if (elem.id === m) {
											results.push(elem);
											return results;
										}
									} else {
										return results;
									}

									// Element context
								} else {

									// Support: IE, Opera, Webkit
									// TODO: identify versions
									// getElementById can match elements by name instead of ID
									if (newContext && (elem = newContext.getElementById(m)) &&
										contains(context, elem) &&
										elem.id === m) {

										results.push(elem);
										return results;
									}
								}

								// Type selector
							} else if (match[2]) {
								push.apply(results, context.getElementsByTagName(selector));
								return results;

								// Class selector
							} else if ((m = match[3]) && support.getElementsByClassName &&
								context.getElementsByClassName) {

								push.apply(results, context.getElementsByClassName(m));
								return results;
							}
						}

						// Take advantage of querySelectorAll
						if (support.qsa &&
							!compilerCache[selector + " "] &&
							(!rbuggyQSA || !rbuggyQSA.test(selector))) {

							if (nodeType !== 1) {
								newContext = context;
								newSelector = selector;

								// qSA looks outside Element context, which is not what we want
								// Thanks to Andrew Dupont for this workaround technique
								// Support: IE <=8
								// Exclude object elements
							} else if (context.nodeName.toLowerCase() !== "object") {

								// Capture the context ID, setting it first if necessary
								if ((nid = context.getAttribute("id"))) {
									nid = nid.replace(rcssescape, fcssescape);
								} else {
									context.setAttribute("id", (nid = expando));
								}

								// Prefix every selector in the list
								groups = tokenize(selector);
								i = groups.length;
								while (i--) {
									groups[i] = "#" + nid + " " + toSelector(groups[i]);
								}
								newSelector = groups.join(",");

								// Expand context for sibling selectors
								newContext = rsibling.test(selector) && testContext(context.parentNode) ||
									context;
							}

							if (newSelector) {
								try {
									push.apply(results,
										newContext.querySelectorAll(newSelector)
									);
									return results;
								} catch (qsaError) {
								} finally {
									if (nid === expando) {
										context.removeAttribute("id");
									}
								}
							}
						}
					}
				}

				// All others
				return select(selector.replace(rtrim, "$1"), context, results, seed);
			}

			/**
			 * Create key-value caches of limited size
			 * @returns {function(string, object)} Returns the Object data after storing it on itself with
			 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
			 *	deleting the oldest entry
			 */
			function createCache() {
				var keys = [];

				function cache(key, value) {
					// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
					if (keys.push(key + " ") > Expr.cacheLength) {
						// Only keep the most recent entries
						delete cache[keys.shift()];
					}
					return (cache[key + " "] = value);
				}
				return cache;
			}

			/**
			 * Mark a function for special use by Sizzle
			 * @param {Function} fn The function to mark
			 */
			function markFunction(fn) {
				fn[expando] = true;
				return fn;
			}

			/**
			 * Support testing using an element
			 * @param {Function} fn Passed the created element and returns a boolean result
			 */
			function assert(fn) {
				var el = document.createElement("fieldset");

				try {
					return !!fn(el);
				} catch (e) {
					return false;
				} finally {
					// Remove from its parent by default
					if (el.parentNode) {
						el.parentNode.removeChild(el);
					}
					// release memory in IE
					el = null;
				}
			}

			/**
			 * Adds the same handler for all of the specified attrs
			 * @param {String} attrs Pipe-separated list of attributes
			 * @param {Function} handler The method that will be applied
			 */
			function addHandle(attrs, handler) {
				var arr = attrs.split("|"),
					i = arr.length;

				while (i--) {
					Expr.attrHandle[arr[i]] = handler;
				}
			}

			/**
			 * Checks document order of two siblings
			 * @param {Element} a
			 * @param {Element} b
			 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
			 */
			function siblingCheck(a, b) {
				var cur = b && a,
					diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
						a.sourceIndex - b.sourceIndex;

				// Use IE sourceIndex if available on both nodes
				if (diff) {
					return diff;
				}

				// Check if b follows a
				if (cur) {
					while ((cur = cur.nextSibling)) {
						if (cur === b) {
							return -1;
						}
					}
				}

				return a ? 1 : -1;
			}

			/**
			 * Returns a function to use in pseudos for input types
			 * @param {String} type
			 */
			function createInputPseudo(type) {
				return function (elem) {
					var name = elem.nodeName.toLowerCase();
					return name === "input" && elem.type === type;
				};
			}

			/**
			 * Returns a function to use in pseudos for buttons
			 * @param {String} type
			 */
			function createButtonPseudo(type) {
				return function (elem) {
					var name = elem.nodeName.toLowerCase();
					return (name === "input" || name === "button") && elem.type === type;
				};
			}

			/**
			 * Returns a function to use in pseudos for :enabled/:disabled
			 * @param {Boolean} disabled true for :disabled; false for :enabled
			 */
			function createDisabledPseudo(disabled) {

				// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
				return function (elem) {

					// Only certain elements can match :enabled or :disabled
					// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
					// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
					if ("form" in elem) {

						// Check for inherited disabledness on relevant non-disabled elements:
						// * listed form-associated elements in a disabled fieldset
						//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
						//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
						// * option elements in a disabled optgroup
						//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
						// All such elements have a "form" property.
						if (elem.parentNode && elem.disabled === false) {

							// Option elements defer to a parent optgroup if present
							if ("label" in elem) {
								if ("label" in elem.parentNode) {
									return elem.parentNode.disabled === disabled;
								} else {
									return elem.disabled === disabled;
								}
							}

							// Support: IE 6 - 11
							// Use the isDisabled shortcut property to check for disabled fieldset ancestors
							return elem.isDisabled === disabled ||

								// Where there is no isDisabled, check manually
								/* jshint -W018 */
								elem.isDisabled !== !disabled &&
								disabledAncestor(elem) === disabled;
						}

						return elem.disabled === disabled;

						// Try to winnow out elements that can't be disabled before trusting the disabled property.
						// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
						// even exist on them, let alone have a boolean value.
					} else if ("label" in elem) {
						return elem.disabled === disabled;
					}

					// Remaining elements are neither :enabled nor :disabled
					return false;
				};
			}

			/**
			 * Returns a function to use in pseudos for positionals
			 * @param {Function} fn
			 */
			function createPositionalPseudo(fn) {
				return markFunction(function (argument) {
					argument = +argument;
					return markFunction(function (seed, matches) {
						var j,
							matchIndexes = fn([], seed.length, argument),
							i = matchIndexes.length;

						// Match elements found at the specified indexes
						while (i--) {
							if (seed[(j = matchIndexes[i])]) {
								seed[j] = !(matches[j] = seed[j]);
							}
						}
					});
				});
			}

			/**
			 * Checks a node for validity as a Sizzle context
			 * @param {Element|Object=} context
			 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
			 */
			function testContext(context) {
				return context && typeof context.getElementsByTagName !== "undefined" && context;
			}

			// Expose support vars for convenience
			support = Sizzle.support = {};

			/**
			 * Detects XML nodes
			 * @param {Element|Object} elem An element or a document
			 * @returns {Boolean} True iff elem is a non-HTML XML node
			 */
			isXML = Sizzle.isXML = function (elem) {
				// documentElement is verified for cases where it doesn't yet exist
				// (such as loading iframes in IE - #4833)
				var documentElement = elem && (elem.ownerDocument || elem).documentElement;
				return documentElement ? documentElement.nodeName !== "HTML" : false;
			};

			/**
			 * Sets document-related variables once based on the current document
			 * @param {Element|Object} [doc] An element or document object to use to set the document
			 * @returns {Object} Returns the current document
			 */
			setDocument = Sizzle.setDocument = function (node) {
				var hasCompare, subWindow,
					doc = node ? node.ownerDocument || node : preferredDoc;

				// Return early if doc is invalid or already selected
				if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
					return document;
				}

				// Update global variables
				document = doc;
				docElem = document.documentElement;
				documentIsHTML = !isXML(document);

				// Support: IE 9-11, Edge
				// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
				if (preferredDoc !== document &&
					(subWindow = document.defaultView) && subWindow.top !== subWindow) {

					// Support: IE 11, Edge
					if (subWindow.addEventListener) {
						subWindow.addEventListener("unload", unloadHandler, false);

						// Support: IE 9 - 10 only
					} else if (subWindow.attachEvent) {
						subWindow.attachEvent("onunload", unloadHandler);
					}
				}

				/* Attributes
				---------------------------------------------------------------------- */

				// Support: IE<8
				// Verify that getAttribute really returns attributes and not properties
				// (excepting IE8 booleans)
				support.attributes = assert(function (el) {
					el.className = "i";
					return !el.getAttribute("className");
				});

				/* getElement(s)By*
				---------------------------------------------------------------------- */

				// Check if getElementsByTagName("*") returns only elements
				support.getElementsByTagName = assert(function (el) {
					el.appendChild(document.createComment(""));
					return !el.getElementsByTagName("*").length;
				});

				// Support: IE<9
				support.getElementsByClassName = rnative.test(document.getElementsByClassName);

				// Support: IE<10
				// Check if getElementById returns elements by name
				// The broken getElementById methods don't pick up programmatically-set names,
				// so use a roundabout getElementsByName test
				support.getById = assert(function (el) {
					docElem.appendChild(el).id = expando;
					return !document.getElementsByName || !document.getElementsByName(expando).length;
				});

				// ID filter and find
				if (support.getById) {
					Expr.filter["ID"] = function (id) {
						var attrId = id.replace(runescape, funescape);
						return function (elem) {
							return elem.getAttribute("id") === attrId;
						};
					};
					Expr.find["ID"] = function (id, context) {
						if (typeof context.getElementById !== "undefined" && documentIsHTML) {
							var elem = context.getElementById(id);
							return elem ? [elem] : [];
						}
					};
				} else {
					Expr.filter["ID"] = function (id) {
						var attrId = id.replace(runescape, funescape);
						return function (elem) {
							var node = typeof elem.getAttributeNode !== "undefined" &&
								elem.getAttributeNode("id");
							return node && node.value === attrId;
						};
					};

					// Support: IE 6 - 7 only
					// getElementById is not reliable as a find shortcut
					Expr.find["ID"] = function (id, context) {
						if (typeof context.getElementById !== "undefined" && documentIsHTML) {
							var node, i, elems,
								elem = context.getElementById(id);

							if (elem) {

								// Verify the id attribute
								node = elem.getAttributeNode("id");
								if (node && node.value === id) {
									return [elem];
								}

								// Fall back on getElementsByName
								elems = context.getElementsByName(id);
								i = 0;
								while ((elem = elems[i++])) {
									node = elem.getAttributeNode("id");
									if (node && node.value === id) {
										return [elem];
									}
								}
							}

							return [];
						}
					};
				}

				// Tag
				Expr.find["TAG"] = support.getElementsByTagName ?
					function (tag, context) {
						if (typeof context.getElementsByTagName !== "undefined") {
							return context.getElementsByTagName(tag);

							// DocumentFragment nodes don't have gEBTN
						} else if (support.qsa) {
							return context.querySelectorAll(tag);
						}
					} :

					function (tag, context) {
						var elem,
							tmp = [],
							i = 0,
							// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
							results = context.getElementsByTagName(tag);

						// Filter out possible comments
						if (tag === "*") {
							while ((elem = results[i++])) {
								if (elem.nodeType === 1) {
									tmp.push(elem);
								}
							}

							return tmp;
						}
						return results;
					};

				// Class
				Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
					if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
						return context.getElementsByClassName(className);
					}
				};

				/* QSA/matchesSelector
				---------------------------------------------------------------------- */

				// QSA and matchesSelector support

				// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
				rbuggyMatches = [];


				rbuggyQSA = [];

				if ((support.qsa = rnative.test(document.querySelectorAll))) {
					// Build QSA regex
					// Regex strategy adopted from Diego Perini
					assert(function (el) {
						// Select is set to empty string on purpose
						// This is to test IE's treatment of not explicitly
						// setting a boolean content attribute,
						// since its presence should be enough
						// https://bugs.jquery.com/ticket/12359
						docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a>" +
							"<select id='" + expando + "-\r\\' msallowcapture=''>" +
							"<option selected=''></option></select>";

						// Support: IE8, Opera 11-12.16
						// Nothing should be selected when empty strings follow ^= or $= or *=
						// The test attribute must be unknown in Opera but "safe" for WinRT
						// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
						if (el.querySelectorAll("[msallowcapture^='']").length) {
							rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
						}

						// Support: IE8
						// Boolean attributes and "value" are not treated correctly
						if (!el.querySelectorAll("[selected]").length) {
							rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
						}

						// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
						if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
							rbuggyQSA.push("~=");
						}

						// Webkit/Opera - :checked should return selected option elements
						// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
						// IE8 throws error here and will not see later tests
						if (!el.querySelectorAll(":checked").length) {
							rbuggyQSA.push(":checked");
						}

				
						if (!el.querySelectorAll("a#" + expando + "+*").length) {
							rbuggyQSA.push(".#.+[+~]");
						}
					});

					assert(function (el) {
						el.innerHTML = "<a href='' disabled='disabled'></a>" +
							"<select disabled='disabled'><option/></select>";

						// Support: Windows 8 Native Apps
						// The type and name attributes are restricted during .innerHTML assignment
						var input = document.createElement("input");
						input.setAttribute("type", "hidden");
						el.appendChild(input).setAttribute("name", "D");

						// Support: IE8
						// Enforce case-sensitivity of name attribute
						if (el.querySelectorAll("[name=d]").length) {
							rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
						}

						// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
						// IE8 throws error here and will not see later tests
						if (el.querySelectorAll(":enabled").length !== 2) {
							rbuggyQSA.push(":enabled", ":disabled");
						}

						// Support: IE9-11+
						// IE's :disabled selector does not pick up the children of disabled fieldsets
						docElem.appendChild(el).disabled = true;
						if (el.querySelectorAll(":disabled").length !== 2) {
							rbuggyQSA.push(":enabled", ":disabled");
						}

						// Opera 10-11 does not throw on post-comma invalid pseudos
						el.querySelectorAll("*,:x");
						rbuggyQSA.push(",.*:");
					});
				}

				if ((support.matchesSelector = rnative.test((matches = docElem.matches ||
					docElem.webkitMatchesSelector ||
					docElem.mozMatchesSelector ||
					docElem.oMatchesSelector ||
					docElem.msMatchesSelector)))) {

					assert(function (el) {
						// Check to see if it's possible to do matchesSelector
						// on a disconnected node (IE 9)
						support.disconnectedMatch = matches.call(el, "*");

						// This should fail with an exception
						// Gecko does not error, returns false instead
						matches.call(el, "[s!='']:x");
						rbuggyMatches.push("!=", pseudos);
					});
				}

				rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
				rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

				/* Contains
				---------------------------------------------------------------------- */
				hasCompare = rnative.test(docElem.compareDocumentPosition);

				// Element contains another
				// Purposefully self-exclusive
				// As in, an element does not contain itself
				contains = hasCompare || rnative.test(docElem.contains) ?
					function (a, b) {
						var adown = a.nodeType === 9 ? a.documentElement : a,
							bup = b && b.parentNode;
						return a === bup || !!(bup && bup.nodeType === 1 && (
							adown.contains ?
								adown.contains(bup) :
								a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
						));
					} :
					function (a, b) {
						if (b) {
							while ((b = b.parentNode)) {
								if (b === a) {
									return true;
								}
							}
						}
						return false;
					};

				/* Sorting
				---------------------------------------------------------------------- */

				// Document order sorting
				sortOrder = hasCompare ?
					function (a, b) {

						// Flag for duplicate removal
						if (a === b) {
							hasDuplicate = true;
							return 0;
						}

						// Sort on method existence if only one input has compareDocumentPosition
						var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
						if (compare) {
							return compare;
						}

						// Calculate position if both inputs belong to the same document
						compare = (a.ownerDocument || a) === (b.ownerDocument || b) ?
							a.compareDocumentPosition(b) :

							// Otherwise we know they are disconnected
							1;

						// Disconnected nodes
						if (compare & 1 ||
							(!support.sortDetached && b.compareDocumentPosition(a) === compare)) {

							// Choose the first element that is related to our preferred document
							if (a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
								return -1;
							}
							if (b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
								return 1;
							}

							// Maintain original order
							return sortInput ?
								(indexOf(sortInput, a) - indexOf(sortInput, b)) :
								0;
						}

						return compare & 4 ? -1 : 1;
					} :
					function (a, b) {
						// Exit early if the nodes are identical
						if (a === b) {
							hasDuplicate = true;
							return 0;
						}

						var cur,
							i = 0,
							aup = a.parentNode,
							bup = b.parentNode,
							ap = [a],
							bp = [b];

						// Parentless nodes are either documents or disconnected
						if (!aup || !bup) {
							return a === document ? -1 :
								b === document ? 1 :
									aup ? -1 :
										bup ? 1 :
											sortInput ?
												(indexOf(sortInput, a) - indexOf(sortInput, b)) :
												0;

							// If the nodes are siblings, we can do a quick check
						} else if (aup === bup) {
							return siblingCheck(a, b);
						}

						// Otherwise we need full lists of their ancestors for comparison
						cur = a;
						while ((cur = cur.parentNode)) {
							ap.unshift(cur);
						}
						cur = b;
						while ((cur = cur.parentNode)) {
							bp.unshift(cur);
						}

						// Walk down the tree looking for a discrepancy
						while (ap[i] === bp[i]) {
							i++;
						}

						return i ?
							// Do a sibling check if the nodes have a common ancestor
							siblingCheck(ap[i], bp[i]) :

							// Otherwise nodes in our document sort first
							ap[i] === preferredDoc ? -1 :
								bp[i] === preferredDoc ? 1 :
									0;
					};

				return document;
			};

			Sizzle.matches = function (expr, elements) {
				return Sizzle(expr, null, null, elements);
			};

			Sizzle.matchesSelector = function (elem, expr) {
				// Set document vars if needed
				if ((elem.ownerDocument || elem) !== document) {
					setDocument(elem);
				}

				// Make sure that attribute selectors are quoted
				expr = expr.replace(rattributeQuotes, "='$1']");

				if (support.matchesSelector && documentIsHTML &&
					!compilerCache[expr + " "] &&
					(!rbuggyMatches || !rbuggyMatches.test(expr)) &&
					(!rbuggyQSA || !rbuggyQSA.test(expr))) {

					try {
						var ret = matches.call(elem, expr);

						// IE 9's matchesSelector returns false on disconnected nodes
						if (ret || support.disconnectedMatch ||
							// As well, disconnected nodes are said to be in a document
							// fragment in IE 9
							elem.document && elem.document.nodeType !== 11) {
							return ret;
						}
					} catch (e) { }
				}

				return Sizzle(expr, document, null, [elem]).length > 0;
			};

			Sizzle.contains = function (context, elem) {
				// Set document vars if needed
				if ((context.ownerDocument || context) !== document) {
					setDocument(context);
				}
				return contains(context, elem);
			};

			Sizzle.attr = function (elem, name) {
				// Set document vars if needed
				if ((elem.ownerDocument || elem) !== document) {
					setDocument(elem);
				}

				var fn = Expr.attrHandle[name.toLowerCase()],
					// Don't get fooled by Object.prototype properties (jQuery #13807)
					val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ?
						fn(elem, name, !documentIsHTML) :
						undefined;

				return val !== undefined ?
					val :
					support.attributes || !documentIsHTML ?
						elem.getAttribute(name) :
						(val = elem.getAttributeNode(name)) && val.specified ?
							val.value :
							null;
			};

			Sizzle.escape = function (sel) {
				return (sel + "").replace(rcssescape, fcssescape);
			};

			Sizzle.error = function (msg) {
				throw new Error("Syntax error, unrecognized expression: " + msg);
			};

			/**
			 * Document sorting and removing duplicates
			 * @param {ArrayLike} results
			 */
			Sizzle.uniqueSort = function (results) {
				var elem,
					duplicates = [],
					j = 0,
					i = 0;

				// Unless we *know* we can detect duplicates, assume their presence
				hasDuplicate = !support.detectDuplicates;
				sortInput = !support.sortStable && results.slice(0);
				results.sort(sortOrder);

				if (hasDuplicate) {
					while ((elem = results[i++])) {
						if (elem === results[i]) {
							j = duplicates.push(i);
						}
					}
					while (j--) {
						results.splice(duplicates[j], 1);
					}
				}

				// Clear input after sorting to release objects
				// See https://github.com/jquery/sizzle/pull/225
				sortInput = null;

				return results;
			};

			/**
			 * Utility function for retrieving the text value of an array of DOM nodes
			 * @param {Array|Element} elem
			 */
			getText = Sizzle.getText = function (elem) {
				var node,
					ret = "",
					i = 0,
					nodeType = elem.nodeType;

				if (!nodeType) {
					// If no nodeType, this is expected to be an array
					while ((node = elem[i++])) {
						// Do not traverse comment nodes
						ret += getText(node);
					}
				} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
					// Use textContent for elements
					// innerText usage removed for consistency of new lines (jQuery #11153)
					if (typeof elem.textContent === "string") {
						return elem.textContent;
					} else {
						// Traverse its children
						for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
							ret += getText(elem);
						}
					}
				} else if (nodeType === 3 || nodeType === 4) {
					return elem.nodeValue;
				}
				// Do not include comment or processing instruction nodes

				return ret;
			};

			Expr = Sizzle.selectors = {

				// Can be adjusted by the user
				cacheLength: 50,

				createPseudo: markFunction,

				match: matchExpr,

				attrHandle: {},

				find: {},

				relative: {
					">": { dir: "parentNode", first: true },
					" ": { dir: "parentNode" },
					"+": { dir: "previousSibling", first: true },
					"~": { dir: "previousSibling" }
				},

				preFilter: {
					"ATTR": function (match) {
						match[1] = match[1].replace(runescape, funescape);

						// Move the given value to match[3] whether quoted or unquoted
						match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

						if (match[2] === "~=") {
							match[3] = " " + match[3] + " ";
						}

						return match.slice(0, 4);
					},

					"CHILD": function (match) {
						/* matches from matchExpr["CHILD"]
							1 type (only|nth|...)
							2 what (child|of-type)
							3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
							4 xn-component of xn+y argument ([+-]?\d*n|)
							5 sign of xn-component
							6 x of xn-component
							7 sign of y-component
							8 y of y-component
						*/
						match[1] = match[1].toLowerCase();

						if (match[1].slice(0, 3) === "nth") {
							// nth-* requires argument
							if (!match[3]) {
								Sizzle.error(match[0]);
							}

							// numeric x and y parameters for Expr.filter.CHILD
							// remember that false/true cast respectively to 0/1
							match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
							match[5] = +((match[7] + match[8]) || match[3] === "odd");

							// other types prohibit arguments
						} else if (match[3]) {
							Sizzle.error(match[0]);
						}

						return match;
					},

					"PSEUDO": function (match) {
						var excess,
							unquoted = !match[6] && match[2];

						if (matchExpr["CHILD"].test(match[0])) {
							return null;
						}

						// Accept quoted arguments as-is
						if (match[3]) {
							match[2] = match[4] || match[5] || "";

							// Strip excess characters from unquoted arguments
						} else if (unquoted && rpseudo.test(unquoted) &&
							// Get excess from tokenize (recursively)
							(excess = tokenize(unquoted, true)) &&
							// advance to the next closing parenthesis
							(excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

							// excess is a negative index
							match[0] = match[0].slice(0, excess);
							match[2] = unquoted.slice(0, excess);
						}

						// Return only captures needed by the pseudo filter method (type and argument)
						return match.slice(0, 3);
					}
				},

				filter: {

					"TAG": function (nodeNameSelector) {
						var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
						return nodeNameSelector === "*" ?
							function () { return true; } :
							function (elem) {
								return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
							};
					},

					"CLASS": function (className) {
						var pattern = classCache[className + " "];

						return pattern ||
							(pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) &&
							classCache(className, function (elem) {
								return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
							});
					},

					"ATTR": function (name, operator, check) {
						return function (elem) {
							var result = Sizzle.attr(elem, name);

							if (result == null) {
								return operator === "!=";
							}
							if (!operator) {
								return true;
							}

							result += "";

							return operator === "=" ? result === check :
								operator === "!=" ? result !== check :
									operator === "^=" ? check && result.indexOf(check) === 0 :
										operator === "*=" ? check && result.indexOf(check) > -1 :
											operator === "$=" ? check && result.slice(-check.length) === check :
												operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 :
													operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" :
														false;
						};
					},

					"CHILD": function (type, what, argument, first, last) {
						var simple = type.slice(0, 3) !== "nth",
							forward = type.slice(-4) !== "last",
							ofType = what === "of-type";

						return first === 1 && last === 0 ?

							// Shortcut for :nth-*(n)
							function (elem) {
								return !!elem.parentNode;
							} :

							function (elem, context, xml) {
								var cache, uniqueCache, outerCache, node, nodeIndex, start,
									dir = simple !== forward ? "nextSibling" : "previousSibling",
									parent = elem.parentNode,
									name = ofType && elem.nodeName.toLowerCase(),
									useCache = !xml && !ofType,
									diff = false;

								if (parent) {

									// :(first|last|only)-(child|of-type)
									if (simple) {
										while (dir) {
											node = elem;
											while ((node = node[dir])) {
												if (ofType ?
													node.nodeName.toLowerCase() === name :
													node.nodeType === 1) {

													return false;
												}
											}
											// Reverse direction for :only-* (if we haven't yet done so)
											start = dir = type === "only" && !start && "nextSibling";
										}
										return true;
									}

									start = [forward ? parent.firstChild : parent.lastChild];

									
									if (forward && useCache) {

										node = parent;
										outerCache = node[expando] || (node[expando] = {});

										// Support: IE <9 only
										// Defend against cloned attroperties (jQuery gh-1709)
										uniqueCache = outerCache[node.uniqueID] ||
											(outerCache[node.uniqueID] = {});

										cache = uniqueCache[type] || [];
										nodeIndex = cache[0] === dirruns && cache[1];
										diff = nodeIndex && cache[2];
										node = nodeIndex && parent.childNodes[nodeIndex];

										while ((node = ++nodeIndex && node && node[dir] ||
											(diff = nodeIndex = 0) || start.pop())) {

											if (node.nodeType === 1 && ++diff && node === elem) {
												uniqueCache[type] = [dirruns, nodeIndex, diff];
												break;
											}
										}

									} else {
										// Use previously-cached element index if available
										if (useCache) {
											// ...in a gzip-friendly way
											node = elem;
											outerCache = node[expando] || (node[expando] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[node.uniqueID] ||
												(outerCache[node.uniqueID] = {});

											cache = uniqueCache[type] || [];
											nodeIndex = cache[0] === dirruns && cache[1];
											diff = nodeIndex;
										}

										// xml :nth-child(...)
										// or :nth-last-child(...) or :nth(-last)?-of-type(...)
										if (diff === false) {
											while ((node = ++nodeIndex && node && node[dir] ||
												(diff = nodeIndex = 0) || start.pop())) {

												if ((ofType ?
													node.nodeName.toLowerCase() === name :
													node.nodeType === 1) &&
													++diff) {

													// Cache the index of each encountered element
													if (useCache) {
														outerCache = node[expando] || (node[expando] = {});

														// Support: IE <9 only
														// Defend against cloned attroperties (jQuery gh-1709)
														uniqueCache = outerCache[node.uniqueID] ||
															(outerCache[node.uniqueID] = {});

														uniqueCache[type] = [dirruns, diff];
													}

													if (node === elem) {
														break;
													}
												}
											}
										}
									}

									// Incorporate the offset, then check against cycle size
									diff -= last;
									return diff === first || (diff % first === 0 && diff / first >= 0);
								}
							};
					},

					"PSEUDO": function (pseudo, argument) {
						// pseudo-class names are case-insensitive
						// http://www.w3.org/TR/selectors/#pseudo-classes
						// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
						// Remember that setFilters inherits from pseudos
						var args,
							fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] ||
								Sizzle.error("unsupported pseudo: " + pseudo);

						// The user may use createPseudo to indicate that
						// arguments are needed to create the filter function
						// just as Sizzle does
						if (fn[expando]) {
							return fn(argument);
						}

						// But maintain support for old signatures
						if (fn.length > 1) {
							args = [pseudo, pseudo, "", argument];
							return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ?
								markFunction(function (seed, matches) {
									var idx,
										matched = fn(seed, argument),
										i = matched.length;
									while (i--) {
										idx = indexOf(seed, matched[i]);
										seed[idx] = !(matches[idx] = matched[i]);
									}
								}) :
								function (elem) {
									return fn(elem, 0, args);
								};
						}

						return fn;
					}
				},

				pseudos: {
					// Potentially complex pseudos
					"not": markFunction(function (selector) {
						// Trim the selector passed to compile
						// to avoid treating leading and trailing
						// spaces as combinators
						var input = [],
							results = [],
							matcher = compile(selector.replace(rtrim, "$1"));

						return matcher[expando] ?
							markFunction(function (seed, matches, context, xml) {
								var elem,
									unmatched = matcher(seed, null, xml, []),
									i = seed.length;

								while (i--) {
									if ((elem = unmatched[i])) {
										seed[i] = !(matches[i] = elem);
									}
								}
							}) :
							function (elem, context, xml) {
								input[0] = elem;
								matcher(input, null, xml, results);
								// Don't keep the element (issue #299)
								input[0] = null;
								return !results.pop();
							};
					}),

					"has": markFunction(function (selector) {
						return function (elem) {
							return Sizzle(selector, elem).length > 0;
						};
					}),

					"contains": markFunction(function (text) {
						text = text.replace(runescape, funescape);
						return function (elem) {
							return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
						};
					}),

					// "Whether an element is represented by a :lang() selector
					// is based solely on the element's language value
					// being equal to the identifier C,
					// or beginning with the identifier C immediately followed by "-".
					// The matching of C against the element's language value is performed case-insensitively.
					// The identifier C does not have to be a valid language name."
					// http://www.w3.org/TR/selectors/#lang-pseudo
					"lang": markFunction(function (lang) {
						// lang value must be a valid identifier
						if (!ridentifier.test(lang || "")) {
							Sizzle.error("unsupported lang: " + lang);
						}
						lang = lang.replace(runescape, funescape).toLowerCase();
						return function (elem) {
							var elemLang;
							do {
								if ((elemLang = documentIsHTML ?
									elem.lang :
									elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {

									elemLang = elemLang.toLowerCase();
									return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
								}
							} while ((elem = elem.parentNode) && elem.nodeType === 1);
							return false;
						};
					}),

					// Miscellaneous
					"target": function (elem) {
						var hash = window.location && window.location.hash;
						return hash && hash.slice(1) === elem.id;
					},

					"root": function (elem) {
						return elem === docElem;
					},

					"focus": function (elem) {
						return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
					},

					// Boolean properties
					"enabled": createDisabledPseudo(false),
					"disabled": createDisabledPseudo(true),

					"checked": function (elem) {
						// In CSS3, :checked should return both checked and selected elements
						// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
						var nodeName = elem.nodeName.toLowerCase();
						return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
					},

					"selected": function (elem) {
						// Accessing this property makes selected-by-default
						// options in Safari work properly
						if (elem.parentNode) {
							elem.parentNode.selectedIndex;
						}

						return elem.selected === true;
					},

					// Contents
					"empty": function (elem) {
						// http://www.w3.org/TR/selectors/#empty-pseudo
						// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
						//   but not by others (comment: 8; processing instruction: 7; etc.)
						// nodeType < 6 works because attributes (2) do not appear as children
						for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
							if (elem.nodeType < 6) {
								return false;
							}
						}
						return true;
					},

					"parent": function (elem) {
						return !Expr.pseudos["empty"](elem);
					},

					// Element/input types
					"header": function (elem) {
						return rheader.test(elem.nodeName);
					},

					"input": function (elem) {
						return rinputs.test(elem.nodeName);
					},

					"button": function (elem) {
						var name = elem.nodeName.toLowerCase();
						return name === "input" && elem.type === "button" || name === "button";
					},

					"text": function (elem) {
						var attr;
						return elem.nodeName.toLowerCase() === "input" &&
							elem.type === "text" &&

							// Support: IE<8
							// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
							((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
					},

					// Position-in-collection
					"first": createPositionalPseudo(function () {
						return [0];
					}),

					"last": createPositionalPseudo(function (matchIndexes, length) {
						return [length - 1];
					}),

					"eq": createPositionalPseudo(function (matchIndexes, length, argument) {
						return [argument < 0 ? argument + length : argument];
					}),

					"even": createPositionalPseudo(function (matchIndexes, length) {
						var i = 0;
						for (; i < length; i += 2) {
							matchIndexes.push(i);
						}
						return matchIndexes;
					}),

					"odd": createPositionalPseudo(function (matchIndexes, length) {
						var i = 1;
						for (; i < length; i += 2) {
							matchIndexes.push(i);
						}
						return matchIndexes;
					}),

					"lt": createPositionalPseudo(function (matchIndexes, length, argument) {
						var i = argument < 0 ? argument + length : argument;
						for (; --i >= 0;) {
							matchIndexes.push(i);
						}
						return matchIndexes;
					}),

					"gt": createPositionalPseudo(function (matchIndexes, length, argument) {
						var i = argument < 0 ? argument + length : argument;
						for (; ++i < length;) {
							matchIndexes.push(i);
						}
						return matchIndexes;
					})
				}
			};

			Expr.pseudos["nth"] = Expr.pseudos["eq"];

			// Add button/input type pseudos
			for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
				Expr.pseudos[i] = createInputPseudo(i);
			}
			for (i in { submit: true, reset: true }) {
				Expr.pseudos[i] = createButtonPseudo(i);
			}

			// Easy API for creating new setFilters
			function setFilters() { }
			setFilters.prototype = Expr.filters = Expr.pseudos;
			Expr.setFilters = new setFilters();

			tokenize = Sizzle.tokenize = function (selector, parseOnly) {
				var matched, match, tokens, type,
					soFar, groups, preFilters,
					cached = tokenCache[selector + " "];

				if (cached) {
					return parseOnly ? 0 : cached.slice(0);
				}

				soFar = selector;
				groups = [];
				preFilters = Expr.preFilter;

				while (soFar) {

					// Comma and first run
					if (!matched || (match = rcomma.exec(soFar))) {
						if (match) {
							// Don't consume trailing commas as valid
							soFar = soFar.slice(match[0].length) || soFar;
						}
						groups.push((tokens = []));
					}

					matched = false;

					// Combinators
					if ((match = rcombinators.exec(soFar))) {
						matched = match.shift();
						tokens.push({
							value: matched,
							// Cast descendant combinators to space
							type: match[0].replace(rtrim, " ")
						});
						soFar = soFar.slice(matched.length);
					}

					// Filters
					for (type in Expr.filter) {
						if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] ||
							(match = preFilters[type](match)))) {
							matched = match.shift();
							tokens.push({
								value: matched,
								type: type,
								matches: match
							});
							soFar = soFar.slice(matched.length);
						}
					}

					if (!matched) {
						break;
					}
				}

				// Return the length of the invalid excess
				// if we're just parsing
				// Otherwise, throw an error or return tokens
				return parseOnly ?
					soFar.length :
					soFar ?
						Sizzle.error(selector) :
						// Cache the tokens
						tokenCache(selector, groups).slice(0);
			};

			function toSelector(tokens) {
				var i = 0,
					len = tokens.length,
					selector = "";
				for (; i < len; i++) {
					selector += tokens[i].value;
				}
				return selector;
			}

			function addCombinator(matcher, combinator, base) {
				var dir = combinator.dir,
					skip = combinator.next,
					key = skip || dir,
					checkNonElements = base && key === "parentNode",
					doneName = done++;

				return combinator.first ?
					// Check against closest ancestor/preceding element
					function (elem, context, xml) {
						while ((elem = elem[dir])) {
							if (elem.nodeType === 1 || checkNonElements) {
								return matcher(elem, context, xml);
							}
						}
						return false;
					} :

					// Check against all ancestor/preceding elements
					function (elem, context, xml) {
						var oldCache, uniqueCache, outerCache,
							newCache = [dirruns, doneName];

						// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
						if (xml) {
							while ((elem = elem[dir])) {
								if (elem.nodeType === 1 || checkNonElements) {
									if (matcher(elem, context, xml)) {
										return true;
									}
								}
							}
						} else {
							while ((elem = elem[dir])) {
								if (elem.nodeType === 1 || checkNonElements) {
									outerCache = elem[expando] || (elem[expando] = {});

									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});

									if (skip && skip === elem.nodeName.toLowerCase()) {
										elem = elem[dir] || elem;
									} else if ((oldCache = uniqueCache[key]) &&
										oldCache[0] === dirruns && oldCache[1] === doneName) {

										// Assign to newCache so results back-propagate to previous elements
										return (newCache[2] = oldCache[2]);
									} else {
										// Reuse newcache so results back-propagate to previous elements
										uniqueCache[key] = newCache;

										// A match means we're done; a fail means we have to keep checking
										if ((newCache[2] = matcher(elem, context, xml))) {
											return true;
										}
									}
								}
							}
						}
						return false;
					};
			}

			function elementMatcher(matchers) {
				return matchers.length > 1 ?
					function (elem, context, xml) {
						var i = matchers.length;
						while (i--) {
							if (!matchers[i](elem, context, xml)) {
								return false;
							}
						}
						return true;
					} :
					matchers[0];
			}

			function multipleContexts(selector, contexts, results) {
				var i = 0,
					len = contexts.length;
				for (; i < len; i++) {
					Sizzle(selector, contexts[i], results);
				}
				return results;
			}

			function condense(unmatched, map, filter, context, xml) {
				var elem,
					newUnmatched = [],
					i = 0,
					len = unmatched.length,
					mapped = map != null;

				for (; i < len; i++) {
					if ((elem = unmatched[i])) {
						if (!filter || filter(elem, context, xml)) {
							newUnmatched.push(elem);
							if (mapped) {
								map.push(i);
							}
						}
					}
				}

				return newUnmatched;
			}

			function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
				if (postFilter && !postFilter[expando]) {
					postFilter = setMatcher(postFilter);
				}
				if (postFinder && !postFinder[expando]) {
					postFinder = setMatcher(postFinder, postSelector);
				}
				return markFunction(function (seed, results, context, xml) {
					var temp, i, elem,
						preMap = [],
						postMap = [],
						preexisting = results.length,

						// Get initial elements from seed or context
						elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),

						// Prefilter to get matcher input, preserving a map for seed-results synchronization
						matcherIn = preFilter && (seed || !selector) ?
							condense(elems, preMap, preFilter, context, xml) :
							elems,

						matcherOut = matcher ?
							// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
							postFinder || (seed ? preFilter : preexisting || postFilter) ?

								// ...intermediate processing is necessary
								[] :

								// ...otherwise use results directly
								results :
							matcherIn;

					// Find primary matches
					if (matcher) {
						matcher(matcherIn, matcherOut, context, xml);
					}

					// Apply postFilter
					if (postFilter) {
						temp = condense(matcherOut, postMap);
						postFilter(temp, [], context, xml);

						// Un-match failing elements by moving them back to matcherIn
						i = temp.length;
						while (i--) {
							if ((elem = temp[i])) {
								matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
							}
						}
					}

					if (seed) {
						if (postFinder || preFilter) {
							if (postFinder) {
								// Get the final matcherOut by condensing this intermediate into postFinder contexts
								temp = [];
								i = matcherOut.length;
								while (i--) {
									if ((elem = matcherOut[i])) {
										// Restore matcherIn since elem is not yet a final match
										temp.push((matcherIn[i] = elem));
									}
								}
								postFinder(null, (matcherOut = []), temp, xml);
							}

							// Move matched elements from seed to results to keep them synchronized
							i = matcherOut.length;
							while (i--) {
								if ((elem = matcherOut[i]) &&
									(temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {

									seed[temp] = !(results[temp] = elem);
								}
							}
						}

						// Add elements to results, through postFinder if defined
					} else {
						matcherOut = condense(
							matcherOut === results ?
								matcherOut.splice(preexisting, matcherOut.length) :
								matcherOut
						);
						if (postFinder) {
							postFinder(null, results, matcherOut, xml);
						} else {
							push.apply(results, matcherOut);
						}
					}
				});
			}

			function matcherFromTokens(tokens) {
				var checkContext, matcher, j,
					len = tokens.length,
					leadingRelative = Expr.relative[tokens[0].type],
					implicitRelative = leadingRelative || Expr.relative[" "],
					i = leadingRelative ? 1 : 0,

					// The foundational matcher ensures that elements are reachable from top-level context(s)
					matchContext = addCombinator(function (elem) {
						return elem === checkContext;
					}, implicitRelative, true),
					matchAnyContext = addCombinator(function (elem) {
						return indexOf(checkContext, elem) > -1;
					}, implicitRelative, true),
					matchers = [function (elem, context, xml) {
						var ret = (!leadingRelative && (xml || context !== outermostContext)) || (
							(checkContext = context).nodeType ?
								matchContext(elem, context, xml) :
								matchAnyContext(elem, context, xml));
						// Avoid hanging onto element (issue #299)
						checkContext = null;
						return ret;
					}];

				for (; i < len; i++) {
					if ((matcher = Expr.relative[tokens[i].type])) {
						matchers = [addCombinator(elementMatcher(matchers), matcher)];
					} else {
						matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

						// Return special upon seeing a positional matcher
						if (matcher[expando]) {
							// Find the next relative operator (if any) for proper handling
							j = ++i;
							for (; j < len; j++) {
								if (Expr.relative[tokens[j].type]) {
									break;
								}
							}
							return setMatcher(
								i > 1 && elementMatcher(matchers),
								i > 1 && toSelector(
									tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })
								).replace(rtrim, "$1"),
								matcher,
								i < j && matcherFromTokens(tokens.slice(i, j)),
								j < len && matcherFromTokens((tokens = tokens.slice(j))),
								j < len && toSelector(tokens)
							);
						}
						matchers.push(matcher);
					}
				}

				return elementMatcher(matchers);
			}

			function matcherFromGroupMatchers(elementMatchers, setMatchers) {
				var bySet = setMatchers.length > 0,
					byElement = elementMatchers.length > 0,
					superMatcher = function (seed, context, xml, results, outermost) {
						var elem, j, matcher,
							matchedCount = 0,
							i = "0",
							unmatched = seed && [],
							setMatched = [],
							contextBackup = outermostContext,
							// We must always have either seed elements or outermost context
							elems = seed || byElement && Expr.find["TAG"]("*", outermost),
							// Use integer dirruns iff this is the outermost matcher
							dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
							len = elems.length;

						if (outermost) {
							outermostContext = context === document || context || outermost;
						}

						// Add elements passing elementMatchers directly to results
						// Support: IE<9, Safari
						// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
						for (; i !== len && (elem = elems[i]) != null; i++) {
							if (byElement && elem) {
								j = 0;
								if (!context && elem.ownerDocument !== document) {
									setDocument(elem);
									xml = !documentIsHTML;
								}
								while ((matcher = elementMatchers[j++])) {
									if (matcher(elem, context || document, xml)) {
										results.push(elem);
										break;
									}
								}
								if (outermost) {
									dirruns = dirrunsUnique;
								}
							}

							// Track unmatched elements for set filters
							if (bySet) {
								// They will have gone through all possible matchers
								if ((elem = !matcher && elem)) {
									matchedCount--;
								}

								// Lengthen the array for every element, matched or not
								if (seed) {
									unmatched.push(elem);
								}
							}
						}

						matchedCount += i;

						if (bySet && i !== matchedCount) {
							j = 0;
							while ((matcher = setMatchers[j++])) {
								matcher(unmatched, setMatched, context, xml);
							}

							if (seed) {
								// Reintegrate element matches to eliminate the need for sorting
								if (matchedCount > 0) {
									while (i--) {
										if (!(unmatched[i] || setMatched[i])) {
											setMatched[i] = pop.call(results);
										}
									}
								}

								// Discard index placeholder values to get only actual matches
								setMatched = condense(setMatched);
							}

							// Add matches to results
							push.apply(results, setMatched);

							// Seedless set matches succeeding multiple successful matchers stipulate sorting
							if (outermost && !seed && setMatched.length > 0 &&
								(matchedCount + setMatchers.length) > 1) {

								Sizzle.uniqueSort(results);
							}
						}

						// Override manipulation of globals by nested matchers
						if (outermost) {
							dirruns = dirrunsUnique;
							outermostContext = contextBackup;
						}

						return unmatched;
					};

				return bySet ?
					markFunction(superMatcher) :
					superMatcher;
			}

			compile = Sizzle.compile = function (selector, match /* Internal Use Only */) {
				var i,
					setMatchers = [],
					elementMatchers = [],
					cached = compilerCache[selector + " "];

				if (!cached) {
					// Generate a function of recursive functions that can be used to check each element
					if (!match) {
						match = tokenize(selector);
					}
					i = match.length;
					while (i--) {
						cached = matcherFromTokens(match[i]);
						if (cached[expando]) {
							setMatchers.push(cached);
						} else {
							elementMatchers.push(cached);
						}
					}

					// Cache the compiled function
					cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

					// Save selector and tokenization
					cached.selector = selector;
				}
				return cached;
			};

			/**
			 * A low-level selection function that works with Sizzle's compiled
			 *  selector functions
			 * @param {String|Function} selector A selector or a pre-compiled
			 *  selector function built with Sizzle.compile
			 * @param {Element} context
			 * @param {Array} [results]
			 * @param {Array} [seed] A set of elements to match against
			 */
			select = Sizzle.select = function (selector, context, results, seed) {
				var i, tokens, token, type, find,
					compiled = typeof selector === "function" && selector,
					match = !seed && tokenize((selector = compiled.selector || selector));

				results = results || [];

				// Try to minimize operations if there is only one selector in the list and no seed
				// (the latter of which guarantees us context)
				if (match.length === 1) {

					// Reduce context if the leading compound selector is an ID
					tokens = match[0] = match[0].slice(0);
					if (tokens.length > 2 && (token = tokens[0]).type === "ID" &&
						context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {

						context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
						if (!context) {
							return results;

							// Precompiled matchers will still verify ancestry, so step up a level
						} else if (compiled) {
							context = context.parentNode;
						}

						selector = selector.slice(tokens.shift().value.length);
					}

					// Fetch a seed set for right-to-left matching
					i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
					while (i--) {
						token = tokens[i];

						// Abort if we hit a combinator
						if (Expr.relative[(type = token.type)]) {
							break;
						}
						if ((find = Expr.find[type])) {
							// Search, expanding context for leading sibling combinators
							if ((seed = find(
								token.matches[0].replace(runescape, funescape),
								rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
							))) {

								// If seed is empty or no tokens remain, we can return early
								tokens.splice(i, 1);
								selector = seed.length && toSelector(tokens);
								if (!selector) {
									push.apply(results, seed);
									return results;
								}

								break;
							}
						}
					}
				}
				(compiled || compile(selector, match))(
					seed,
					context,
					!documentIsHTML,
					results,
					!context || rsibling.test(selector) && testContext(context.parentNode) || context
				);
				return results;
			};

			// One-time assignments

			// Sort stability
			support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

			// Support: Chrome 14-35+
			// Always assume duplicates if they aren't passed to the comparison function
			support.detectDuplicates = !!hasDuplicate;

			// Initialize against the default document
			setDocument();

			// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
			// Detached nodes confoundingly follow *each other*
			support.sortDetached = assert(function (el) {
				// Should return 1, but returns 4 (following)
				return el.compareDocumentPosition(document.createElement("fieldset")) & 1;
			});

			// Support: IE<8
			// Prevent attribute/property "interpolation"
			// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
			if (!assert(function (el) {
				el.innerHTML = "<a href='#'></a>";
				return el.firstChild.getAttribute("href") === "#";
			})) {
				addHandle("type|href|height|width", function (elem, name, isXML) {
					if (!isXML) {
						return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
					}
				});
			}

			// Support: IE<9
			// Use defaultValue in place of getAttribute("value")
			if (!support.attributes || !assert(function (el) {
				el.innerHTML = "<input/>";
				el.firstChild.setAttribute("value", "");
				return el.firstChild.getAttribute("value") === "";
			})) {
				addHandle("value", function (elem, name, isXML) {
					if (!isXML && elem.nodeName.toLowerCase() === "input") {
						return elem.defaultValue;
					}
				});
			}

			// Support: IE<9
			// Use getAttributeNode to fetch booleans when getAttribute lies
			if (!assert(function (el) {
				return el.getAttribute("disabled") == null;
			})) {
				addHandle(booleans, function (elem, name, isXML) {
					var val;
					if (!isXML) {
						return elem[name] === true ? name.toLowerCase() :
							(val = elem.getAttributeNode(name)) && val.specified ?
								val.value :
								null;
					}
				});
			}

			return Sizzle;

		})(window);



	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;

	// Deprecated
	jQuery.expr[":"] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	jQuery.escapeSelector = Sizzle.escape;




	var dir = function (elem, dir, until) {
		var matched = [],
			truncate = until !== undefined;

		while ((elem = elem[dir]) && elem.nodeType !== 9) {
			if (elem.nodeType === 1) {
				if (truncate && jQuery(elem).is(until)) {
					break;
				}
				matched.push(elem);
			}
		}
		return matched;
	};


	var siblings = function (n, elem) {
		var matched = [];

		for (; n; n = n.nextSibling) {
			if (n.nodeType === 1 && n !== elem) {
				matched.push(n);
			}
		}

		return matched;
	};


	var rneedsContext = jQuery.expr.match.needsContext;



	function nodeName(elem, name) {

		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

	};

	var risSimple = /^.[^:#\[\.,]*$/;

	// Implement the identical functionality for filter and not
	function winnow(elements, qualifier, not) {
		if (jQuery.isFunction(qualifier)) {
			return jQuery.grep(elements, function (elem, i) {
				return !!qualifier.call(elem, i, elem) !== not;
			});
		}

		// Single element
		if (qualifier.nodeType) {
			return jQuery.grep(elements, function (elem) {
				return (elem === qualifier) !== not;
			});
		}

		// Arraylike of elements (jQuery, arguments, Array)
		if (typeof qualifier !== "string") {
			return jQuery.grep(elements, function (elem) {
				return (indexOf.call(qualifier, elem) > -1) !== not;
			});
		}

		// Simple selector that can be filtered directly, removing non-Elements
		if (risSimple.test(qualifier)) {
			return jQuery.filter(qualifier, elements, not);
		}

		// Complex selector, compare the two sets, removing non-Elements
		qualifier = jQuery.filter(qualifier, elements);
		return jQuery.grep(elements, function (elem) {
			return (indexOf.call(qualifier, elem) > -1) !== not && elem.nodeType === 1;
		});
	}

	jQuery.filter = function (expr, elems, not) {
		var elem = elems[0];

		if (not) {
			expr = ":not(" + expr + ")";
		}

		if (elems.length === 1 && elem.nodeType === 1) {
			return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
		}

		return jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
			return elem.nodeType === 1;
		}));
	};

	jQuery.fn.extend({
		find: function (selector) {
			var i, ret,
				len = this.length,
				self = this;

			if (typeof selector !== "string") {
				return this.pushStack(jQuery(selector).filter(function () {
					for (i = 0; i < len; i++) {
						if (jQuery.contains(self[i], this)) {
							return true;
						}
					}
				}));
			}

			ret = this.pushStack([]);

			for (i = 0; i < len; i++) {
				jQuery.find(selector, self[i], ret);
			}

			return len > 1 ? jQuery.uniqueSort(ret) : ret;
		},
		filter: function (selector) {
			return this.pushStack(winnow(this, selector || [], false));
		},
		not: function (selector) {
			return this.pushStack(winnow(this, selector || [], true));
		},
		is: function (selector) {
			return !!winnow(
				this,

				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test(selector) ?
					jQuery(selector) :
					selector || [],
				false
			).length;
		}
	});


	// Initialize a jQuery object


	// A central reference to the root jQuery(document)
	var rootjQuery,

		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		// Shortcut simple #id case for speed
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

		init = jQuery.fn.init = function (selector, context, root) {
			var match, elem;

			// HANDLE: $(""), $(null), $(undefined), $(false)
			if (!selector) {
				return this;
			}

			// Method init() accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;

			// Handle HTML strings
			if (typeof selector === "string") {
				if (selector[0] === "<" &&
					selector[selector.length - 1] === ">" &&
					selector.length >= 3) {

					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [null, selector, null];

				} else {
					match = rquickExpr.exec(selector);
				}

				// Match html or make sure no context is specified for #id
				if (match && (match[1] || !context)) {

					// HANDLE: $(html) -> $(array)
					if (match[1]) {
						context = context instanceof jQuery ? context[0] : context;

						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge(this, jQuery.parseHTML(
							match[1],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						));

						// HANDLE: $(html, props)
						if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
							for (match in context) {

								// Properties of context are called as methods if possible
								if (jQuery.isFunction(this[match])) {
									this[match](context[match]);

									// ...and otherwise set as attributes
								} else {
									this.attr(match, context[match]);
								}
							}
						}

						return this;

						// HANDLE: $(#id)
					} else {
						elem = document.getElementById(match[2]);

						if (elem) {

							// Inject the element directly into the jQuery object
							this[0] = elem;
							this.length = 1;
						}
						return this;
					}

					// HANDLE: $(expr, $(...))
				} else if (!context || context.jquery) {
					return (context || root).find(selector);

					// HANDLE: $(expr, context)
					// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor(context).find(selector);
				}

				// HANDLE: $(DOMElement)
			} else if (selector.nodeType) {
				this[0] = selector;
				this.length = 1;
				return this;

				// HANDLE: $(function)
				// Shortcut for document ready
			} else if (jQuery.isFunction(selector)) {
				return root.ready !== undefined ?
					root.ready(selector) :

					// Execute immediately if ready is not present
					selector(jQuery);
			}

			return jQuery.makeArray(selector, this);
		};

	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery(document);


	var rparentsprev = /^(?:parents|prev(?:Until|All))/,

		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};

	jQuery.fn.extend({
		has: function (target) {
			var targets = jQuery(target, this),
				l = targets.length;

			return this.filter(function () {
				var i = 0;
				for (; i < l; i++) {
					if (jQuery.contains(this, targets[i])) {
						return true;
					}
				}
			});
		},

		closest: function (selectors, context) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				targets = typeof selectors !== "string" && jQuery(selectors);

			// Positional selectors never match, since there's no _selection_ context
			if (!rneedsContext.test(selectors)) {
				for (; i < l; i++) {
					for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {

						// Always skip document fragments
						if (cur.nodeType < 11 && (targets ?
							targets.index(cur) > -1 :

							// Don't pass non-elements to Sizzle
							cur.nodeType === 1 &&
							jQuery.find.matchesSelector(cur, selectors))) {

							matched.push(cur);
							break;
						}
					}
				}
			}

			return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
		},

		// Determine the position of an element within the set
		index: function (elem) {

			// No argument, return index in parent
			if (!elem) {
				return (this[0] && this[0].parentNode) ? this.first().prevAll().length : -1;
			}

			// Index in selector
			if (typeof elem === "string") {
				return indexOf.call(jQuery(elem), this[0]);
			}

			// Locate the position of the desired element
			return indexOf.call(this,

				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[0] : elem
			);
		},

		add: function (selector, context) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge(this.get(), jQuery(selector, context))
				)
			);
		},

		addBack: function (selector) {
			return this.add(selector == null ?
				this.prevObject : this.prevObject.filter(selector)
			);
		}
	});

	function sibling(cur, dir) {
		while ((cur = cur[dir]) && cur.nodeType !== 1) { }
		return cur;
	}

	jQuery.each({
		parent: function (elem) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function (elem) {
			return dir(elem, "parentNode");
		},
		parentsUntil: function (elem, i, until) {
			return dir(elem, "parentNode", until);
		},
		next: function (elem) {
			return sibling(elem, "nextSibling");
		},
		prev: function (elem) {
			return sibling(elem, "previousSibling");
		},
		nextAll: function (elem) {
			return dir(elem, "nextSibling");
		},
		prevAll: function (elem) {
			return dir(elem, "previousSibling");
		},
		nextUntil: function (elem, i, until) {
			return dir(elem, "nextSibling", until);
		},
		prevUntil: function (elem, i, until) {
			return dir(elem, "previousSibling", until);
		},
		siblings: function (elem) {
			return siblings((elem.parentNode || {}).firstChild, elem);
		},
		children: function (elem) {
			return siblings(elem.firstChild);
		},
		contents: function (elem) {
			if (nodeName(elem, "iframe")) {
				return elem.contentDocument;
			}

			// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
			// Treat the template element as a regular one in browsers that
			// don't support it.
			if (nodeName(elem, "template")) {
				elem = elem.content || elem;
			}

			return jQuery.merge([], elem.childNodes);
		}
	}, function (name, fn) {
		jQuery.fn[name] = function (until, selector) {
			var matched = jQuery.map(this, fn, until);

			if (name.slice(-5) !== "Until") {
				selector = until;
			}

			if (selector && typeof selector === "string") {
				matched = jQuery.filter(selector, matched);
			}

			if (this.length > 1) {

				// Remove duplicates
				if (!guaranteedUnique[name]) {
					jQuery.uniqueSort(matched);
				}

				// Reverse order for parents* and prev-derivatives
				if (rparentsprev.test(name)) {
					matched.reverse();
				}
			}

			return this.pushStack(matched);
		};
	});
	var rnothtmlwhite = (/[^\x20\t\r\n\f]+/g);



	// Convert String-formatted options into Object-formatted ones
	function createOptions(options) {
		var object = {};
		jQuery.each(options.match(rnothtmlwhite) || [], function (_, flag) {
			object[flag] = true;
		});
		return object;
	}

	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function (options) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions(options) :
			jQuery.extend({}, options);

		var // Flag to know if list is currently firing
			firing,

			// Last fire value for non-forgettable lists
			memory,

			// Flag to know if list was already fired
			fired,

			// Flag to prevent firing
			locked,

			// Actual callback list
			list = [],

			// Queue of execution data for repeatable lists
			queue = [],

			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,

			// Fire callbacks
			fire = function () {

				// Enforce single-firing
				locked = locked || options.once;

				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for (; queue.length; firingIndex = -1) {
					memory = queue.shift();
					while (++firingIndex < list.length) {

						// Run callback and check for early termination
						if (list[firingIndex].apply(memory[0], memory[1]) === false &&
							options.stopOnFalse) {

							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}

				// Forget the data if we're done with it
				if (!options.memory) {
					memory = false;
				}

				firing = false;

				// Clean up if we're done firing for good
				if (locked) {

					// Keep an empty list if we have data for future add calls
					if (memory) {
						list = [];

						// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},

			// Actual Callbacks object
			self = {

				// Add a callback or a collection of callbacks to the list
				add: function () {
					if (list) {

						// If we have memory from a past run, we should fire after adding
						if (memory && !firing) {
							firingIndex = list.length - 1;
							queue.push(memory);
						}

						(function add(args) {
							jQuery.each(args, function (_, arg) {
								if (jQuery.isFunction(arg)) {
									if (!options.unique || !self.has(arg)) {
										list.push(arg);
									}
								} else if (arg && arg.length && jQuery.type(arg) !== "string") {

									// Inspect recursively
									add(arg);
								}
							});
						})(arguments);

						if (memory && !firing) {
							fire();
						}
					}
					return this;
				},

				// Remove a callback from the list
				remove: function () {
					jQuery.each(arguments, function (_, arg) {
						var index;
						while ((index = jQuery.inArray(arg, list, index)) > -1) {
							list.splice(index, 1);

							// Handle firing indexes
							if (index <= firingIndex) {
								firingIndex--;
							}
						}
					});
					return this;
				},

				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function (fn) {
					return fn ?
						jQuery.inArray(fn, list) > -1 :
						list.length > 0;
				},

				// Remove all callbacks from the list
				empty: function () {
					if (list) {
						list = [];
					}
					return this;
				},

				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function () {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function () {
					return !list;
				},

				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function () {
					locked = queue = [];
					if (!memory && !firing) {
						list = memory = "";
					}
					return this;
				},
				locked: function () {
					return !!locked;
				},

				// Call all callbacks with the given context and arguments
				fireWith: function (context, args) {
					if (!locked) {
						args = args || [];
						args = [context, args.slice ? args.slice() : args];
						queue.push(args);
						if (!firing) {
							fire();
						}
					}
					return this;
				},

				// Call all the callbacks with the given arguments
				fire: function () {
					self.fireWith(this, arguments);
					return this;
				},

				// To know if the callbacks have already been called at least once
				fired: function () {
					return !!fired;
				}
			};

		return self;
	};


	function Identity(v) {
		return v;
	}
	function Thrower(ex) {
		throw ex;
	}

	function adoptValue(value, resolve, reject, noValue) {
		var method;

		try {

			// Check for promise aspect first to privilege synchronous behavior
			if (value && jQuery.isFunction((method = value.promise))) {
				method.call(value).done(resolve).fail(reject);

				// Other thenables
			} else if (value && jQuery.isFunction((method = value.then))) {
				method.call(value, resolve, reject);

				// Other non-thenables
			} else {

				resolve.apply(undefined, [value].slice(noValue));
			}

		} catch (value) {

			reject.apply(undefined, [value]);
		}
	}

	jQuery.extend({

		Deferred: function (func) {
			var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				["notify", "progress", jQuery.Callbacks("memory"),
					jQuery.Callbacks("memory"), 2],
				["resolve", "done", jQuery.Callbacks("once memory"),
					jQuery.Callbacks("once memory"), 0, "resolved"],
				["reject", "fail", jQuery.Callbacks("once memory"),
					jQuery.Callbacks("once memory"), 1, "rejected"]
			],
				state = "pending",
				promise = {
					state: function () {
						return state;
					},
					always: function () {
						deferred.done(arguments).fail(arguments);
						return this;
					},
					"catch": function (fn) {
						return promise.then(null, fn);
					},

					// Keep pipe for back-compat
					pipe: function ( /* fnDone, fnFail, fnProgress */) {
						var fns = arguments;

						return jQuery.Deferred(function (newDefer) {
							jQuery.each(tuples, function (i, tuple) {

								// Map tuples (progress, done, fail) to arguments (done, fail, progress)
								var fn = jQuery.isFunction(fns[tuple[4]]) && fns[tuple[4]];

								// deferred.progress(function() { bind to newDefer or newDefer.notify })
								// deferred.done(function() { bind to newDefer or newDefer.resolve })
								// deferred.fail(function() { bind to newDefer or newDefer.reject })
								deferred[tuple[1]](function () {
									var returned = fn && fn.apply(this, arguments);
									if (returned && jQuery.isFunction(returned.promise)) {
										returned.promise()
											.progress(newDefer.notify)
											.done(newDefer.resolve)
											.fail(newDefer.reject);
									} else {
										newDefer[tuple[0] + "With"](
											this,
											fn ? [returned] : arguments
										);
									}
								});
							});
							fns = null;
						}).promise();
					},
					then: function (onFulfilled, onRejected, onProgress) {
						var maxDepth = 0;
						function resolve(depth, deferred, handler, special) {
							return function () {
								var that = this,
									args = arguments,
									mightThrow = function () {
										var returned, then;

										// Support: Promises/A+ section 2.3.3.3.3
										// https://promisesaplus.com/#point-59
										// Ignore double-resolution attempts
										if (depth < maxDepth) {
											return;
										}

										returned = handler.apply(that, args);

										// Support: Promises/A+ section 2.3.1
										// https://promisesaplus.com/#point-48
										if (returned === deferred.promise()) {
											throw new TypeError("Thenable self-resolution");
										}

										then = returned &&

											// Support: Promises/A+ section 2.3.4
											// https://promisesaplus.com/#point-64
											// Only check objects and functions for thenability
											(typeof returned === "object" ||
												typeof returned === "function") &&
											returned.then;

										// Handle a returned thenable
										if (jQuery.isFunction(then)) {

											// Special processors (notify) just wait for resolution
											if (special) {
												then.call(
													returned,
													resolve(maxDepth, deferred, Identity, special),
													resolve(maxDepth, deferred, Thrower, special)
												);

												// Normal processors (resolve) also hook into progress
											} else {

												// ...and disregard older resolution values
												maxDepth++;

												then.call(
													returned,
													resolve(maxDepth, deferred, Identity, special),
													resolve(maxDepth, deferred, Thrower, special),
													resolve(maxDepth, deferred, Identity,
														deferred.notifyWith)
												);
											}

											// Handle all other returned values
										} else {

											// Only substitute handlers pass on context
											// and multiple values (non-spec behavior)
											if (handler !== Identity) {
												that = undefined;
												args = [returned];
											}

											// Process the value(s)
											// Default process is resolve
											(special || deferred.resolveWith)(that, args);
										}
									},

									// Only normal processors (resolve) catch and reject exceptions
									process = special ?
										mightThrow :
										function () {
											try {
												mightThrow();
											} catch (e) {

												if (jQuery.Deferred.exceptionHook) {
													jQuery.Deferred.exceptionHook(e,
														process.stackTrace);
												}

												// Support: Promises/A+ section 2.3.3.3.4.1
												// https://promisesaplus.com/#point-61
												// Ignore post-resolution exceptions
												if (depth + 1 >= maxDepth) {

													// Only substitute handlers pass on context
													// and multiple values (non-spec behavior)
													if (handler !== Thrower) {
														that = undefined;
														args = [e];
													}

													deferred.rejectWith(that, args);
												}
											}
										};

								// Support: Promises/A+ section 2.3.3.3.1
								// https://promisesaplus.com/#point-57
								// Re-resolve promises immediately to dodge false rejection from
								// subsequent errors
								if (depth) {
									process();
								} else {

									// Call an optional hook to record the stack, in case of exception
									// since it's otherwise lost when execution goes async
									if (jQuery.Deferred.getStackHook) {
										process.stackTrace = jQuery.Deferred.getStackHook();
									}
									window.setTimeout(process);
								}
							};
						}

						return jQuery.Deferred(function (newDefer) {

							// progress_handlers.add( ... )
							tuples[0][3].add(
								resolve(
									0,
									newDefer,
									jQuery.isFunction(onProgress) ?
										onProgress :
										Identity,
									newDefer.notifyWith
								)
							);

							// fulfilled_handlers.add( ... )
							tuples[1][3].add(
								resolve(
									0,
									newDefer,
									jQuery.isFunction(onFulfilled) ?
										onFulfilled :
										Identity
								)
							);

							// rejected_handlers.add( ... )
							tuples[2][3].add(
								resolve(
									0,
									newDefer,
									jQuery.isFunction(onRejected) ?
										onRejected :
										Thrower
								)
							);
						}).promise();
					},

					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function (obj) {
						return obj != null ? jQuery.extend(obj, promise) : promise;
					}
				},
				deferred = {};

			// Add list-specific methods
			jQuery.each(tuples, function (i, tuple) {
				var list = tuple[2],
					stateString = tuple[5];

				// promise.progress = list.add
				// promise.done = list.add
				// promise.fail = list.add
				promise[tuple[1]] = list.add;

				// Handle state
				if (stateString) {
					list.add(
						function () {

							// state = "resolved" (i.e., fulfilled)
							// state = "rejected"
							state = stateString;
						},

						// rejected_callbacks.disable
						// fulfilled_callbacks.disable
						tuples[3 - i][2].disable,

						// progress_callbacks.lock
						tuples[0][2].lock
					);
				}

				// progress_handlers.fire
				// fulfilled_handlers.fire
				// rejected_handlers.fire
				list.add(tuple[3].fire);

				// deferred.notify = function() { deferred.notifyWith(...) }
				// deferred.resolve = function() { deferred.resolveWith(...) }
				// deferred.reject = function() { deferred.rejectWith(...) }
				deferred[tuple[0]] = function () {
					deferred[tuple[0] + "With"](this === deferred ? undefined : this, arguments);
					return this;
				};

				// deferred.notifyWith = list.fireWith
				// deferred.resolveWith = list.fireWith
				// deferred.rejectWith = list.fireWith
				deferred[tuple[0] + "With"] = list.fireWith;
			});

			// Make the deferred a promise
			promise.promise(deferred);

			// Call given func if any
			if (func) {
				func.call(deferred, deferred);
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function (singleValue) {
			var

				// count of uncompleted subordinates
				remaining = arguments.length,

				// count of unprocessed arguments
				i = remaining,

				// subordinate fulfillment data
				resolveContexts = Array(i),
				resolveValues = slice.call(arguments),

				// the master Deferred
				master = jQuery.Deferred(),

				// subordinate callback factory
				updateFunc = function (i) {
					return function (value) {
						resolveContexts[i] = this;
						resolveValues[i] = arguments.length > 1 ? slice.call(arguments) : value;
						if (!(--remaining)) {
							master.resolveWith(resolveContexts, resolveValues);
						}
					};
				};

			// Single- and empty arguments are adopted like Promise.resolve
			if (remaining <= 1) {
				adoptValue(singleValue, master.done(updateFunc(i)).resolve, master.reject,
					!remaining);

				// Use .then() to unwrap secondary thenables (cf. gh-3000)
				if (master.state() === "pending" ||
					jQuery.isFunction(resolveValues[i] && resolveValues[i].then)) {

					return master.then();
				}
			}

			// Multiple arguments are aggregated like Promise.all array elements
			while (i--) {
				adoptValue(resolveValues[i], updateFunc(i), master.reject);
			}

			return master.promise();
		}
	});


	// These usually indicate a programmer mistake during development,
	// warn about them ASAP rather than swallowing them by default.
	var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

	jQuery.Deferred.exceptionHook = function (error, stack) {

		// Support: IE 8 - 9 only
		// Console exists when dev tools are open, which can happen at any time
		if (window.console && window.console.warn && error && rerrorNames.test(error.name)) {
			window.console.warn("jQuery.Deferred exception: " + error.message, error.stack, stack);
		}
	};




	jQuery.readyException = function (error) {
		window.setTimeout(function () {
			throw error;
		});
	};




	// The deferred used on DOM ready
	var readyList = jQuery.Deferred();

	jQuery.fn.ready = function (fn) {

		readyList
			.then(fn)

			// Wrap jQuery.readyException in a function so that the lookup
			// happens at the time of error handling instead of callback
			// registration.
			.catch(function (error) {
				jQuery.readyException(error);
			});

		return this;
	};

	jQuery.extend({

		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Handle when the DOM is ready
		ready: function (wait) {

			// Abort if there are pending holds or we're already ready
			if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
				return;
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if (wait !== true && --jQuery.readyWait > 0) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith(document, [jQuery]);
		}
	});

	jQuery.ready.then = readyList.then;

	// The ready event handler and self cleanup method
	function completed() {
		document.removeEventListener("DOMContentLoaded", completed);
		window.removeEventListener("load", completed);
		jQuery.ready();
	}

	// Catch cases where $(document).ready() is called
	// after the browser event has already occurred.
	// Support: IE <=9 - 10 only
	// Older IE sometimes signals "interactive" too soon
	if (document.readyState === "complete" ||
		(document.readyState !== "loading" && !document.documentElement.doScroll)) {

		// Handle it asynchronously to allow scripts the opportunity to delay ready
		window.setTimeout(jQuery.ready);

	} else {

		// Use the handy event callback
		document.addEventListener("DOMContentLoaded", completed);

		// A fallback to window.onload, that will always work
		window.addEventListener("load", completed);
	}




	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function (elems, fn, key, value, chainable, emptyGet, raw) {
		var i = 0,
			len = elems.length,
			bulk = key == null;

		// Sets many values
		if (jQuery.type(key) === "object") {
			chainable = true;
			for (i in key) {
				access(elems, fn, i, key[i], true, emptyGet, raw);
			}

			// Sets one value
		} else if (value !== undefined) {
			chainable = true;

			if (!jQuery.isFunction(value)) {
				raw = true;
			}

			if (bulk) {

				// Bulk operations run against the entire set
				if (raw) {
					fn.call(elems, value);
					fn = null;

					// ...except when executing function values
				} else {
					bulk = fn;
					fn = function (elem, key, value) {
						return bulk.call(jQuery(elem), value);
					};
				}
			}

			if (fn) {
				for (; i < len; i++) {
					fn(
						elems[i], key, raw ?
							value :
							value.call(elems[i], i, fn(elems[i], key))
					);
				}
			}
		}

		if (chainable) {
			return elems;
		}

		// Gets
		if (bulk) {
			return fn.call(elems);
		}

		return len ? fn(elems[0], key) : emptyGet;
	};
	var acceptData = function (owner) {

		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		return owner.nodeType === 1 || owner.nodeType === 9 || !(+owner.nodeType);
	};




	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;

	Data.prototype = {

		cache: function (owner) {

			// Check if the owner object already has a cache
			var value = owner[this.expando];

			// If not, create one
			if (!value) {
				value = {};

				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if (acceptData(owner)) {

					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if (owner.nodeType) {
						owner[this.expando] = value;

						// Otherwise secure it in a non-enumerable property
						// configurable must be true to allow the property to be
						// deleted when data is removed
					} else {
						Object.defineProperty(owner, this.expando, {
							value: value,
							configurable: true
						});
					}
				}
			}

			return value;
		},
		set: function (owner, data, value) {
			var prop,
				cache = this.cache(owner);

			// Handle: [ owner, key, value ] args
			// Always use camelCase key (gh-2257)
			if (typeof data === "string") {
				cache[jQuery.camelCase(data)] = value;

				// Handle: [ owner, { properties } ] args
			} else {

				// Copy the properties one-by-one to the cache object
				for (prop in data) {
					cache[jQuery.camelCase(prop)] = data[prop];
				}
			}
			return cache;
		},
		get: function (owner, key) {
			return key === undefined ?
				this.cache(owner) :

				// Always use camelCase key (gh-2257)
				owner[this.expando] && owner[this.expando][jQuery.camelCase(key)];
		},
		access: function (owner, key, value) {

			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if (key === undefined ||
				((key && typeof key === "string") && value === undefined)) {

				return this.get(owner, key);
			}

			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set(owner, key, value);

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function (owner, key) {
			var i,
				cache = owner[this.expando];

			if (cache === undefined) {
				return;
			}

			if (key !== undefined) {

				// Support array or space separated string of keys
				if (Array.isArray(key)) {

					// If key is an array of keys...
					// We always set camelCase keys, so remove that.
					key = key.map(jQuery.camelCase);
				} else {
					key = jQuery.camelCase(key);

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					key = key in cache ?
						[key] :
						(key.match(rnothtmlwhite) || []);
				}

				i = key.length;

				while (i--) {
					delete cache[key[i]];
				}
			}

			// Remove the expando if there's no more data
			if (key === undefined || jQuery.isEmptyObject(cache)) {

				// Support: Chrome <=35 - 45
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
				if (owner.nodeType) {
					owner[this.expando] = undefined;
				} else {
					delete owner[this.expando];
				}
			}
		},
		hasData: function (owner) {
			var cache = owner[this.expando];
			return cache !== undefined && !jQuery.isEmptyObject(cache);
		}
	};
	var dataPriv = new Data();

	var dataUser = new Data();



	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /[A-Z]/g;

	function getData(data) {
		if (data === "true") {
			return true;
		}

		if (data === "false") {
			return false;
		}

		if (data === "null") {
			return null;
		}

		// Only convert to a number if it doesn't change the string
		if (data === +data + "") {
			return +data;
		}

		if (rbrace.test(data)) {
			return JSON.parse(data);
		}

		return data;
	}

	function dataAttr(elem, key, data) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if (data === undefined && elem.nodeType === 1) {
			name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
			data = elem.getAttribute(name);

			if (typeof data === "string") {
				try {
					data = getData(data);
				} catch (e) { }

				// Make sure we set the data so it isn't changed later
				dataUser.set(elem, key, data);
			} else {
				data = undefined;
			}
		}
		return data;
	}

	jQuery.extend({
		hasData: function (elem) {
			return dataUser.hasData(elem) || dataPriv.hasData(elem);
		},

		data: function (elem, name, data) {
			return dataUser.access(elem, name, data);
		},

		removeData: function (elem, name) {
			dataUser.remove(elem, name);
		},

		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function (elem, name, data) {
			return dataPriv.access(elem, name, data);
		},

		_removeData: function (elem, name) {
			dataPriv.remove(elem, name);
		}
	});

	jQuery.fn.extend({
		data: function (key, value) {
			var i, name, data,
				elem = this[0],
				attrs = elem && elem.attributes;

			// Gets all values
			if (key === undefined) {
				if (this.length) {
					data = dataUser.get(elem);

					if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
						i = attrs.length;
						while (i--) {

							// Support: IE 11 only
							// The attrs elements can be null (#14894)
							if (attrs[i]) {
								name = attrs[i].name;
								if (name.indexOf("data-") === 0) {
									name = jQuery.camelCase(name.slice(5));
									dataAttr(elem, name, data[name]);
								}
							}
						}
						dataPriv.set(elem, "hasDataAttrs", true);
					}
				}

				return data;
			}

			// Sets multiple values
			if (typeof key === "object") {
				return this.each(function () {
					dataUser.set(this, key);
				});
			}

			return access(this, function (value) {
				var data;

				if (elem && value === undefined) {

					// Attempt to get data from the cache
					// The key will always be camelCased in Data
					data = dataUser.get(elem, key);
					if (data !== undefined) {
						return data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr(elem, key);
					if (data !== undefined) {
						return data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				this.each(function () {

					// We always store the camelCased key
					dataUser.set(this, key, value);
				});
			}, null, value, arguments.length > 1, null, true);
		},

		removeData: function (key) {
			return this.each(function () {
				dataUser.remove(this, key);
			});
		}
	});


	jQuery.extend({
		queue: function (elem, type, data) {
			var queue;

			if (elem) {
				type = (type || "fx") + "queue";
				queue = dataPriv.get(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!queue || Array.isArray(data)) {
						queue = dataPriv.access(elem, type, jQuery.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		dequeue: function (elem, type) {
			type = type || "fx";

			var queue = jQuery.queue(elem, type),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks(elem, type),
				next = function () {
					jQuery.dequeue(elem, type);
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if (fn === "inprogress") {
				fn = queue.shift();
				startLength--;
			}

			if (fn) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if (type === "fx") {
					queue.unshift("inprogress");
				}

				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call(elem, next, hooks);
			}

			if (!startLength && hooks) {
				hooks.empty.fire();
			}
		},

		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function (elem, type) {
			var key = type + "queueHooks";
			return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
				empty: jQuery.Callbacks("once memory").add(function () {
					dataPriv.remove(elem, [type + "queue", key]);
				})
			});
		}
	});

	jQuery.fn.extend({
		queue: function (type, data) {
			var setter = 2;

			if (typeof type !== "string") {
				data = type;
				type = "fx";
				setter--;
			}

			if (arguments.length < setter) {
				return jQuery.queue(this[0], type);
			}

			return data === undefined ?
				this :
				this.each(function () {
					var queue = jQuery.queue(this, type, data);

					// Ensure a hooks for this queue
					jQuery._queueHooks(this, type);

					if (type === "fx" && queue[0] !== "inprogress") {
						jQuery.dequeue(this, type);
					}
				});
		},
		dequeue: function (type) {
			return this.each(function () {
				jQuery.dequeue(this, type);
			});
		},
		clearQueue: function (type) {
			return this.queue(type || "fx", []);
		},

		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function (type, obj) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function () {
					if (!(--count)) {
						defer.resolveWith(elements, [elements]);
					}
				};

			if (typeof type !== "string") {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while (i--) {
				tmp = dataPriv.get(elements[i], type + "queueHooks");
				if (tmp && tmp.empty) {
					count++;
					tmp.empty.add(resolve);
				}
			}
			resolve();
			return defer.promise(obj);
		}
	});
	var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

	var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");


	var cssExpand = ["Top", "Right", "Bottom", "Left"];

	var isHiddenWithinTree = function (elem, el) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains(elem.ownerDocument, elem) &&

			jQuery.css(elem, "display") === "none";
	};

	var swap = function (elem, options, callback, args) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for (name in options) {
			old[name] = elem.style[name];
			elem.style[name] = options[name];
		}

		ret = callback.apply(elem, args || []);

		// Revert the old values
		for (name in options) {
			elem.style[name] = old[name];
		}

		return ret;
	};




	function adjustCSS(elem, prop, valueParts, tween) {
		var adjusted,
			scale = 1,
			maxIterations = 20,
			currentValue = tween ?
				function () {
					return tween.cur();
				} :
				function () {
					return jQuery.css(elem, prop, "");
				},
			initial = currentValue(),
			unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"),

			// Starting value computation is required for potential unit mismatches
			initialInUnit = (jQuery.cssNumber[prop] || unit !== "px" && +initial) &&
				rcssNum.exec(jQuery.css(elem, prop));

		if (initialInUnit && initialInUnit[3] !== unit) {

			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[3];

			// Make sure we update the tween properties later on
			valueParts = valueParts || [];

			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;

			do {

				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";

				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style(elem, prop, initialInUnit + unit);

				// Update scale, tolerating zero or NaN from tween.cur()
				// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (
				scale !== (scale = currentValue() / initial) && scale !== 1 && --maxIterations
			);
		}

		if (valueParts) {
			initialInUnit = +initialInUnit || +initial || 0;

			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[1] ?
				initialInUnit + (valueParts[1] + 1) * valueParts[2] :
				+valueParts[2];
			if (tween) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}


	var defaultDisplayMap = {};

	function getDefaultDisplay(elem) {
		var temp,
			doc = elem.ownerDocument,
			nodeName = elem.nodeName,
			display = defaultDisplayMap[nodeName];

		if (display) {
			return display;
		}

		temp = doc.body.appendChild(doc.createElement(nodeName));
		display = jQuery.css(temp, "display");

		temp.parentNode.removeChild(temp);

		if (display === "none") {
			display = "block";
		}
		defaultDisplayMap[nodeName] = display;

		return display;
	}

	function showHide(elements, show) {
		var display, elem,
			values = [],
			index = 0,
			length = elements.length;

		// Determine new display value for elements that need to change
		for (; index < length; index++) {
			elem = elements[index];
			if (!elem.style) {
				continue;
			}

			display = elem.style.display;
			if (show) {

				// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
				// check is required in this first loop unless we have a nonempty display value (either
				// inline or about-to-be-restored)
				if (display === "none") {
					values[index] = dataPriv.get(elem, "display") || null;
					if (!values[index]) {
						elem.style.display = "";
					}
				}
				if (elem.style.display === "" && isHiddenWithinTree(elem)) {
					values[index] = getDefaultDisplay(elem);
				}
			} else {
				if (display !== "none") {
					values[index] = "none";

					// Remember what we're overwriting
					dataPriv.set(elem, "display", display);
				}
			}
		}

		// Set the display of the elements in a second loop to avoid constant reflow
		for (index = 0; index < length; index++) {
			if (values[index] != null) {
				elements[index].style.display = values[index];
			}
		}

		return elements;
	}

	jQuery.fn.extend({
		show: function () {
			return showHide(this, true);
		},
		hide: function () {
			return showHide(this);
		},
		toggle: function (state) {
			if (typeof state === "boolean") {
				return state ? this.show() : this.hide();
			}

			return this.each(function () {
				if (isHiddenWithinTree(this)) {
					jQuery(this).show();
				} else {
					jQuery(this).hide();
				}
			});
		}
	});
	var rcheckableType = (/^(?:checkbox|radio)$/i);

	var rtagName = (/<([a-z][^\/\0>\x20\t\r\n\f]+)/i);

	var rscriptType = (/^$|\/(?:java|ecma)script/i);



	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {

		// Support: IE <=9 only
		option: [1, "<select multiple='multiple'>", "</select>"],

		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [1, "<table>", "</table>"],
		col: [2, "<table><colgroup>", "</colgroup></table>"],
		tr: [2, "<table><tbody>", "</tbody></table>"],
		td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

		_default: [0, "", ""]
	};

	// Support: IE <=9 only
	wrapMap.optgroup = wrapMap.option;

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;


	function getAll(context, tag) {

		// Support: IE <=9 - 11 only
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret;

		if (typeof context.getElementsByTagName !== "undefined") {
			ret = context.getElementsByTagName(tag || "*");

		} else if (typeof context.querySelectorAll !== "undefined") {
			ret = context.querySelectorAll(tag || "*");

		} else {
			ret = [];
		}

		if (tag === undefined || tag && nodeName(context, tag)) {
			return jQuery.merge([context], ret);
		}

		return ret;
	}


	// Mark scripts as having already been evaluated
	function setGlobalEval(elems, refElements) {
		var i = 0,
			l = elems.length;

		for (; i < l; i++) {
			dataPriv.set(
				elems[i],
				"globalEval",
				!refElements || dataPriv.get(refElements[i], "globalEval")
			);
		}
	}


	var rhtml = /<|&#?\w+;/;

	function buildFragment(elems, context, scripts, selection, ignored) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for (; i < l; i++) {
			elem = elems[i];

			if (elem || elem === 0) {

				// Add nodes directly
				if (jQuery.type(elem) === "object") {

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

					// Convert non-html into a text node
				} else if (!rhtml.test(elem)) {
					nodes.push(context.createTextNode(elem));

					// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild(context.createElement("div"));

					// Deserialize a standard representation
					tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
					wrap = wrapMap[tag] || wrapMap._default;
					tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while (j--) {
						tmp = tmp.lastChild;
					}

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge(nodes, tmp.childNodes);

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ((elem = nodes[i++])) {

			// Skip elements already in the context collection (trac-4087)
			if (selection && jQuery.inArray(elem, selection) > -1) {
				if (ignored) {
					ignored.push(elem);
				}
				continue;
			}

			contains = jQuery.contains(elem.ownerDocument, elem);

			// Append to fragment
			tmp = getAll(fragment.appendChild(elem), "script");

			// Preserve script evaluation history
			if (contains) {
				setGlobalEval(tmp);
			}

			// Capture executables
			if (scripts) {
				j = 0;
				while ((elem = tmp[j++])) {
					if (rscriptType.test(elem.type || "")) {
						scripts.push(elem);
					}
				}
			}
		}

		return fragment;
	}


	(function () {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild(document.createElement("div")),
			input = document.createElement("input");

		input.setAttribute("type", "radio");
		input.setAttribute("checked", "checked");
		input.setAttribute("name", "t");

		div.appendChild(input);

		// Support: Android <=4.1 only
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;

		// Support: IE <=11 only
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
	})();
	var documentElement = document.documentElement;



	var
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	// Support: IE <=9 only
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch (err) { }
	}

	function on(elem, types, selector, data, fn, one) {
		var origFn, type;

		// Types can be a map of types/handlers
		if (typeof types === "object") {

			// ( types-Object, selector, data )
			if (typeof selector !== "string") {

				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for (type in types) {
				on(elem, type, selector, data, types[type], one);
			}
			return elem;
		}

		if (data == null && fn == null) {

			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if (fn == null) {
			if (typeof selector === "string") {

				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {

				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if (fn === false) {
			fn = returnFalse;
		} else if (!fn) {
			return elem;
		}

		if (one === 1) {
			origFn = fn;
			fn = function (event) {

				// Can use an empty set, since event contains the info
				jQuery().off(event);
				return origFn.apply(this, arguments);
			};

			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
		}
		return elem.each(function () {
			jQuery.event.add(this, types, fn, data, selector);
		});
	}

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {

		global: {},

		add: function (elem, types, handler, data, selector) {

			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.get(elem);

			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if (!elemData) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if (handler.handler) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Ensure that invalid selectors throw exceptions at attach time
			// Evaluate against documentElement in case elem is a non-element node (e.g., document)
			if (selector) {
				jQuery.find.matchesSelector(documentElement, selector);
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if (!handler.guid) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if (!(events = elemData.events)) {
				events = elemData.events = {};
			}
			if (!(eventHandle = elemData.handle)) {
				eventHandle = elemData.handle = function (e) {

					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply(elem, arguments) : undefined;
				};
			}

			// Handle multiple events separated by a space
			types = (types || "").match(rnothtmlwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				// There *must* be a type, no attaching namespace-only handlers
				if (!type) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[type] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = (selector ? special.delegateType : special.bindType) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[type] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend({
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test(selector),
					namespace: namespaces.join(".")
				}, handleObjIn);

				// Init the event handler queue if we're the first
				if (!(handlers = events[type])) {
					handlers = events[type] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if (!special.setup ||
						special.setup.call(elem, data, namespaces, eventHandle) === false) {

						if (elem.addEventListener) {
							elem.addEventListener(type, eventHandle);
						}
					}
				}

				if (special.add) {
					special.add.call(elem, handleObj);

					if (!handleObj.handler.guid) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if (selector) {
					handlers.splice(handlers.delegateCount++, 0, handleObj);
				} else {
					handlers.push(handleObj);
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[type] = true;
			}

		},

		// Detach an event or set of events from an element
		remove: function (elem, types, handler, selector, mappedTypes) {

			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.hasData(elem) && dataPriv.get(elem);

			if (!elemData || !(events = elemData.events)) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = (types || "").match(rnothtmlwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				// Unbind all events (on this namespace, if provided) for the element
				if (!type) {
					for (type in events) {
						jQuery.event.remove(elem, type + types[t], handler, selector, true);
					}
					continue;
				}

				special = jQuery.event.special[type] || {};
				type = (selector ? special.delegateType : special.bindType) || type;
				handlers = events[type] || [];
				tmp = tmp[2] &&
					new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

				// Remove matching events
				origCount = j = handlers.length;
				while (j--) {
					handleObj = handlers[j];

					if ((mappedTypes || origType === handleObj.origType) &&
						(!handler || handler.guid === handleObj.guid) &&
						(!tmp || tmp.test(handleObj.namespace)) &&
						(!selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector)) {
						handlers.splice(j, 1);

						if (handleObj.selector) {
							handlers.delegateCount--;
						}
						if (special.remove) {
							special.remove.call(elem, handleObj);
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if (origCount && !handlers.length) {
					if (!special.teardown ||
						special.teardown.call(elem, namespaces, elemData.handle) === false) {

						jQuery.removeEvent(elem, type, elemData.handle);
					}

					delete events[type];
				}
			}

			// Remove data and the expando if it's no longer used
			if (jQuery.isEmptyObject(events)) {
				dataPriv.remove(elem, "handle events");
			}
		},

		dispatch: function (nativeEvent) {

			// Make a writable jQuery.Event from the native event object
			var event = jQuery.event.fix(nativeEvent);

			var i, j, ret, matched, handleObj, handlerQueue,
				args = new Array(arguments.length),
				handlers = (dataPriv.get(this, "events") || {})[event.type] || [],
				special = jQuery.event.special[event.type] || {};

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[0] = event;

			for (i = 1; i < arguments.length; i++) {
				args[i] = arguments[i];
			}

			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if (special.preDispatch && special.preDispatch.call(this, event) === false) {
				return;
			}

			// Determine handlers
			handlerQueue = jQuery.event.handlers.call(this, event, handlers);

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
				event.currentTarget = matched.elem;

				j = 0;
				while ((handleObj = matched.handlers[j++]) &&
					!event.isImmediatePropagationStopped()) {

					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ((jQuery.event.special[handleObj.origType] || {}).handle ||
							handleObj.handler).apply(matched.elem, args);

						if (ret !== undefined) {
							if ((event.result = ret) === false) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if (special.postDispatch) {
				special.postDispatch.call(this, event);
			}

			return event.result;
		},

		handlers: function (event, handlers) {
			var i, handleObj, sel, matchedHandlers, matchedSelectors,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;

			// Find delegate handlers
			if (delegateCount &&

	
				cur.nodeType &&


				!(event.type === "click" && event.button >= 1)) {

				for (; cur !== this; cur = cur.parentNode || this) {

					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
						matchedHandlers = [];
						matchedSelectors = {};
						for (i = 0; i < delegateCount; i++) {
							handleObj = handlers[i];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";

							if (matchedSelectors[sel] === undefined) {
								matchedSelectors[sel] = handleObj.needsContext ?
									jQuery(sel, this).index(cur) > -1 :
									jQuery.find(sel, this, null, [cur]).length;
							}
							if (matchedSelectors[sel]) {
								matchedHandlers.push(handleObj);
							}
						}
						if (matchedHandlers.length) {
							handlerQueue.push({ elem: cur, handlers: matchedHandlers });
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			cur = this;
			if (delegateCount < handlers.length) {
				handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
			}

			return handlerQueue;
		},

		addProp: function (name, hook) {
			Object.defineProperty(jQuery.Event.prototype, name, {
				enumerable: true,
				configurable: true,

				get: jQuery.isFunction(hook) ?
					function () {
						if (this.originalEvent) {
							return hook(this.originalEvent);
						}
					} :
					function () {
						if (this.originalEvent) {
							return this.originalEvent[name];
						}
					},

				set: function (value) {
					Object.defineProperty(this, name, {
						enumerable: true,
						configurable: true,
						writable: true,
						value: value
					});
				}
			});
		},

		fix: function (originalEvent) {
			return originalEvent[jQuery.expando] ?
				originalEvent :
				new jQuery.Event(originalEvent);
		},

		special: {
			load: {

				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {

				// Fire native event if possible so blur/focus sequence is correct
				trigger: function () {
					if (this !== safeActiveElement() && this.focus) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function () {
					if (this === safeActiveElement() && this.blur) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {

				// For checkbox, fire native event so checked state will be right
				trigger: function () {
					if (this.type === "checkbox" && this.click && nodeName(this, "input")) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function (event) {
					return nodeName(event.target, "a");
				}
			},

			beforeunload: {
				postDispatch: function (event) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if (event.result !== undefined && event.originalEvent) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};

	jQuery.removeEvent = function (elem, type, handle) {

		// This "if" is needed for plain objects
		if (elem.removeEventListener) {
			elem.removeEventListener(type, handle);
		}
	};

	jQuery.Event = function (src, props) {

		// Allow instantiation without the 'new' keyword
		if (!(this instanceof jQuery.Event)) {
			return new jQuery.Event(src, props);
		}

		// Event object
		if (src && src.type) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
				returnTrue :
				returnFalse;

			// Create target properties
			// Support: Safari <=6 - 7 only
			// Target should not be a text node (#504, #13143)
			this.target = (src.target && src.target.nodeType === 3) ?
				src.target.parentNode :
				src.target;

			this.currentTarget = src.currentTarget;
			this.relatedTarget = src.relatedTarget;

			// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if (props) {
			jQuery.extend(this, props);
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		this[jQuery.expando] = true;
	};

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		isSimulated: false,

		preventDefault: function () {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if (e && !this.isSimulated) {
				e.preventDefault();
			}
		},
		stopPropagation: function () {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if (e && !this.isSimulated) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function () {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if (e && !this.isSimulated) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	// Includes all common event props including KeyEvent and MouseEvent specific props
	jQuery.each({
		altKey: true,
		bubbles: true,
		cancelable: true,
		changedTouches: true,
		ctrlKey: true,
		detail: true,
		eventPhase: true,
		metaKey: true,
		pageX: true,
		pageY: true,
		shiftKey: true,
		view: true,
		"char": true,
		charCode: true,
		key: true,
		keyCode: true,
		button: true,
		buttons: true,
		clientX: true,
		clientY: true,
		offsetX: true,
		offsetY: true,
		pointerId: true,
		pointerType: true,
		screenX: true,
		screenY: true,
		targetTouches: true,
		toElement: true,
		touches: true,

		which: function (event) {
			var button = event.button;

			// Add which for key events
			if (event.which == null && rkeyEvent.test(event.type)) {
				return event.charCode != null ? event.charCode : event.keyCode;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			if (!event.which && button !== undefined && rmouseEvent.test(event.type)) {
				if (button & 1) {
					return 1;
				}

				if (button & 2) {
					return 3;
				}

				if (button & 4) {
					return 2;
				}

				return 0;
			}

			return event.which;
		}
	}, jQuery.event.addProp);

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function (orig, fix) {
		jQuery.event.special[orig] = {
			delegateType: fix,
			bindType: fix,

			handle: function (event) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;

				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if (!related || (related !== target && !jQuery.contains(target, related))) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply(this, arguments);
					event.type = fix;
				}
				return ret;
			}
		};
	});

	jQuery.fn.extend({

		on: function (types, selector, data, fn) {
			return on(this, types, selector, data, fn);
		},
		one: function (types, selector, data, fn) {
			return on(this, types, selector, data, fn, 1);
		},
		off: function (types, selector, fn) {
			var handleObj, type;
			if (types && types.preventDefault && types.handleObj) {

				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery(types.delegateTarget).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if (typeof types === "object") {

				// ( types-object [, selector] )
				for (type in types) {
					this.off(type, selector, types[type]);
				}
				return this;
			}
			if (selector === false || typeof selector === "function") {

				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if (fn === false) {
				fn = returnFalse;
			}
			return this.each(function () {
				jQuery.event.remove(this, types, fn, selector);
			});
		}
	});


	var

		/* eslint-disable max-len */

		// See https://github.com/eslint/eslint/issues/3229
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

		/* eslint-enable */

		// Support: IE <=10 - 11, Edge 12 - 13
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,

		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

	// Prefer a tbody over its parent table for containing new rows
	function manipulationTarget(elem, content) {
		if (nodeName(elem, "table") &&
			nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {

			return jQuery(">tbody", elem)[0] || elem;
		}

		return elem;
	}

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript(elem) {
		elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
		return elem;
	}
	function restoreScript(elem) {
		var match = rscriptTypeMasked.exec(elem.type);

		if (match) {
			elem.type = match[1];
		} else {
			elem.removeAttribute("type");
		}

		return elem;
	}

	function cloneCopyEvent(src, dest) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

		if (dest.nodeType !== 1) {
			return;
		}

		// 1. Copy private data: events, handlers, etc.
		if (dataPriv.hasData(src)) {
			pdataOld = dataPriv.access(src);
			pdataCur = dataPriv.set(dest, pdataOld);
			events = pdataOld.events;

			if (events) {
				delete pdataCur.handle;
				pdataCur.events = {};

				for (type in events) {
					for (i = 0, l = events[type].length; i < l; i++) {
						jQuery.event.add(dest, type, events[type][i]);
					}
				}
			}
		}

		// 2. Copy user data
		if (dataUser.hasData(src)) {
			udataOld = dataUser.access(src);
			udataCur = jQuery.extend({}, udataOld);

			dataUser.set(dest, udataCur);
		}
	}

	// Fix IE bugs, see support tests
	function fixInput(src, dest) {
		var nodeName = dest.nodeName.toLowerCase();

		// Fails to persist the checked state of a cloned checkbox or radio button.
		if (nodeName === "input" && rcheckableType.test(src.type)) {
			dest.checked = src.checked;

			// Fails to return the selected option to the default selected state when cloning options
		} else if (nodeName === "input" || nodeName === "textarea") {
			dest.defaultValue = src.defaultValue;
		}
	}

	function domManip(collection, args, callback, ignored) {

		// Flatten any nested arrays
		args = concat.apply([], args);

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction(value);

		// We can't cloneNode fragments that contain checked, in WebKit
		if (isFunction ||
			(l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test(value))) {
			return collection.each(function (index) {
				var self = collection.eq(index);
				if (isFunction) {
					args[0] = value.call(this, index, self.html());
				}
				domManip(self, args, callback, ignored);
			});
		}

		if (l) {
			fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
			first = fragment.firstChild;

			if (fragment.childNodes.length === 1) {
				fragment = first;
			}

			// Require either new content or an interest in ignored elements to invoke the callback
			if (first || ignored) {
				scripts = jQuery.map(getAll(fragment, "script"), disableScript);
				hasScripts = scripts.length;

				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for (; i < l; i++) {
					node = fragment;

					if (i !== iNoClone) {
						node = jQuery.clone(node, true, true);

						// Keep references to cloned scripts for later restoration
						if (hasScripts) {

							// Support: Android <=4.0 only, PhantomJS 1 only
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge(scripts, getAll(node, "script"));
						}
					}

					callback.call(collection[i], node, i);
				}

				if (hasScripts) {
					doc = scripts[scripts.length - 1].ownerDocument;

					// Reenable scripts
					jQuery.map(scripts, restoreScript);

					// Evaluate executable scripts on first document insertion
					for (i = 0; i < hasScripts; i++) {
						node = scripts[i];
						if (rscriptType.test(node.type || "") &&
							!dataPriv.access(node, "globalEval") &&
							jQuery.contains(doc, node)) {

							if (node.src) {

								// Optional AJAX dependency, but won't run scripts if not present
								if (jQuery._evalUrl) {
									jQuery._evalUrl(node.src);
								}
							} else {
								DOMEval(node.textContent.replace(rcleanScript, ""), doc);
							}
						}
					}
				}
			}
		}

		return collection;
	}

	function remove(elem, selector, keepData) {
		var node,
			nodes = selector ? jQuery.filter(selector, elem) : elem,
			i = 0;

		for (; (node = nodes[i]) != null; i++) {
			if (!keepData && node.nodeType === 1) {
				jQuery.cleanData(getAll(node));
			}

			if (node.parentNode) {
				if (keepData && jQuery.contains(node.ownerDocument, node)) {
					setGlobalEval(getAll(node, "script"));
				}
				node.parentNode.removeChild(node);
			}
		}

		return elem;
	}

	jQuery.extend({
		htmlPrefilter: function (html) {
			return html.replace(rxhtmlTag, "<$1></$2>");
		},

		clone: function (elem, dataAndEvents, deepDataAndEvents) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode(true),
				inPage = jQuery.contains(elem.ownerDocument, elem);

			// Fix IE cloning issues
			if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) &&
				!jQuery.isXMLDoc(elem)) {

				// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
				destElements = getAll(clone);
				srcElements = getAll(elem);

				for (i = 0, l = srcElements.length; i < l; i++) {
					fixInput(srcElements[i], destElements[i]);
				}
			}

			// Copy the events from the original to the clone
			if (dataAndEvents) {
				if (deepDataAndEvents) {
					srcElements = srcElements || getAll(elem);
					destElements = destElements || getAll(clone);

					for (i = 0, l = srcElements.length; i < l; i++) {
						cloneCopyEvent(srcElements[i], destElements[i]);
					}
				} else {
					cloneCopyEvent(elem, clone);
				}
			}

			// Preserve script evaluation history
			destElements = getAll(clone, "script");
			if (destElements.length > 0) {
				setGlobalEval(destElements, !inPage && getAll(elem, "script"));
			}

			// Return the cloned set
			return clone;
		},

		cleanData: function (elems) {
			var data, elem, type,
				special = jQuery.event.special,
				i = 0;

			for (; (elem = elems[i]) !== undefined; i++) {
				if (acceptData(elem)) {
					if ((data = elem[dataPriv.expando])) {
						if (data.events) {
							for (type in data.events) {
								if (special[type]) {
									jQuery.event.remove(elem, type);

									// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent(elem, type, data.handle);
								}
							}
						}

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[dataPriv.expando] = undefined;
					}
					if (elem[dataUser.expando]) {

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[dataUser.expando] = undefined;
					}
				}
			}
		}
	});

	jQuery.fn.extend({
		detach: function (selector) {
			return remove(this, selector, true);
		},

		remove: function (selector) {
			return remove(this, selector);
		},

		text: function (value) {
			return access(this, function (value) {
				return value === undefined ?
					jQuery.text(this) :
					this.empty().each(function () {
						if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
							this.textContent = value;
						}
					});
			}, null, value, arguments.length);
		},

		append: function () {
			return domManip(this, arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
					var target = manipulationTarget(this, elem);
					target.appendChild(elem);
				}
			});
		},

		prepend: function () {
			return domManip(this, arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
					var target = manipulationTarget(this, elem);
					target.insertBefore(elem, target.firstChild);
				}
			});
		},

		before: function () {
			return domManip(this, arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this);
				}
			});
		},

		after: function () {
			return domManip(this, arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this.nextSibling);
				}
			});
		},

		empty: function () {
			var elem,
				i = 0;

			for (; (elem = this[i]) != null; i++) {
				if (elem.nodeType === 1) {

					// Prevent memory leaks
					jQuery.cleanData(getAll(elem, false));

					// Remove any remaining nodes
					elem.textContent = "";
				}
			}

			return this;
		},

		clone: function (dataAndEvents, deepDataAndEvents) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map(function () {
				return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
			});
		},

		html: function (value) {
			return access(this, function (value) {
				var elem = this[0] || {},
					i = 0,
					l = this.length;

				if (value === undefined && elem.nodeType === 1) {
					return elem.innerHTML;
				}

				// See if we can take a shortcut and just use innerHTML
				if (typeof value === "string" && !rnoInnerhtml.test(value) &&
					!wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

					value = jQuery.htmlPrefilter(value);

					try {
						for (; i < l; i++) {
							elem = this[i] || {};

							// Remove element nodes and prevent memory leaks
							if (elem.nodeType === 1) {
								jQuery.cleanData(getAll(elem, false));
								elem.innerHTML = value;
							}
						}

						elem = 0;

						// If using innerHTML throws an exception, use the fallback method
					} catch (e) { }
				}

				if (elem) {
					this.empty().append(value);
				}
			}, null, value, arguments.length);
		},

		replaceWith: function () {
			var ignored = [];

			// Make the changes, replacing each non-ignored context element with the new content
			return domManip(this, arguments, function (elem) {
				var parent = this.parentNode;

				if (jQuery.inArray(this, ignored) < 0) {
					jQuery.cleanData(getAll(this));
					if (parent) {
						parent.replaceChild(elem, this);
					}
				}

				// Force callback invocation
			}, ignored);
		}
	});

	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function (name, original) {
		jQuery.fn[name] = function (selector) {
			var elems,
				ret = [],
				insert = jQuery(selector),
				last = insert.length - 1,
				i = 0;

			for (; i <= last; i++) {
				elems = i === last ? this : this.clone(true);
				jQuery(insert[i])[original](elems);

				// Support: Android <=4.0 only, PhantomJS 1 only
				// .get() because push.apply(_, arraylike) throws on ancient WebKit
				push.apply(ret, elems.get());
			}

			return this.pushStack(ret);
		};
	});
	var rmargin = (/^margin/);

	var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");

	var getStyles = function (elem) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if (!view || !view.opener) {
			view = window;
		}

		return view.getComputedStyle(elem);
	};



	(function () {

		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {

			// This is a singleton, we need to execute it only once
			if (!div) {
				return;
			}

			div.style.cssText =
				"box-sizing:border-box;" +
				"position:relative;display:block;" +
				"margin:auto;border:1px;padding:1px;" +
				"top:1%;width:50%";
			div.innerHTML = "";
			documentElement.appendChild(container);

			var divStyle = window.getComputedStyle(div);
			pixelPositionVal = divStyle.top !== "1%";

			// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
			reliableMarginLeftVal = divStyle.marginLeft === "2px";
			boxSizingReliableVal = divStyle.width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = divStyle.marginRight === "4px";

			documentElement.removeChild(container);

			// Nullify the div so it wouldn't be stored in the memory and
			// it will also be a sign that checks already performed
			div = null;
		}

		var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
			container = document.createElement("div"),
			div = document.createElement("div");

		// Finish early in limited (non-browser) environments
		if (!div.style) {
			return;
		}

		// Support: IE <=9 - 11 only
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode(true).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";

		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
			"padding:0;margin-top:1px;position:absolute";
		container.appendChild(div);

		jQuery.extend(support, {
			pixelPosition: function () {
				computeStyleTests();
				return pixelPositionVal;
			},
			boxSizingReliable: function () {
				computeStyleTests();
				return boxSizingReliableVal;
			},
			pixelMarginRight: function () {
				computeStyleTests();
				return pixelMarginRightVal;
			},
			reliableMarginLeft: function () {
				computeStyleTests();
				return reliableMarginLeftVal;
			}
		});
	})();


	function curCSS(elem, name, computed) {
		var width, minWidth, maxWidth, ret,

			// Support: Firefox 51+
			// Retrieving style before computed somehow
			// fixes an issue with getting wrong values
			// on detached elements
			style = elem.style;

		computed = computed || getStyles(elem);

		// getPropertyValue is needed for:
		//   .css('filter') (IE 9 only, #12537)
		//   .css('--customProperty) (#3144)
		if (computed) {
			ret = computed.getPropertyValue(name) || computed[name];

			if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
				ret = jQuery.style(elem, name);
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// https://drafts.csswg.org/cssom/#resolved-values
			if (!support.pixelMarginRight() && rnumnonpx.test(ret) && rmargin.test(name)) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret !== undefined ?

			// Support: IE <=9 - 11 only
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}


	function addGetHookIf(conditionFn, hookFn) {

		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function () {
				if (conditionFn()) {

					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}

				// Hook needed; redefine it so that the support test is not executed again.
				return (this.get = hookFn).apply(this, arguments);
			}
		};
	}


	var

		// Swappable if display is none or starts with table
		// except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		rcustomProp = /^--/,
		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},

		cssPrefixes = ["Webkit", "Moz", "ms"],
		emptyStyle = document.createElement("div").style;

	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName(name) {

		// Shortcut for names that are not vendor prefixed
		if (name in emptyStyle) {
			return name;
		}

		// Check for vendor prefixed names
		var capName = name[0].toUpperCase() + name.slice(1),
			i = cssPrefixes.length;

		while (i--) {
			name = cssPrefixes[i] + capName;
			if (name in emptyStyle) {
				return name;
			}
		}
	}

	// Return a property mapped along what jQuery.cssProps suggests or to
	// a vendor prefixed property.
	function finalPropName(name) {
		var ret = jQuery.cssProps[name];
		if (!ret) {
			ret = jQuery.cssProps[name] = vendorPropName(name) || name;
		}
		return ret;
	}

	function setPositiveNumber(elem, value, subtract) {

		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec(value);
		return matches ?

			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") :
			value;
	}

	function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
		var i,
			val = 0;

		// If we already have the right measurement, avoid augmentation
		if (extra === (isBorderBox ? "border" : "content")) {
			i = 4;

			// Otherwise initialize for horizontal or vertical properties
		} else {
			i = name === "width" ? 1 : 0;
		}

		for (; i < 4; i += 2) {

			// Both box models exclude margin, so add it if we want it
			if (extra === "margin") {
				val += jQuery.css(elem, extra + cssExpand[i], true, styles);
			}

			if (isBorderBox) {

				// border-box includes padding, so remove it if we want content
				if (extra === "content") {
					val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
				}

				// At this point, extra isn't border nor margin, so remove border
				if (extra !== "margin") {
					val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			} else {

				// At this point, extra isn't content, so add padding
				val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

				// At this point, extra isn't content nor padding, so add border
				if (extra !== "padding") {
					val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			}
		}

		return val;
	}

	function getWidthOrHeight(elem, name, extra) {

		// Start with computed style
		var valueIsBorderBox,
			styles = getStyles(elem),
			val = curCSS(elem, name, styles),
			isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";

		// Computed unit is not pixels. Stop here and return.
		if (rnumnonpx.test(val)) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			(support.boxSizingReliable() || val === elem.style[name]);

		// Fall back to offsetWidth/Height when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		if (val === "auto") {
			val = elem["offset" + name[0].toUpperCase() + name.slice(1)];
		}

		// Normalize "", auto, and prepare for extra
		val = parseFloat(val) || 0;

		// Use the active box-sizing model to add/subtract irrelevant styles
		return (val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || (isBorderBox ? "border" : "content"),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}

	jQuery.extend({

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function (elem, computed) {
					if (computed) {

						// We should always get a number back from opacity
						var ret = curCSS(elem, "opacity");
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},

		// Get and set the style property on a DOM Node
		style: function (elem, name, value, extra) {

			// Don't set styles on text and comment nodes
			if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase(name),
				isCustomProp = rcustomProp.test(name),
				style = elem.style;

			// Make sure that we're working with the right name. We don't
			// want to query the value if it is a CSS custom property
			// since they are user-defined.
			if (!isCustomProp) {
				name = finalPropName(origName);
			}

			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			// Check if we're setting a value
			if (value !== undefined) {
				type = typeof value;

				// Convert "+=" or "-=" to relative numbers (#7345)
				if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
					value = adjustCSS(elem, name, ret);

					// Fixes bug #9237
					type = "number";
				}

				// Make sure that null and NaN values aren't set (#7116)
				if (value == null || value !== value) {
					return;
				}

				// If a number was passed in, add the unit (except for certain CSS properties)
				if (type === "number") {
					value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
				}

				// background-* props affect original clone's values
				if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
					style[name] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if (!hooks || !("set" in hooks) ||
					(value = hooks.set(elem, value, extra)) !== undefined) {

					if (isCustomProp) {
						style.setProperty(name, value);
					} else {
						style[name] = value;
					}
				}

			} else {

				// If a hook was provided get the non-computed value from there
				if (hooks && "get" in hooks &&
					(ret = hooks.get(elem, false, extra)) !== undefined) {

					return ret;
				}

				// Otherwise just get the value from the style object
				return style[name];
			}
		},

		css: function (elem, name, extra, styles) {
			var val, num, hooks,
				origName = jQuery.camelCase(name),
				isCustomProp = rcustomProp.test(name);

			// Make sure that we're working with the right name. We don't
			// want to modify the value if it is a CSS custom property
			// since they are user-defined.
			if (!isCustomProp) {
				name = finalPropName(origName);
			}

			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			// If a hook was provided get the computed value from there
			if (hooks && "get" in hooks) {
				val = hooks.get(elem, true, extra);
			}

			// Otherwise, if a way to get the computed value exists, use that
			if (val === undefined) {
				val = curCSS(elem, name, styles);
			}

			// Convert "normal" to computed value
			if (val === "normal" && name in cssNormalTransform) {
				val = cssNormalTransform[name];
			}

			// Make numeric if forced or a qualifier was provided and val looks numeric
			if (extra === "" || extra) {
				num = parseFloat(val);
				return extra === true || isFinite(num) ? num || 0 : val;
			}

			return val;
		}
	});

	jQuery.each(["height", "width"], function (i, name) {
		jQuery.cssHooks[name] = {
			get: function (elem, computed, extra) {
				if (computed) {

					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test(jQuery.css(elem, "display")) &&

						// Support: Safari 8+
						// Table columns in Safari have non-zero offsetWidth & zero
						// getBoundingClientRect().width unless display is changed.
						// Support: IE <=11 only
						// Running getBoundingClientRect on a disconnected node
						// in IE throws an error.
						(!elem.getClientRects().length || !elem.getBoundingClientRect().width) ?
						swap(elem, cssShow, function () {
							return getWidthOrHeight(elem, name, extra);
						}) :
						getWidthOrHeight(elem, name, extra);
				}
			},

			set: function (elem, value, extra) {
				var matches,
					styles = extra && getStyles(elem),
					subtract = extra && augmentWidthOrHeight(
						elem,
						name,
						extra,
						jQuery.css(elem, "boxSizing", false, styles) === "border-box",
						styles
					);

				// Convert to pixels if value adjustment is needed
				if (subtract && (matches = rcssNum.exec(value)) &&
					(matches[3] || "px") !== "px") {

					elem.style[name] = value;
					value = jQuery.css(elem, name);
				}

				return setPositiveNumber(elem, value, subtract);
			}
		};
	});

	jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft,
		function (elem, computed) {
			if (computed) {
				return (parseFloat(curCSS(elem, "marginLeft")) ||
					elem.getBoundingClientRect().left -
					swap(elem, { marginLeft: 0 }, function () {
						return elem.getBoundingClientRect().left;
					})
				) + "px";
			}
		}
	);

	// These hooks are used by animate to expand properties
	jQuery.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function (prefix, suffix) {
		jQuery.cssHooks[prefix + suffix] = {
			expand: function (value) {
				var i = 0,
					expanded = {},

					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split(" ") : [value];

				for (; i < 4; i++) {
					expanded[prefix + cssExpand[i] + suffix] =
						parts[i] || parts[i - 2] || parts[0];
				}

				return expanded;
			}
		};

		if (!rmargin.test(prefix)) {
			jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
		}
	});

	jQuery.fn.extend({
		css: function (name, value) {
			return access(this, function (elem, name, value) {
				var styles, len,
					map = {},
					i = 0;

				if (Array.isArray(name)) {
					styles = getStyles(elem);
					len = name.length;

					for (; i < len; i++) {
						map[name[i]] = jQuery.css(elem, name[i], false, styles);
					}

					return map;
				}

				return value !== undefined ?
					jQuery.style(elem, name, value) :
					jQuery.css(elem, name);
			}, name, value, arguments.length > 1);
		}
	});


	function Tween(elem, options, prop, end, easing) {
		return new Tween.prototype.init(elem, options, prop, end, easing);
	}
	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function (elem, options, prop, end, easing, unit) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
		},
		cur: function () {
			var hooks = Tween.propHooks[this.prop];

			return hooks && hooks.get ?
				hooks.get(this) :
				Tween.propHooks._default.get(this);
		},
		run: function (percent) {
			var eased,
				hooks = Tween.propHooks[this.prop];

			if (this.options.duration) {
				this.pos = eased = jQuery.easing[this.easing](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = (this.end - this.start) * eased + this.start;

			if (this.options.step) {
				this.options.step.call(this.elem, this.now, this);
			}

			if (hooks && hooks.set) {
				hooks.set(this);
			} else {
				Tween.propHooks._default.set(this);
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function (tween) {
				var result;

				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if (tween.elem.nodeType !== 1 ||
					tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
					return tween.elem[tween.prop];
				}

				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css(tween.elem, tween.prop, "");

				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function (tween) {

				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if (jQuery.fx.step[tween.prop]) {
					jQuery.fx.step[tween.prop](tween);
				} else if (tween.elem.nodeType === 1 &&
					(tween.elem.style[jQuery.cssProps[tween.prop]] != null ||
						jQuery.cssHooks[tween.prop])) {
					jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
				} else {
					tween.elem[tween.prop] = tween.now;
				}
			}
		}
	};

	// Support: IE <=9 only
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function (tween) {
			if (tween.elem.nodeType && tween.elem.parentNode) {
				tween.elem[tween.prop] = tween.now;
			}
		}
	};

	jQuery.easing = {
		linear: function (p) {
			return p;
		},
		swing: function (p) {
			return 0.5 - Math.cos(p * Math.PI) / 2;
		},
		_default: "swing"
	};

	jQuery.fx = Tween.prototype.init;

	// Back compat <1.8 extension point
	jQuery.fx.step = {};




	var
		fxNow, inProgress,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;

	function schedule() {
		if (inProgress) {
			if (document.hidden === false && window.requestAnimationFrame) {
				window.requestAnimationFrame(schedule);
			} else {
				window.setTimeout(schedule, jQuery.fx.interval);
			}

			jQuery.fx.tick();
		}
	}

	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout(function () {
			fxNow = undefined;
		});
		return (fxNow = jQuery.now());
	}

	// Generate parameters to create a standard animation
	function genFx(type, includeWidth) {
		var which,
			i = 0,
			attrs = { height: type };

		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for (; i < 4; i += 2 - includeWidth) {
			which = cssExpand[i];
			attrs["margin" + which] = attrs["padding" + which] = type;
		}

		if (includeWidth) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween(value, prop, animation) {
		var tween,
			collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]),
			index = 0,
			length = collection.length;
		for (; index < length; index++) {
			if ((tween = collection[index].call(animation, prop, value))) {

				// We're done with this property
				return tween;
			}
		}
	}

	function defaultPrefilter(elem, props, opts) {
		var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
			isBox = "width" in props || "height" in props,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHiddenWithinTree(elem),
			dataShow = dataPriv.get(elem, "fxshow");

		// Queue-skipping animations hijack the fx hooks
		if (!opts.queue) {
			hooks = jQuery._queueHooks(elem, "fx");
			if (hooks.unqueued == null) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function () {
					if (!hooks.unqueued) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always(function () {

				// Ensure the complete handler is called before this completes
				anim.always(function () {
					hooks.unqueued--;
					if (!jQuery.queue(elem, "fx").length) {
						hooks.empty.fire();
					}
				});
			});
		}

		// Detect show/hide animations
		for (prop in props) {
			value = props[prop];
			if (rfxtypes.test(value)) {
				delete props[prop];
				toggle = toggle || value === "toggle";
				if (value === (hidden ? "hide" : "show")) {

					// Pretend to be hidden if this is a "show" and
					// there is still data from a stopped show/hide
					if (value === "show" && dataShow && dataShow[prop] !== undefined) {
						hidden = true;

						// Ignore all other no-op show/hide data
					} else {
						continue;
					}
				}
				orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
			}
		}

		// Bail out if this is a no-op like .hide().hide()
		propTween = !jQuery.isEmptyObject(props);
		if (!propTween && jQuery.isEmptyObject(orig)) {
			return;
		}

		// Restrict "overflow" and "display" styles during box animations
		if (isBox && elem.nodeType === 1) {

			// Support: IE <=9 - 11, Edge 12 - 13
			// Record all 3 overflow attributes because IE does not infer the shorthand
			// from identically-valued overflowX and overflowY
			opts.overflow = [style.overflow, style.overflowX, style.overflowY];

			// Identify a display type, preferring old show/hide data over the CSS cascade
			restoreDisplay = dataShow && dataShow.display;
			if (restoreDisplay == null) {
				restoreDisplay = dataPriv.get(elem, "display");
			}
			display = jQuery.css(elem, "display");
			if (display === "none") {
				if (restoreDisplay) {
					display = restoreDisplay;
				} else {

					// Get nonempty value(s) by temporarily forcing visibility
					showHide([elem], true);
					restoreDisplay = elem.style.display || restoreDisplay;
					display = jQuery.css(elem, "display");
					showHide([elem]);
				}
			}

			// Animate inline elements as inline-block
			if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
				if (jQuery.css(elem, "float") === "none") {

					// Restore the original display value at the end of pure show/hide animations
					if (!propTween) {
						anim.done(function () {
							style.display = restoreDisplay;
						});
						if (restoreDisplay == null) {
							display = style.display;
							restoreDisplay = display === "none" ? "" : display;
						}
					}
					style.display = "inline-block";
				}
			}
		}

		if (opts.overflow) {
			style.overflow = "hidden";
			anim.always(function () {
				style.overflow = opts.overflow[0];
				style.overflowX = opts.overflow[1];
				style.overflowY = opts.overflow[2];
			});
		}

		// Implement show/hide animations
		propTween = false;
		for (prop in orig) {

			// General show/hide setup for this element animation
			if (!propTween) {
				if (dataShow) {
					if ("hidden" in dataShow) {
						hidden = dataShow.hidden;
					}
				} else {
					dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
				}

				if (toggle) {
					dataShow.hidden = !hidden;
				}

				// Show elements before animating them
				if (hidden) {
					showHide([elem], true);
				}

				/* eslint-disable no-loop-func */

				anim.done(function () {

					/* eslint-enable no-loop-func */

					// The final step of a "hide" animation is actually hiding the element
					if (!hidden) {
						showHide([elem]);
					}
					dataPriv.remove(elem, "fxshow");
					for (prop in orig) {
						jQuery.style(elem, prop, orig[prop]);
					}
				});
			}

			// Per-property setup
			propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
			if (!(prop in dataShow)) {
				dataShow[prop] = propTween.start;
				if (hidden) {
					propTween.end = propTween.start;
					propTween.start = 0;
				}
			}
		}
	}

	function propFilter(props, specialEasing) {
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for (index in props) {
			name = jQuery.camelCase(index);
			easing = specialEasing[name];
			value = props[index];
			if (Array.isArray(value)) {
				easing = value[1];
				value = props[index] = value[0];
			}

			if (index !== name) {
				props[name] = value;
				delete props[index];
			}

			hooks = jQuery.cssHooks[name];
			if (hooks && "expand" in hooks) {
				value = hooks.expand(value);
				delete props[name];

				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for (index in value) {
					if (!(index in props)) {
						props[index] = value[index];
						specialEasing[index] = easing;
					}
				}
			} else {
				specialEasing[name] = easing;
			}
		}
	}

	function Animation(elem, properties, options) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always(function () {

				// Don't match elem in the :animated selector
				delete tick.elem;
			}),
			tick = function () {
				if (stopped) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max(0, animation.startTime + animation.duration - currentTime),

					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;

				for (; index < length; index++) {
					animation.tweens[index].run(percent);
				}

				deferred.notifyWith(elem, [animation, percent, remaining]);

				// If there's more to do, yield
				if (percent < 1 && length) {
					return remaining;
				}

				// If this was an empty animation, synthesize a final progress notification
				if (!length) {
					deferred.notifyWith(elem, [animation, 1, 0]);
				}

				// Resolve the animation and report its conclusion
				deferred.resolveWith(elem, [animation]);
				return false;
			},
			animation = deferred.promise({
				elem: elem,
				props: jQuery.extend({}, properties),
				opts: jQuery.extend(true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function (prop, end) {
					var tween = jQuery.Tween(elem, animation.opts, prop, end,
						animation.opts.specialEasing[prop] || animation.opts.easing);
					animation.tweens.push(tween);
					return tween;
				},
				stop: function (gotoEnd) {
					var index = 0,

						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if (stopped) {
						return this;
					}
					stopped = true;
					for (; index < length; index++) {
						animation.tweens[index].run(1);
					}

					// Resolve when we played the last frame; otherwise, reject
					if (gotoEnd) {
						deferred.notifyWith(elem, [animation, 1, 0]);
						deferred.resolveWith(elem, [animation, gotoEnd]);
					} else {
						deferred.rejectWith(elem, [animation, gotoEnd]);
					}
					return this;
				}
			}),
			props = animation.props;

		propFilter(props, animation.opts.specialEasing);

		for (; index < length; index++) {
			result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
			if (result) {
				if (jQuery.isFunction(result.stop)) {
					jQuery._queueHooks(animation.elem, animation.opts.queue).stop =
						jQuery.proxy(result.stop, result);
				}
				return result;
			}
		}

		jQuery.map(props, createTween, animation);

		if (jQuery.isFunction(animation.opts.start)) {
			animation.opts.start.call(elem, animation);
		}

		// Attach callbacks from options
		animation
			.progress(animation.opts.progress)
			.done(animation.opts.done, animation.opts.complete)
			.fail(animation.opts.fail)
			.always(animation.opts.always);

		jQuery.fx.timer(
			jQuery.extend(tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			})
		);

		return animation;
	}

	jQuery.Animation = jQuery.extend(Animation, {

		tweeners: {
			"*": [function (prop, value) {
				var tween = this.createTween(prop, value);
				adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
				return tween;
			}]
		},

		tweener: function (props, callback) {
			if (jQuery.isFunction(props)) {
				callback = props;
				props = ["*"];
			} else {
				props = props.match(rnothtmlwhite);
			}

			var prop,
				index = 0,
				length = props.length;

			for (; index < length; index++) {
				prop = props[index];
				Animation.tweeners[prop] = Animation.tweeners[prop] || [];
				Animation.tweeners[prop].unshift(callback);
			}
		},

		prefilters: [defaultPrefilter],

		prefilter: function (callback, prepend) {
			if (prepend) {
				Animation.prefilters.unshift(callback);
			} else {
				Animation.prefilters.push(callback);
			}
		}
	});

	jQuery.speed = function (speed, easing, fn) {
		var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing ||
			jQuery.isFunction(speed) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		// Go to the end state if fx are off
		if (jQuery.fx.off) {
			opt.duration = 0;

		} else {
			if (typeof opt.duration !== "number") {
				if (opt.duration in jQuery.fx.speeds) {
					opt.duration = jQuery.fx.speeds[opt.duration];

				} else {
					opt.duration = jQuery.fx.speeds._default;
				}
			}
		}

		// Normalize opt.queue - true/undefined/null -> "fx"
		if (opt.queue == null || opt.queue === true) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function () {
			if (jQuery.isFunction(opt.old)) {
				opt.old.call(this);
			}

			if (opt.queue) {
				jQuery.dequeue(this, opt.queue);
			}
		};

		return opt;
	};

	jQuery.fn.extend({
		fadeTo: function (speed, to, easing, callback) {

			// Show any hidden elements after setting opacity to 0
			return this.filter(isHiddenWithinTree).css("opacity", 0).show()

				// Animate to the value specified
				.end().animate({ opacity: to }, speed, easing, callback);
		},
		animate: function (prop, speed, easing, callback) {
			var empty = jQuery.isEmptyObject(prop),
				optall = jQuery.speed(speed, easing, callback),
				doAnimation = function () {

					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation(this, jQuery.extend({}, prop), optall);

					// Empty animations, or finishing resolves immediately
					if (empty || dataPriv.get(this, "finish")) {
						anim.stop(true);
					}
				};
			doAnimation.finish = doAnimation;

			return empty || optall.queue === false ?
				this.each(doAnimation) :
				this.queue(optall.queue, doAnimation);
		},
		stop: function (type, clearQueue, gotoEnd) {
			var stopQueue = function (hooks) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop(gotoEnd);
			};

			if (typeof type !== "string") {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if (clearQueue && type !== false) {
				this.queue(type || "fx", []);
			}

			return this.each(function () {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = dataPriv.get(this);

				if (index) {
					if (data[index] && data[index].stop) {
						stopQueue(data[index]);
					}
				} else {
					for (index in data) {
						if (data[index] && data[index].stop && rrun.test(index)) {
							stopQueue(data[index]);
						}
					}
				}

				for (index = timers.length; index--;) {
					if (timers[index].elem === this &&
						(type == null || timers[index].queue === type)) {

						timers[index].anim.stop(gotoEnd);
						dequeue = false;
						timers.splice(index, 1);
					}
				}

				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if (dequeue || !gotoEnd) {
					jQuery.dequeue(this, type);
				}
			});
		},
		finish: function (type) {
			if (type !== false) {
				type = type || "fx";
			}
			return this.each(function () {
				var index,
					data = dataPriv.get(this),
					queue = data[type + "queue"],
					hooks = data[type + "queueHooks"],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;

				// Enable finishing flag on private data
				data.finish = true;

				// Empty the queue first
				jQuery.queue(this, type, []);

				if (hooks && hooks.stop) {
					hooks.stop.call(this, true);
				}

				// Look for any active animations, and finish them
				for (index = timers.length; index--;) {
					if (timers[index].elem === this && timers[index].queue === type) {
						timers[index].anim.stop(true);
						timers.splice(index, 1);
					}
				}

				// Look for any animations in the old queue and finish them
				for (index = 0; index < length; index++) {
					if (queue[index] && queue[index].finish) {
						queue[index].finish.call(this);
					}
				}

				// Turn off finishing flag
				delete data.finish;
			});
		}
	});

	jQuery.each(["toggle", "show", "hide"], function (i, name) {
		var cssFn = jQuery.fn[name];
		jQuery.fn[name] = function (speed, easing, callback) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply(this, arguments) :
				this.animate(genFx(name, true), speed, easing, callback);
		};
	});

	// Generate shortcuts for custom animations
	jQuery.each({
		slideDown: genFx("show"),
		slideUp: genFx("hide"),
		slideToggle: genFx("toggle"),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function (name, props) {
		jQuery.fn[name] = function (speed, easing, callback) {
			return this.animate(props, speed, easing, callback);
		};
	});

	jQuery.timers = [];
	jQuery.fx.tick = function () {
		var timer,
			i = 0,
			timers = jQuery.timers;

		fxNow = jQuery.now();

		for (; i < timers.length; i++) {
			timer = timers[i];

			// Run the timer and safely remove it when done (allowing for external removal)
			if (!timer() && timers[i] === timer) {
				timers.splice(i--, 1);
			}
		}

		if (!timers.length) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function (timer) {
		jQuery.timers.push(timer);
		jQuery.fx.start();
	};

	jQuery.fx.interval = 13;
	jQuery.fx.start = function () {
		if (inProgress) {
			return;
		}

		inProgress = true;
		schedule();
	};

	jQuery.fx.stop = function () {
		inProgress = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,

		// Default speed
		_default: 400
	};


	// Based off of the plugin by Clint Helfers, with permission.
	// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function (time, type) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue(type, function (next, hooks) {
			var timeout = window.setTimeout(next, time);
			hooks.stop = function () {
				window.clearTimeout(timeout);
			};
		});
	};


	(function () {
		var input = document.createElement("input"),
			select = document.createElement("select"),
			opt = select.appendChild(document.createElement("option"));

		input.type = "checkbox";

		// Support: Android <=4.3 only
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";

		// Support: IE <=11 only
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;

		// Support: IE <=11 only
		// An input loses its value after becoming a radio
		input = document.createElement("input");
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	})();


	var boolHook,
		attrHandle = jQuery.expr.attrHandle;

	jQuery.fn.extend({
		attr: function (name, value) {
			return access(this, jQuery.attr, name, value, arguments.length > 1);
		},

		removeAttr: function (name) {
			return this.each(function () {
				jQuery.removeAttr(this, name);
			});
		}
	});

	jQuery.extend({
		attr: function (elem, name, value) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set attributes on text, comment and attribute nodes
			if (nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			// Fallback to prop when attributes are not supported
			if (typeof elem.getAttribute === "undefined") {
				return jQuery.prop(elem, name, value);
			}

			// Attribute hooks are determined by the lowercase version
			// Grab necessary hook if one is defined
			if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
				hooks = jQuery.attrHooks[name.toLowerCase()] ||
					(jQuery.expr.match.bool.test(name) ? boolHook : undefined);
			}

			if (value !== undefined) {
				if (value === null) {
					jQuery.removeAttr(elem, name);
					return;
				}

				if (hooks && "set" in hooks &&
					(ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;
				}

				elem.setAttribute(name, value + "");
				return value;
			}

			if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
				return ret;
			}

			ret = jQuery.find.attr(elem, name);

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},

		attrHooks: {
			type: {
				set: function (elem, value) {
					if (!support.radioValue && value === "radio" &&
						nodeName(elem, "input")) {
						var val = elem.value;
						elem.setAttribute("type", value);
						if (val) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},

		removeAttr: function (elem, value) {
			var name,
				i = 0,

				// Attribute names can contain non-HTML whitespace characters
				// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
				attrNames = value && value.match(rnothtmlwhite);

			if (attrNames && elem.nodeType === 1) {
				while ((name = attrNames[i++])) {
					elem.removeAttribute(name);
				}
			}
		}
	});

	// Hooks for boolean attributes
	boolHook = {
		set: function (elem, value, name) {
			if (value === false) {

				// Remove boolean attributes when set to false
				jQuery.removeAttr(elem, name);
			} else {
				elem.setAttribute(name, name);
			}
			return name;
		}
	};

	jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
		var getter = attrHandle[name] || jQuery.find.attr;

		attrHandle[name] = function (elem, name, isXML) {
			var ret, handle,
				lowercaseName = name.toLowerCase();

			if (!isXML) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[lowercaseName];
				attrHandle[lowercaseName] = ret;
				ret = getter(elem, name, isXML) != null ?
					lowercaseName :
					null;
				attrHandle[lowercaseName] = handle;
			}
			return ret;
		};
	});




	var rfocusable = /^(?:input|select|textarea|button)$/i,
		rclickable = /^(?:a|area)$/i;

	jQuery.fn.extend({
		prop: function (name, value) {
			return access(this, jQuery.prop, name, value, arguments.length > 1);
		},

		removeProp: function (name) {
			return this.each(function () {
				delete this[jQuery.propFix[name] || name];
			});
		}
	});

	jQuery.extend({
		prop: function (elem, name, value) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set properties on text, comment and attribute nodes
			if (nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			if (nType !== 1 || !jQuery.isXMLDoc(elem)) {

				// Fix name and attach hooks
				name = jQuery.propFix[name] || name;
				hooks = jQuery.propHooks[name];
			}

			if (value !== undefined) {
				if (hooks && "set" in hooks &&
					(ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;
				}

				return (elem[name] = value);
			}

			if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
				return ret;
			}

			return elem[name];
		},

		propHooks: {
			tabIndex: {
				get: function (elem) {

					// Support: IE <=9 - 11 only
					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr(elem, "tabindex");

					if (tabindex) {
						return parseInt(tabindex, 10);
					}

					if (
						rfocusable.test(elem.nodeName) ||
						rclickable.test(elem.nodeName) &&
						elem.href
					) {
						return 0;
					}

					return -1;
				}
			}
		},

		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	});

	// Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	// eslint rule "no-unused-expressions" is disabled for this code
	// since it considers such accessions noop
	if (!support.optSelected) {
		jQuery.propHooks.selected = {
			get: function (elem) {

				/* eslint no-unused-expressions: "off" */

				var parent = elem.parentNode;
				if (parent && parent.parentNode) {
					parent.parentNode.selectedIndex;
				}
				return null;
			},
			set: function (elem) {

				/* eslint no-unused-expressions: "off" */

				var parent = elem.parentNode;
				if (parent) {
					parent.selectedIndex;

					if (parent.parentNode) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}

	jQuery.each([
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function () {
		jQuery.propFix[this.toLowerCase()] = this;
	});




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse(value) {
		var tokens = value.match(rnothtmlwhite) || [];
		return tokens.join(" ");
	}


	function getClass(elem) {
		return elem.getAttribute && elem.getAttribute("class") || "";
	}

	jQuery.fn.extend({
		addClass: function (value) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if (jQuery.isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).addClass(value.call(this, j, getClass(this)));
				});
			}

			if (typeof value === "string" && value) {
				classes = value.match(rnothtmlwhite) || [];

				while ((elem = this[i++])) {
					curValue = getClass(elem);
					cur = elem.nodeType === 1 && (" " + stripAndCollapse(curValue) + " ");

					if (cur) {
						j = 0;
						while ((clazz = classes[j++])) {
							if (cur.indexOf(" " + clazz + " ") < 0) {
								cur += clazz + " ";
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse(cur);
						if (curValue !== finalValue) {
							elem.setAttribute("class", finalValue);
						}
					}
				}
			}

			return this;
		},

		removeClass: function (value) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if (jQuery.isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).removeClass(value.call(this, j, getClass(this)));
				});
			}

			if (!arguments.length) {
				return this.attr("class", "");
			}

			if (typeof value === "string" && value) {
				classes = value.match(rnothtmlwhite) || [];

				while ((elem = this[i++])) {
					curValue = getClass(elem);

					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 && (" " + stripAndCollapse(curValue) + " ");

					if (cur) {
						j = 0;
						while ((clazz = classes[j++])) {

							// Remove *all* instances
							while (cur.indexOf(" " + clazz + " ") > -1) {
								cur = cur.replace(" " + clazz + " ", " ");
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse(cur);
						if (curValue !== finalValue) {
							elem.setAttribute("class", finalValue);
						}
					}
				}
			}

			return this;
		},

		toggleClass: function (value, stateVal) {
			var type = typeof value;

			if (typeof stateVal === "boolean" && type === "string") {
				return stateVal ? this.addClass(value) : this.removeClass(value);
			}

			if (jQuery.isFunction(value)) {
				return this.each(function (i) {
					jQuery(this).toggleClass(
						value.call(this, i, getClass(this), stateVal),
						stateVal
					);
				});
			}

			return this.each(function () {
				var className, i, self, classNames;

				if (type === "string") {

					// Toggle individual class names
					i = 0;
					self = jQuery(this);
					classNames = value.match(rnothtmlwhite) || [];

					while ((className = classNames[i++])) {

						// Check each className given, space separated list
						if (self.hasClass(className)) {
							self.removeClass(className);
						} else {
							self.addClass(className);
						}
					}

					// Toggle whole class name
				} else if (value === undefined || type === "boolean") {
					className = getClass(this);
					if (className) {

						// Store className if set
						dataPriv.set(this, "__className__", className);
					}

					if (this.setAttribute) {
						this.setAttribute("class",
							className || value === false ?
								"" :
								dataPriv.get(this, "__className__") || ""
						);
					}
				}
			});
		},

		hasClass: function (selector) {
			var className, elem,
				i = 0;

			className = " " + selector + " ";
			while ((elem = this[i++])) {
				if (elem.nodeType === 1 &&
					(" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
					return true;
				}
			}

			return false;
		}
	});




	var rreturn = /\r/g;

	jQuery.fn.extend({
		val: function (value) {
			var hooks, ret, isFunction,
				elem = this[0];

			if (!arguments.length) {
				if (elem) {
					hooks = jQuery.valHooks[elem.type] ||
						jQuery.valHooks[elem.nodeName.toLowerCase()];

					if (hooks &&
						"get" in hooks &&
						(ret = hooks.get(elem, "value")) !== undefined
					) {
						return ret;
					}

					ret = elem.value;

					// Handle most common string cases
					if (typeof ret === "string") {
						return ret.replace(rreturn, "");
					}

					// Handle cases where value is null/undef or number
					return ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction(value);

			return this.each(function (i) {
				var val;

				if (this.nodeType !== 1) {
					return;
				}

				if (isFunction) {
					val = value.call(this, i, jQuery(this).val());
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if (val == null) {
					val = "";

				} else if (typeof val === "number") {
					val += "";

				} else if (Array.isArray(val)) {
					val = jQuery.map(val, function (value) {
						return value == null ? "" : value + "";
					});
				}

				hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

				// If set returns undefined, fall back to normal setting
				if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
					this.value = val;
				}
			});
		}
	});

	jQuery.extend({
		valHooks: {
			option: {
				get: function (elem) {

					var val = jQuery.find.attr(elem, "value");
					return val != null ?
						val :

						// Support: IE <=10 - 11 only
						// option.text throws exceptions (#14686, #14858)
						// Strip and collapse whitespace
						// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
						stripAndCollapse(jQuery.text(elem));
				}
			},
			select: {
				get: function (elem) {
					var value, option, i,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one",
						values = one ? null : [],
						max = one ? index + 1 : options.length;

					if (index < 0) {
						i = max;

					} else {
						i = one ? index : 0;
					}

					// Loop through all the selected options
					for (; i < max; i++) {
						option = options[i];

						// Support: IE <=9 only
						// IE8-9 doesn't update selected after form reset (#2551)
						if ((option.selected || i === index) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							(!option.parentNode.disabled ||
								!nodeName(option.parentNode, "optgroup"))) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if (one) {
								return value;
							}

							// Multi-Selects return an array
							values.push(value);
						}
					}

					return values;
				},

				set: function (elem, value) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray(value),
						i = options.length;

					while (i--) {
						option = options[i];

						/* eslint-disable no-cond-assign */

						if (option.selected =
							jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1
						) {
							optionSet = true;
						}

						/* eslint-enable no-cond-assign */
					}

					// Force browsers to behave consistently when non-matching value is set
					if (!optionSet) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	});

	// Radios and checkboxes getter/setter
	jQuery.each(["radio", "checkbox"], function () {
		jQuery.valHooks[this] = {
			set: function (elem, value) {
				if (Array.isArray(value)) {
					return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1);
				}
			}
		};
		if (!support.checkOn) {
			jQuery.valHooks[this].get = function (elem) {
				return elem.getAttribute("value") === null ? "on" : elem.value;
			};
		}
	});




	// Return jQuery for attributes-only inclusion


	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

	jQuery.extend(jQuery.event, {

		trigger: function (event, data, elem, onlyHandlers) {

			var i, cur, tmp, bubbleType, ontype, handle, special,
				eventPath = [elem || document],
				type = hasOwn.call(event, "type") ? event.type : event,
				namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

			cur = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if (elem.nodeType === 3 || elem.nodeType === 8) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if (rfocusMorph.test(type + jQuery.event.triggered)) {
				return;
			}

			if (type.indexOf(".") > -1) {

				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf(":") < 0 && "on" + type;

			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[jQuery.expando] ?
				event :
				new jQuery.Event(type, typeof event === "object" && event);

			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join(".");
			event.rnamespace = event.namespace ?
				new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") :
				null;

			// Clean up the event in case it is being reused
			event.result = undefined;
			if (!event.target) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[event] :
				jQuery.makeArray(data, [event]);

			// Allow special events to draw outside the lines
			special = jQuery.event.special[type] || {};
			if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {

				bubbleType = special.delegateType || type;
				if (!rfocusMorph.test(bubbleType + type)) {
					cur = cur.parentNode;
				}
				for (; cur; cur = cur.parentNode) {
					eventPath.push(cur);
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if (tmp === (elem.ownerDocument || document)) {
					eventPath.push(tmp.defaultView || tmp.parentWindow || window);
				}
			}

			// Fire handlers on the event path
			i = 0;
			while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {

				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;

				// jQuery handler
				handle = (dataPriv.get(cur, "events") || {})[event.type] &&
					dataPriv.get(cur, "handle");
				if (handle) {
					handle.apply(cur, data);
				}

				// Native handler
				handle = ontype && cur[ontype];
				if (handle && handle.apply && acceptData(cur)) {
					event.result = handle.apply(cur, data);
					if (event.result === false) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if (!onlyHandlers && !event.isDefaultPrevented()) {

				if ((!special._default ||
					special._default.apply(eventPath.pop(), data) === false) &&
					acceptData(elem)) {

					// Call a native DOM method on the target with the same name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if (ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem)) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ontype];

						if (tmp) {
							elem[ontype] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[type]();
						jQuery.event.triggered = undefined;

						if (tmp) {
							elem[ontype] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		simulate: function (type, elem, event) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true
				}
			);

			jQuery.event.trigger(e, null, elem);
		}

	});

	jQuery.fn.extend({

		trigger: function (type, data) {
			return this.each(function () {
				jQuery.event.trigger(type, data, this);
			});
		},
		triggerHandler: function (type, data) {
			var elem = this[0];
			if (elem) {
				return jQuery.event.trigger(type, data, elem, true);
			}
		}
	});


	jQuery.each(("blur focus focusin focusout resize scroll click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup contextmenu").split(" "),
		function (i, name) {

			// Handle event binding
			jQuery.fn[name] = function (data, fn) {
				return arguments.length > 0 ?
					this.on(name, null, data, fn) :
					this.trigger(name);
			};
		});

	jQuery.fn.extend({
		hover: function (fnOver, fnOut) {
			return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
		}
	});




	support.focusin = "onfocusin" in window;


	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	if (!support.focusin) {
		jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function (event) {
				jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
			};

			jQuery.event.special[fix] = {
				setup: function () {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access(doc, fix);

					if (!attaches) {
						doc.addEventListener(orig, handler, true);
					}
					dataPriv.access(doc, fix, (attaches || 0) + 1);
				},
				teardown: function () {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access(doc, fix) - 1;

					if (!attaches) {
						doc.removeEventListener(orig, handler, true);
						dataPriv.remove(doc, fix);

					} else {
						dataPriv.access(doc, fix, attaches);
					}
				}
			};
		});
	}
	var location = window.location;

	var nonce = jQuery.now();

	var rquery = (/\?/);



	// Cross-browser xml parsing
	jQuery.parseXML = function (data) {
		var xml;
		if (!data || typeof data !== "string") {
			return null;
		}

		// Support: IE 9 - 11 only
		// IE throws on parseFromString with invalid input.
		try {
			xml = (new window.DOMParser()).parseFromString(data, "text/xml");
		} catch (e) {
			xml = undefined;
		}

		if (!xml || xml.getElementsByTagName("parsererror").length) {
			jQuery.error("Invalid XML: " + data);
		}
		return xml;
	};


	var
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams(prefix, obj, traditional, add) {
		var name;

		if (Array.isArray(obj)) {

			// Serialize array item.
			jQuery.each(obj, function (i, v) {
				if (traditional || rbracket.test(prefix)) {

					// Treat each array item as a scalar.
					add(prefix, v);

				} else {

					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]",
						v,
						traditional,
						add
					);
				}
			});

		} else if (!traditional && jQuery.type(obj) === "object") {

			// Serialize object item.
			for (name in obj) {
				buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
			}

		} else {

			// Serialize scalar item.
			add(prefix, obj);
		}
	}

	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function (a, traditional) {
		var prefix,
			s = [],
			add = function (key, valueOrFunction) {

				// If value is a function, invoke it and use its return value
				var value = jQuery.isFunction(valueOrFunction) ?
					valueOrFunction() :
					valueOrFunction;

				s[s.length] = encodeURIComponent(key) + "=" +
					encodeURIComponent(value == null ? "" : value);
			};

		// If an array was passed in, assume that it is an array of form elements.
		if (Array.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {

			// Serialize the form elements
			jQuery.each(a, function () {
				add(this.name, this.value);
			});

		} else {

			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for (prefix in a) {
				buildParams(prefix, a[prefix], traditional, add);
			}
		}

		// Return the resulting serialization
		return s.join("&");
	};

	jQuery.fn.extend({
		serialize: function () {
			return jQuery.param(this.serializeArray());
		},
		serializeArray: function () {
			return this.map(function () {

				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop(this, "elements");
				return elements ? jQuery.makeArray(elements) : this;
			})
				.filter(function () {
					var type = this.type;

					// Use .is( ":disabled" ) so that fieldset[disabled] works
					return this.name && !jQuery(this).is(":disabled") &&
						rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) &&
						(this.checked || !rcheckableType.test(type));
				})
				.map(function (i, elem) {
					var val = jQuery(this).val();

					if (val == null) {
						return null;
					}

					if (Array.isArray(val)) {
						return jQuery.map(val, function (val) {
							return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
						});
					}

					return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
				}).get();
		}
	});


	var
		r20 = /%20/g,
		rhash = /#.*$/,
		rantiCache = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,

		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},

		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},

		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat("*"),

		// Anchor tag for parsing the document origin
		originAnchor = document.createElement("a");
	originAnchor.href = location.href;

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports(structure) {

		// dataTypeExpression is optional and defaults to "*"
		return function (dataTypeExpression, func) {

			if (typeof dataTypeExpression !== "string") {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];

			if (jQuery.isFunction(func)) {

				// For each dataType in the dataTypeExpression
				while ((dataType = dataTypes[i++])) {

					// Prepend if requested
					if (dataType[0] === "+") {
						dataType = dataType.slice(1) || "*";
						(structure[dataType] = structure[dataType] || []).unshift(func);

						// Otherwise append
					} else {
						(structure[dataType] = structure[dataType] || []).push(func);
					}
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {

		var inspected = {},
			seekingTransport = (structure === transports);

		function inspect(dataType) {
			var selected;
			inspected[dataType] = true;
			jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
				var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
				if (typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[dataTypeOrTransport]) {

					options.dataTypes.unshift(dataTypeOrTransport);
					inspect(dataTypeOrTransport);
					return false;
				} else if (seekingTransport) {
					return !(selected = dataTypeOrTransport);
				}
			});
			return selected;
		}

		return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend(target, src) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for (key in src) {
			if (src[key] !== undefined) {
				(flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
			}
		}
		if (deep) {
			jQuery.extend(true, target, deep);
		}

		return target;
	}

	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses(s, jqXHR, responses) {

		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;

		// Remove auto dataType and get content-type in the process
		while (dataTypes[0] === "*") {
			dataTypes.shift();
			if (ct === undefined) {
				ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
			}
		}

		// Check if we're dealing with a known content-type
		if (ct) {
			for (type in contents) {
				if (contents[type] && contents[type].test(ct)) {
					dataTypes.unshift(type);
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if (dataTypes[0] in responses) {
			finalDataType = dataTypes[0];
		} else {

			// Try convertible dataTypes
			for (type in responses) {
				if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
					finalDataType = type;
					break;
				}
				if (!firstDataType) {
					firstDataType = type;
				}
			}

			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if (finalDataType) {
			if (finalDataType !== dataTypes[0]) {
				dataTypes.unshift(finalDataType);
			}
			return responses[finalDataType];
		}
	}

	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert(s, response, jqXHR, isSuccess) {
		var conv2, current, conv, tmp, prev,
			converters = {},

			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();

		// Create converters map with lowercased keys
		if (dataTypes[1]) {
			for (conv in s.converters) {
				converters[conv.toLowerCase()] = s.converters[conv];
			}
		}

		current = dataTypes.shift();

		// Convert to each sequential dataType
		while (current) {

			if (s.responseFields[current]) {
				jqXHR[s.responseFields[current]] = response;
			}

			// Apply the dataFilter if provided
			if (!prev && isSuccess && s.dataFilter) {
				response = s.dataFilter(response, s.dataType);
			}

			prev = current;
			current = dataTypes.shift();

			if (current) {

				// There's only work to do if current dataType is non-auto
				if (current === "*") {

					current = prev;

					// Convert response if prev dataType is non-auto and differs from current
				} else if (prev !== "*" && prev !== current) {

					// Seek a direct converter
					conv = converters[prev + " " + current] || converters["* " + current];

					// If none found, seek a pair
					if (!conv) {
						for (conv2 in converters) {

							// If conv2 outputs current
							tmp = conv2.split(" ");
							if (tmp[1] === current) {

								// If prev can be converted to accepted input
								conv = converters[prev + " " + tmp[0]] ||
									converters["* " + tmp[0]];
								if (conv) {

									// Condense equivalence converters
									if (conv === true) {
										conv = converters[conv2];

										// Otherwise, insert the intermediate dataType
									} else if (converters[conv2] !== true) {
										current = tmp[0];
										dataTypes.unshift(tmp[1]);
									}
									break;
								}
							}
						}
					}

					// Apply converter (if not an equivalence)
					if (conv !== true) {

						// Unless errors are allowed to bubble, catch and return them
						if (conv && s.throws) {
							response = conv(response);
						} else {
							try {
								response = conv(response);
							} catch (e) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend({

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test(location.protocol),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",

			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/

			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {

				// Convert anything to text
				"* text": String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": JSON.parse,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function (target, settings) {
			return settings ?

				// Building a settings object
				ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) :

				// Extending ajaxSettings
				ajaxExtend(jQuery.ajaxSettings, target);
		},

		ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
		ajaxTransport: addToPrefiltersOrTransports(transports),

		// Main method
		ajax: function (url, options) {

			// If url is an object, simulate pre-1.5 signature
			if (typeof url === "object") {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var transport,

				// URL without anti-cache param
				cacheURL,

				// Response headers
				responseHeadersString,
				responseHeaders,

				// timeout handle
				timeoutTimer,

				// Url cleanup var
				urlAnchor,

				// Request state (becomes false upon send and true upon completion)
				completed,

				// To know if global events are to be dispatched
				fireGlobals,

				// Loop variable
				i,

				// uncached part of the url
				uncached,

				// Create the final options object
				s = jQuery.ajaxSetup({}, options),

				// Callbacks context
				callbackContext = s.context || s,

				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					(callbackContext.nodeType || callbackContext.jquery) ?
					jQuery(callbackContext) :
					jQuery.event,

				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks("once memory"),

				// Status-dependent callbacks
				statusCode = s.statusCode || {},

				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},

				// Default abort message
				strAbort = "canceled",

				// Fake xhr
				jqXHR = {
					readyState: 0,

					// Builds headers hashtable if needed
					getResponseHeader: function (key) {
						var match;
						if (completed) {
							if (!responseHeaders) {
								responseHeaders = {};
								while ((match = rheaders.exec(responseHeadersString))) {
									responseHeaders[match[1].toLowerCase()] = match[2];
								}
							}
							match = responseHeaders[key.toLowerCase()];
						}
						return match == null ? null : match;
					},

					// Raw string
					getAllResponseHeaders: function () {
						return completed ? responseHeadersString : null;
					},

					// Caches the header
					setRequestHeader: function (name, value) {
						if (completed == null) {
							name = requestHeadersNames[name.toLowerCase()] =
								requestHeadersNames[name.toLowerCase()] || name;
							requestHeaders[name] = value;
						}
						return this;
					},

					// Overrides response content-type header
					overrideMimeType: function (type) {
						if (completed == null) {
							s.mimeType = type;
						}
						return this;
					},

					// Status-dependent callbacks
					statusCode: function (map) {
						var code;
						if (map) {
							if (completed) {

								// Execute the appropriate callbacks
								jqXHR.always(map[jqXHR.status]);
							} else {

								// Lazy-add the new callbacks in a way that preserves old ones
								for (code in map) {
									statusCode[code] = [statusCode[code], map[code]];
								}
							}
						}
						return this;
					},

					// Cancel the request
					abort: function (statusText) {
						var finalText = statusText || strAbort;
						if (transport) {
							transport.abort(finalText);
						}
						done(0, finalText);
						return this;
					}
				};

			// Attach deferreds
			deferred.promise(jqXHR);

			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ((url || s.url || location.href) + "")
				.replace(rprotocol, location.protocol + "//");

			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];

			// A cross-domain request is in order when the origin doesn't match the current origin.
			if (s.crossDomain == null) {
				urlAnchor = document.createElement("a");

				// Support: IE <=8 - 11, Edge 12 - 13
				// IE throws exception on accessing the href property if url is malformed,
				// e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;

					// Support: IE <=8 - 11 only
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
						urlAnchor.protocol + "//" + urlAnchor.host;
				} catch (e) {

					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}

			// Convert data if not already a string
			if (s.data && s.processData && typeof s.data !== "string") {
				s.data = jQuery.param(s.data, s.traditional);
			}

			// Apply prefilters
			inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

			// If request was aborted inside a prefilter, stop there
			if (completed) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if (fireGlobals && jQuery.active++ === 0) {
				jQuery.event.trigger("ajaxStart");
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test(s.type);

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			// Remove hash to simplify url manipulation
			cacheURL = s.url.replace(rhash, "");

			// More options handling for requests with no content
			if (!s.hasContent) {

				// Remember the hash so we can put it back
				uncached = s.url.slice(cacheURL.length);

				// If data is available, append data to url
				if (s.data) {
					cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;

					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add or update anti-cache param if needed
				if (s.cache === false) {
					cacheURL = cacheURL.replace(rantiCache, "$1");
					uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + (nonce++) + uncached;
				}

				// Put hash and anti-cache on the URL that will be requested (gh-1732)
				s.url = cacheURL + uncached;

				// Change '%20' to '+' if this is encoded form body content (gh-2658)
			} else if (s.data && s.processData &&
				(s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
				s.data = s.data.replace(r20, "+");
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if (s.ifModified) {
				if (jQuery.lastModified[cacheURL]) {
					jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
				}
				if (jQuery.etag[cacheURL]) {
					jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
				}
			}

			// Set the correct header, if data is being sent
			if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
				jqXHR.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[0] && s.accepts[s.dataTypes[0]] ?
					s.accepts[s.dataTypes[0]] +
					(s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") :
					s.accepts["*"]
			);

			// Check for headers option
			for (i in s.headers) {
				jqXHR.setRequestHeader(i, s.headers[i]);
			}

			// Allow custom headers/mimetypes and early abort
			if (s.beforeSend &&
				(s.beforeSend.call(callbackContext, jqXHR, s) === false || completed)) {

				// Abort if not done already and return
				return jqXHR.abort();
			}

			// Aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			completeDeferred.add(s.complete);
			jqXHR.done(s.success);
			jqXHR.fail(s.error);

			// Get transport
			transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

			// If no transport, we auto-abort
			if (!transport) {
				done(-1, "No Transport");
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if (fireGlobals) {
					globalEventContext.trigger("ajaxSend", [jqXHR, s]);
				}

				// If request was aborted inside ajaxSend, stop there
				if (completed) {
					return jqXHR;
				}

				// Timeout
				if (s.async && s.timeout > 0) {
					timeoutTimer = window.setTimeout(function () {
						jqXHR.abort("timeout");
					}, s.timeout);
				}

				try {
					completed = false;
					transport.send(requestHeaders, done);
				} catch (e) {

					// Rethrow post-completion exceptions
					if (completed) {
						throw e;
					}

					// Propagate others as results
					done(-1, e);
				}
			}

			// Callback for when everything is done
			function done(status, nativeStatusText, responses, headers) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;

				// Ignore repeat invocations
				if (completed) {
					return;
				}

				completed = true;

				// Clear timeout if it exists
				if (timeoutTimer) {
					window.clearTimeout(timeoutTimer);
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if (responses) {
					response = ajaxHandleResponses(s, jqXHR, responses);
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert(s, response, jqXHR, isSuccess);

				// If successful, handle type chaining
				if (isSuccess) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if (s.ifModified) {
						modified = jqXHR.getResponseHeader("Last-Modified");
						if (modified) {
							jQuery.lastModified[cacheURL] = modified;
						}
						modified = jqXHR.getResponseHeader("etag");
						if (modified) {
							jQuery.etag[cacheURL] = modified;
						}
					}

					// if no content
					if (status === 204 || s.type === "HEAD") {
						statusText = "nocontent";

						// if not modified
					} else if (status === 304) {
						statusText = "notmodified";

						// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {

					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if (status || !statusText) {
						statusText = "error";
						if (status < 0) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = (nativeStatusText || statusText) + "";

				// Success/Error
				if (isSuccess) {
					deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
				} else {
					deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
				}

				// Status-dependent callbacks
				jqXHR.statusCode(statusCode);
				statusCode = undefined;

				if (fireGlobals) {
					globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError",
						[jqXHR, s, isSuccess ? success : error]);
				}

				// Complete
				completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

				if (fireGlobals) {
					globalEventContext.trigger("ajaxComplete", [jqXHR, s]);

					// Handle the global AJAX counter
					if (!(--jQuery.active)) {
						jQuery.event.trigger("ajaxStop");
					}
				}
			}

			return jqXHR;
		},

		getJSON: function (url, data, callback) {
			return jQuery.get(url, data, callback, "json");
		},

		getScript: function (url, callback) {
			return jQuery.get(url, undefined, callback, "script");
		}
	});

	jQuery.each(["get", "post"], function (i, method) {
		jQuery[method] = function (url, data, callback, type) {

			// Shift arguments if data argument was omitted
			if (jQuery.isFunction(data)) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			// The url can be an options object (which then must have .url)
			return jQuery.ajax(jQuery.extend({
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject(url) && url));
		};
	});


	jQuery._evalUrl = function (url) {
		return jQuery.ajax({
			url: url,

			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,
			"throws": true
		});
	};


	jQuery.fn.extend({
		wrapAll: function (html) {
			var wrap;

			if (this[0]) {
				if (jQuery.isFunction(html)) {
					html = html.call(this[0]);
				}

				// The elements to wrap the target around
				wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

				if (this[0].parentNode) {
					wrap.insertBefore(this[0]);
				}

				wrap.map(function () {
					var elem = this;

					while (elem.firstElementChild) {
						elem = elem.firstElementChild;
					}

					return elem;
				}).append(this);
			}

			return this;
		},

		wrapInner: function (html) {
			if (jQuery.isFunction(html)) {
				return this.each(function (i) {
					jQuery(this).wrapInner(html.call(this, i));
				});
			}

			return this.each(function () {
				var self = jQuery(this),
					contents = self.contents();

				if (contents.length) {
					contents.wrapAll(html);

				} else {
					self.append(html);
				}
			});
		},

		wrap: function (html) {
			var isFunction = jQuery.isFunction(html);

			return this.each(function (i) {
				jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
			});
		},

		unwrap: function (selector) {
			this.parent(selector).not("body").each(function () {
				jQuery(this).replaceWith(this.childNodes);
			});
			return this;
		}
	});


	jQuery.expr.pseudos.hidden = function (elem) {
		return !jQuery.expr.pseudos.visible(elem);
	};
	jQuery.expr.pseudos.visible = function (elem) {
		return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
	};




	jQuery.ajaxSettings.xhr = function () {
		try {
			return new window.XMLHttpRequest();
		} catch (e) { }
	};

	var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
		xhrSupported = jQuery.ajaxSettings.xhr();

	support.cors = !!xhrSupported && ("withCredentials" in xhrSupported);
	support.ajax = xhrSupported = !!xhrSupported;

	jQuery.ajaxTransport(function (options) {
		var callback, errorCallback;

		// Cross domain only allowed if supported through XMLHttpRequest
		if (support.cors || xhrSupported && !options.crossDomain) {
			return {
				send: function (headers, complete) {
					var i,
						xhr = options.xhr();

					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if (options.xhrFields) {
						for (i in options.xhrFields) {
							xhr[i] = options.xhrFields[i];
						}
					}

					// Override mime type if needed
					if (options.mimeType && xhr.overrideMimeType) {
						xhr.overrideMimeType(options.mimeType);
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if (!options.crossDomain && !headers["X-Requested-With"]) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Set headers
					for (i in headers) {
						xhr.setRequestHeader(i, headers[i]);
					}

					// Callback
					callback = function (type) {
						return function () {
							if (callback) {
								callback = errorCallback = xhr.onload =
									xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

								if (type === "abort") {
									xhr.abort();
								} else if (type === "error") {

									// Support: IE <=9 only
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if (typeof xhr.status !== "number") {
										complete(0, "error");
									} else {
										complete(

											// File: protocol always yields status 0; see #8605, #14207
											xhr.status,
											xhr.statusText
										);
									}
								} else {
									complete(
										xhrSuccessStatus[xhr.status] || xhr.status,
										xhr.statusText,

										// Support: IE <=9 only
										// IE9 has no XHR2 but throws on binary (trac-11426)
										// For XHR2 non-text, let the caller handle it (gh-2498)
										(xhr.responseType || "text") !== "text" ||
											typeof xhr.responseText !== "string" ?
											{ binary: xhr.response } :
											{ text: xhr.responseText },
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};

					// Listen to events
					xhr.onload = callback();
					errorCallback = xhr.onerror = callback("error");

					// Support: IE 9 only
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if (xhr.onabort !== undefined) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function () {

							// Check readyState before timeout as it changes
							if (xhr.readyState === 4) {

								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout(function () {
									if (callback) {
										errorCallback();
									}
								});
							}
						};
					}

					// Create the abort callback
					callback = callback("abort");

					try {

						// Do send the request (this may raise an exception)
						xhr.send(options.hasContent && options.data || null);
					} catch (e) {

						// #14683: Only rethrow if this hasn't been notified as an error yet
						if (callback) {
							throw e;
						}
					}
				},

				abort: function () {
					if (callback) {
						callback();
					}
				}
			};
		}
	});




	// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
	jQuery.ajaxPrefilter(function (s) {
		if (s.crossDomain) {
			s.contents.script = false;
		}
	});

	// Install script dataType
	jQuery.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function (text) {
				jQuery.globalEval(text);
				return text;
			}
		}
	});

	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter("script", function (s) {
		if (s.cache === undefined) {
			s.cache = false;
		}
		if (s.crossDomain) {
			s.type = "GET";
		}
	});

	// Bind script tag hack transport
	jQuery.ajaxTransport("script", function (s) {

		// This transport only deals with cross domain requests
		if (s.crossDomain) {
			var script, callback;
			return {
				send: function (_, complete) {
					script = jQuery("<script>").prop({
						charset: s.scriptCharset,
						src: s.url
					}).on(
						"load error",
						callback = function (evt) {
							script.remove();
							callback = null;
							if (evt) {
								complete(evt.type === "error" ? 404 : 200, evt.type);
							}
						}
						);

					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild(script[0]);
				},
				abort: function () {
					if (callback) {
						callback();
					}
				}
			};
		}
	});




	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;

	// Default jsonp settings
	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function () {
			var callback = oldCallbacks.pop() || (jQuery.expando + "_" + (nonce++));
			this[callback] = true;
			return callback;
		}
	});

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ?
				"url" :
				typeof s.data === "string" &&
				(s.contentType || "")
					.indexOf("application/x-www-form-urlencoded") === 0 &&
				rjsonp.test(s.data) && "data"
			);

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if (jsonProp || s.dataTypes[0] === "jsonp") {

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ?
				s.jsonpCallback() :
				s.jsonpCallback;

			// Insert callback into url or form data
			if (jsonProp) {
				s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
			} else if (s.jsonp !== false) {
				s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters["script json"] = function () {
				if (!responseContainer) {
					jQuery.error(callbackName + " was not called");
				}
				return responseContainer[0];
			};

			// Force json dataType
			s.dataTypes[0] = "json";

			// Install callback
			overwritten = window[callbackName];
			window[callbackName] = function () {
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always(function () {

				// If previous value didn't exist - remove it
				if (overwritten === undefined) {
					jQuery(window).removeProp(callbackName);

					// Otherwise restore preexisting value
				} else {
					window[callbackName] = overwritten;
				}

				// Save back as free
				if (s[callbackName]) {

					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// Save the callback name for future use
					oldCallbacks.push(callbackName);
				}

				// Call if it was a function and we have a response
				if (responseContainer && jQuery.isFunction(overwritten)) {
					overwritten(responseContainer[0]);
				}

				responseContainer = overwritten = undefined;
			});

			// Delegate to script
			return "script";
		}
	});




	// Support: Safari 8 only
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument = (function () {
		var body = document.implementation.createHTMLDocument("").body;
		body.innerHTML = "<form></form><form></form>";
		return body.childNodes.length === 2;
	})();


	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function (data, context, keepScripts) {
		if (typeof data !== "string") {
			return [];
		}
		if (typeof context === "boolean") {
			keepScripts = context;
			context = false;
		}

		var base, parsed, scripts;

		if (!context) {

			// Stop scripts or inline event handlers from being executed immediately
			// by using document.implementation
			if (support.createHTMLDocument) {
				context = document.implementation.createHTMLDocument("");

				// Set the base href for the created document
				// so any parsed elements with URLs
				// are based on the document's URL (gh-2965)
				base = context.createElement("base");
				base.href = document.location.href;
				context.head.appendChild(base);
			} else {
				context = document;
			}
		}

		parsed = rsingleTag.exec(data);
		scripts = !keepScripts && [];

		// Single tag
		if (parsed) {
			return [context.createElement(parsed[1])];
		}

		parsed = buildFragment([data], context, scripts);

		if (scripts && scripts.length) {
			jQuery(scripts).remove();
		}

		return jQuery.merge([], parsed.childNodes);
	};


	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function (url, params, callback) {
		var selector, type, response,
			self = this,
			off = url.indexOf(" ");

		if (off > -1) {
			selector = stripAndCollapse(url.slice(off));
			url = url.slice(0, off);
		}

		// If it's a function
		if (jQuery.isFunction(params)) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

			// Otherwise, build a param string
		} else if (params && typeof params === "object") {
			type = "POST";
		}

		// If we have elements to modify, make the request
		if (self.length > 0) {
			jQuery.ajax({
				url: url,

				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			}).done(function (responseText) {

				// Save response for use in complete callback
				response = arguments;

				self.html(selector ?

					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) :

					// Otherwise use the full result
					responseText);

				// If the request succeeds, this function gets "data", "status", "jqXHR"
				// but they are ignored because response was set above.
				// If it fails, this function gets "jqXHR", "status", "error"
			}).always(callback && function (jqXHR, status) {
				self.each(function () {
					callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
				});
			});
		}

		return this;
	};




	// Attach a bunch of functions for handling common AJAX events
	jQuery.each([
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function (i, type) {
		jQuery.fn[type] = function (fn) {
			return this.on(type, fn);
		};
	});




	jQuery.expr.pseudos.animated = function (elem) {
		return jQuery.grep(jQuery.timers, function (fn) {
			return elem === fn.elem;
		}).length;
	};




	jQuery.offset = {
		setOffset: function (elem, options, i) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css(elem, "position"),
				curElem = jQuery(elem),
				props = {};

			// Set position first, in-case top/left are set even on static elem
			if (position === "static") {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css(elem, "top");
			curCSSLeft = jQuery.css(elem, "left");
			calculatePosition = (position === "absolute" || position === "fixed") &&
				(curCSSTop + curCSSLeft).indexOf("auto") > -1;

			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if (calculatePosition) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;

			} else {
				curTop = parseFloat(curCSSTop) || 0;
				curLeft = parseFloat(curCSSLeft) || 0;
			}

			if (jQuery.isFunction(options)) {

				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call(elem, i, jQuery.extend({}, curOffset));
			}

			if (options.top != null) {
				props.top = (options.top - curOffset.top) + curTop;
			}
			if (options.left != null) {
				props.left = (options.left - curOffset.left) + curLeft;
			}

			if ("using" in options) {
				options.using.call(elem, props);

			} else {
				curElem.css(props);
			}
		}
	};

	jQuery.fn.extend({
		offset: function (options) {

			// Preserve chaining for setter
			if (arguments.length) {
				return options === undefined ?
					this :
					this.each(function (i) {
						jQuery.offset.setOffset(this, options, i);
					});
			}

			var doc, docElem, rect, win,
				elem = this[0];

			if (!elem) {
				return;
			}

			// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
			// Support: IE <=11 only
			// Running getBoundingClientRect on a
			// disconnected node in IE throws an error
			if (!elem.getClientRects().length) {
				return { top: 0, left: 0 };
			}

			rect = elem.getBoundingClientRect();

			doc = elem.ownerDocument;
			docElem = doc.documentElement;
			win = doc.defaultView;

			return {
				top: rect.top + win.pageYOffset - docElem.clientTop,
				left: rect.left + win.pageXOffset - docElem.clientLeft
			};
		},

		position: function () {
			if (!this[0]) {
				return;
			}

			var offsetParent, offset,
				elem = this[0],
				parentOffset = { top: 0, left: 0 };

			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if (jQuery.css(elem, "position") === "fixed") {

				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();

			} else {

				// Get *real* offsetParent
				offsetParent = this.offsetParent();

				// Get correct offsets
				offset = this.offset();
				if (!nodeName(offsetParent[0], "html")) {
					parentOffset = offsetParent.offset();
				}

				// Add offsetParent borders
				parentOffset = {
					top: parentOffset.top + jQuery.css(offsetParent[0], "borderTopWidth", true),
					left: parentOffset.left + jQuery.css(offsetParent[0], "borderLeftWidth", true)
				};
			}

			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
				left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
			};
		},

		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function () {
			return this.map(function () {
				var offsetParent = this.offsetParent;

				while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || documentElement;
			});
		}
	});

	// Create scrollLeft and scrollTop methods
	jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (method, prop) {
		var top = "pageYOffset" === prop;

		jQuery.fn[method] = function (val) {
			return access(this, function (elem, method, val) {

				// Coalesce documents and windows
				var win;
				if (jQuery.isWindow(elem)) {
					win = elem;
				} else if (elem.nodeType === 9) {
					win = elem.defaultView;
				}

				if (val === undefined) {
					return win ? win[prop] : elem[method];
				}

				if (win) {
					win.scrollTo(
						!top ? val : win.pageXOffset,
						top ? val : win.pageYOffset
					);

				} else {
					elem[method] = val;
				}
			}, method, val, arguments.length);
		};
	});

	// Support: Safari <=7 - 9.1, Chrome <=37 - 49
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each(["top", "left"], function (i, prop) {
		jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition,
			function (elem, computed) {
				if (computed) {
					computed = curCSS(elem, prop);

					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test(computed) ?
						jQuery(elem).position()[prop] + "px" :
						computed;
				}
			}
		);
	});


	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each({ Height: "height", Width: "width" }, function (name, type) {
		jQuery.each({ padding: "inner" + name, content: type, "": "outer" + name },
			function (defaultExtra, funcName) {

				// Margin is only for outerHeight, outerWidth
				jQuery.fn[funcName] = function (margin, value) {
					var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
						extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

					return access(this, function (elem, type, value) {
						var doc;

						if (jQuery.isWindow(elem)) {

							// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
							return funcName.indexOf("outer") === 0 ?
								elem["inner" + name] :
								elem.document.documentElement["client" + name];
						}

						// Get document width or height
						if (elem.nodeType === 9) {
							doc = elem.documentElement;

							// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
							// whichever is greatest
							return Math.max(
								elem.body["scroll" + name], doc["scroll" + name],
								elem.body["offset" + name], doc["offset" + name],
								doc["client" + name]
							);
						}

						return value === undefined ?

							// Get width or height on the element, requesting but not forcing parseFloat
							jQuery.css(elem, type, extra) :

							// Set width or height on the element
							jQuery.style(elem, type, value, extra);
					}, type, chainable ? margin : undefined, chainable);
				};
			});
	});


	jQuery.fn.extend({

		bind: function (types, data, fn) {
			return this.on(types, null, data, fn);
		},
		unbind: function (types, fn) {
			return this.off(types, null, fn);
		},

		delegate: function (selector, types, data, fn) {
			return this.on(types, selector, data, fn);
		},
		undelegate: function (selector, types, fn) {

			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off(selector, "**") :
				this.off(types, selector || "**", fn);
		}
	});

	jQuery.holdReady = function (hold) {
		if (hold) {
			jQuery.readyWait++;
		} else {
			jQuery.ready(true);
		}
	};
	jQuery.isArray = Array.isArray;
	jQuery.parseJSON = JSON.parse;
	jQuery.nodeName = nodeName;




	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.

	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

	if (typeof define === "function" && define.amd) {
		define("jquery", [], function () {
			return jQuery;
		});
	}




	var

		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,

		// Map over the $ in case of overwrite
		_$ = window.$;

	jQuery.noConflict = function (deep) {
		if (window.$ === jQuery) {
			window.$ = _$;
		}

		if (deep && window.jQuery === jQuery) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if (!noGlobal) {
		window.jQuery = window.$ = jQuery;
	}




	return jQuery;
});

`;

export const FULL_CODE_EXAMPLE_7 = `

	//! moment.js
//! version : 2.18.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

var hookCallback;

function hooks () {
    return hookCallback.apply(null, arguments);
}

// This is done to register the method called with moment()
// without creating circular dependencies.
function setHookCallback (callback) {
    hookCallback = callback;
}

function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}

function isObject(input) {
    // IE8 will treat undefined and null as object if it wasn't for
    // input != null
    return input != null && Object.prototype.toString.call(input) === '[object Object]';
}

function isObjectEmpty(obj) {
    var k;
    for (k in obj) {
        // even if its not own property I'd still call it non-empty
        return false;
    }
    return true;
}

function isUndefined(input) {
    return input === void 0;
}

function isNumber(input) {
    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}

function map(arr, fn) {
    var res = [], i;
    for (i = 0; i < arr.length; ++i) {
        res.push(fn(arr[i], i));
    }
    return res;
}

function hasOwnProp(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
}

function extend(a, b) {
    for (var i in b) {
        if (hasOwnProp(b, i)) {
            a[i] = b[i];
        }
    }

    if (hasOwnProp(b, 'toString')) {
        a.toString = b.toString;
    }

    if (hasOwnProp(b, 'valueOf')) {
        a.valueOf = b.valueOf;
    }

    return a;
}

function createUTC (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, true).utc();
}

function defaultParsingFlags() {
    // We need to deep clone this object.
    return {
        empty           : false,
        unusedTokens    : [],
        unusedInput     : [],
        overflow        : -2,
        charsLeftOver   : 0,
        nullInput       : false,
        invalidMonth    : null,
        invalidFormat   : false,
        userInvalidated : false,
        iso             : false,
        parsedDateParts : [],
        meridiem        : null,
        rfc2822         : false,
        weekdayMismatch : false
    };
}

function getParsingFlags(m) {
    if (m._pf == null) {
        m._pf = defaultParsingFlags();
    }
    return m._pf;
}

var some;
if (Array.prototype.some) {
    some = Array.prototype.some;
} else {
    some = function (fun) {
        var t = Object(this);
        var len = t.length >>> 0;

        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(this, t[i], i, t)) {
                return true;
            }
        }

        return false;
    };
}

var some$1 = some;

function isValid(m) {
    if (m._isValid == null) {
        var flags = getParsingFlags(m);
        var parsedParts = some$1.call(flags.parsedDateParts, function (i) {
            return i != null;
        });
        var isNowValid = !isNaN(m._d.getTime()) &&
            flags.overflow < 0 &&
            !flags.empty &&
            !flags.invalidMonth &&
            !flags.invalidWeekday &&
            !flags.nullInput &&
            !flags.invalidFormat &&
            !flags.userInvalidated &&
            (!flags.meridiem || (flags.meridiem && parsedParts));

        if (m._strict) {
            isNowValid = isNowValid &&
                flags.charsLeftOver === 0 &&
                flags.unusedTokens.length === 0 &&
                flags.bigHour === undefined;
        }

        if (Object.isFrozen == null || !Object.isFrozen(m)) {
            m._isValid = isNowValid;
        }
        else {
            return isNowValid;
        }
    }
    return m._isValid;
}

function createInvalid (flags) {
    var m = createUTC(NaN);
    if (flags != null) {
        extend(getParsingFlags(m), flags);
    }
    else {
        getParsingFlags(m).userInvalidated = true;
    }

    return m;
}

// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var momentProperties = hooks.momentProperties = [];

function copyConfig(to, from) {
    var i, prop, val;

    if (!isUndefined(from._isAMomentObject)) {
        to._isAMomentObject = from._isAMomentObject;
    }
    if (!isUndefined(from._i)) {
        to._i = from._i;
    }
    if (!isUndefined(from._f)) {
        to._f = from._f;
    }
    if (!isUndefined(from._l)) {
        to._l = from._l;
    }
    if (!isUndefined(from._strict)) {
        to._strict = from._strict;
    }
    if (!isUndefined(from._tzm)) {
        to._tzm = from._tzm;
    }
    if (!isUndefined(from._isUTC)) {
        to._isUTC = from._isUTC;
    }
    if (!isUndefined(from._offset)) {
        to._offset = from._offset;
    }
    if (!isUndefined(from._pf)) {
        to._pf = getParsingFlags(from);
    }
    if (!isUndefined(from._locale)) {
        to._locale = from._locale;
    }

    if (momentProperties.length > 0) {
        for (i = 0; i < momentProperties.length; i++) {
            prop = momentProperties[i];
            val = from[prop];
            if (!isUndefined(val)) {
                to[prop] = val;
            }
        }
    }

    return to;
}

var updateInProgress = false;

// Moment prototype object
function Moment(config) {
    copyConfig(this, config);
    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    if (!this.isValid()) {
        this._d = new Date(NaN);
    }
    // Prevent infinite loop in case updateOffset creates new moment
    // objects.
    if (updateInProgress === false) {
        updateInProgress = true;
        hooks.updateOffset(this);
        updateInProgress = false;
    }
}

function isMoment (obj) {
    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
}

function absFloor (number) {
    if (number < 0) {
        // -0 -> 0
        return Math.ceil(number) || 0;
    } else {
        return Math.floor(number);
    }
}

function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
        value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
    }

    return value;
}

// compare two arrays, return the number of differences
function compareArrays(array1, array2, dontConvert) {
    var len = Math.min(array1.length, array2.length),
        lengthDiff = Math.abs(array1.length - array2.length),
        diffs = 0,
        i;
    for (i = 0; i < len; i++) {
        if ((dontConvert && array1[i] !== array2[i]) ||
            (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
            diffs++;
        }
    }
    return diffs + lengthDiff;
}

function warn(msg) {
    if (hooks.suppressDeprecationWarnings === false &&
            (typeof console !==  'undefined') && console.warn) {
        console.warn('Deprecation warning: ' + msg);
    }
}

function deprecate(msg, fn) {
    var firstTime = true;

    return extend(function () {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(null, msg);
        }
        if (firstTime) {
            var args = [];
            var arg;
            for (var i = 0; i < arguments.length; i++) {
                arg = '';
                if (typeof arguments[i] === 'object') {
                    arg += '\n[' + i + '] ';
                    for (var key in arguments[0]) {
                        arg += key + ': ' + arguments[0][key] + ', ';
                    }
                    arg = arg.slice(0, -2); // Remove trailing comma and space
                } else {
                    arg = arguments[i];
                }
                args.push(arg);
            }
            warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
            firstTime = false;
        }
        return fn.apply(this, arguments);
    }, fn);
}

var deprecations = {};

function deprecateSimple(name, msg) {
    if (hooks.deprecationHandler != null) {
        hooks.deprecationHandler(name, msg);
    }
    if (!deprecations[name]) {
        warn(msg);
        deprecations[name] = true;
    }
}

hooks.suppressDeprecationWarnings = false;
hooks.deprecationHandler = null;

function isFunction(input) {
    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
}

function set (config) {
    var prop, i;
    for (i in config) {
        prop = config[i];
        if (isFunction(prop)) {
            this[i] = prop;
        } else {
            this['_' + i] = prop;
        }
    }
    this._config = config;
    // Lenient ordinal parsing accepts just a number in addition to
    // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
    // TODO: Remove "ordinalParse" fallback in next major release.
    this._dayOfMonthOrdinalParseLenient = new RegExp(
        (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
            '|' + (/\d{1,2}/).source);
}

function mergeConfigs(parentConfig, childConfig) {
    var res = extend({}, parentConfig), prop;
    for (prop in childConfig) {
        if (hasOwnProp(childConfig, prop)) {
            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                res[prop] = {};
                extend(res[prop], parentConfig[prop]);
                extend(res[prop], childConfig[prop]);
            } else if (childConfig[prop] != null) {
                res[prop] = childConfig[prop];
            } else {
                delete res[prop];
            }
        }
    }
    for (prop in parentConfig) {
        if (hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])) {
            // make sure changes to properties don't modify parent config
            res[prop] = extend({}, res[prop]);
        }
    }
    return res;
}

function Locale(config) {
    if (config != null) {
        this.set(config);
    }
}

var keys;

if (Object.keys) {
    keys = Object.keys;
} else {
    keys = function (obj) {
        var i, res = [];
        for (i in obj) {
            if (hasOwnProp(obj, i)) {
                res.push(i);
            }
        }
        return res;
    };
}

var keys$1 = keys;

var defaultCalendar = {
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    nextWeek : 'dddd [at] LT',
    lastDay : '[Yesterday at] LT',
    lastWeek : '[Last] dddd [at] LT',
    sameElse : 'L'
};

function calendar (key, mom, now) {
    var output = this._calendar[key] || this._calendar['sameElse'];
    return isFunction(output) ? output.call(mom, now) : output;
}

var defaultLongDateFormat = {
    LTS  : 'h:mm:ss A',
    LT   : 'h:mm A',
    L    : 'MM/DD/YYYY',
    LL   : 'MMMM D, YYYY',
    LLL  : 'MMMM D, YYYY h:mm A',
    LLLL : 'dddd, MMMM D, YYYY h:mm A'
};

function longDateFormat (key) {
    var format = this._longDateFormat[key],
        formatUpper = this._longDateFormat[key.toUpperCase()];

    if (format || !formatUpper) {
        return format;
    }

    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
        return val.slice(1);
    });

    return this._longDateFormat[key];
}

var defaultInvalidDate = 'Invalid date';

function invalidDate () {
    return this._invalidDate;
}

var defaultOrdinal = '%d';
var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

function ordinal (number) {
    return this._ordinal.replace('%d', number);
}

var defaultRelativeTime = {
    future : 'in %s',
    past   : '%s ago',
    s  : 'a few seconds',
    ss : '%d seconds',
    m  : 'a minute',
    mm : '%d minutes',
    h  : 'an hour',
    hh : '%d hours',
    d  : 'a day',
    dd : '%d days',
    M  : 'a month',
    MM : '%d months',
    y  : 'a year',
    yy : '%d years'
};

function relativeTime (number, withoutSuffix, string, isFuture) {
    var output = this._relativeTime[string];
    return (isFunction(output)) ?
        output(number, withoutSuffix, string, isFuture) :
        output.replace(/%d/i, number);
}

function pastFuture (diff, output) {
    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
}

var aliases = {};

function addUnitAlias (unit, shorthand) {
    var lowerCase = unit.toLowerCase();
    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
}

function normalizeUnits(units) {
    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
}

function normalizeObjectUnits(inputObject) {
    var normalizedInput = {},
        normalizedProp,
        prop;

    for (prop in inputObject) {
        if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
                normalizedInput[normalizedProp] = inputObject[prop];
            }
        }
    }

    return normalizedInput;
}

var priorities = {};

function addUnitPriority(unit, priority) {
    priorities[unit] = priority;
}

function getPrioritizedUnits(unitsObj) {
    var units = [];
    for (var u in unitsObj) {
        units.push({unit: u, priority: priorities[u]});
    }
    units.sort(function (a, b) {
        return a.priority - b.priority;
    });
    return units;
}

function makeGetSet (unit, keepTime) {
    return function (value) {
        if (value != null) {
            set$1(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
        } else {
            return get(this, unit);
        }
    };
}

function get (mom, unit) {
    return mom.isValid() ?
        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
}

function set$1 (mom, unit, value) {
    if (mom.isValid()) {
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }
}

// MOMENTS

function stringGet (units) {
    units = normalizeUnits(units);
    if (isFunction(this[units])) {
        return this[units]();
    }
    return this;
}


function stringSet (units, value) {
    if (typeof units === 'object') {
        units = normalizeObjectUnits(units);
        var prioritized = getPrioritizedUnits(units);
        for (var i = 0; i < prioritized.length; i++) {
            this[prioritized[i].unit](units[prioritized[i].unit]);
        }
    } else {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units](value);
        }
    }
    return this;
}

function zeroFill(number, targetLength, forceSign) {
    var absNumber = '' + Math.abs(number),
        zerosToFill = targetLength - absNumber.length,
        sign = number >= 0;
    return (sign ? (forceSign ? '+' : '') : '-') +
        Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
}

var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

var formatFunctions = {};

var formatTokenFunctions = {};

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken (token, padded, ordinal, callback) {
    var func = callback;
    if (typeof callback === 'string') {
        func = function () {
            return this[callback]();
        };
    }
    if (token) {
        formatTokenFunctions[token] = func;
    }
    if (padded) {
        formatTokenFunctions[padded[0]] = function () {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        };
    }
    if (ordinal) {
        formatTokenFunctions[ordinal] = function () {
            return this.localeData().ordinal(func.apply(this, arguments), token);
        };
    }
}

function removeFormattingTokens(input) {
    if (input.match(/\[[\s\S]/)) {
        return input.replace(/^\[|\]$/g, '');
    }
    return input.replace(/\\/g, '');
}

function makeFormatFunction(format) {
    var array = format.match(formattingTokens), i, length;

    for (i = 0, length = array.length; i < length; i++) {
        if (formatTokenFunctions[array[i]]) {
            array[i] = formatTokenFunctions[array[i]];
        } else {
            array[i] = removeFormattingTokens(array[i]);
        }
    }

    return function (mom) {
        var output = '', i;
        for (i = 0; i < length; i++) {
            output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
        }
        return output;
    };
}

// format date using native date object
function formatMoment(m, format) {
    if (!m.isValid()) {
        return m.localeData().invalidDate();
    }

    format = expandFormat(format, m.localeData());
    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

    return formatFunctions[format](m);
}

function expandFormat(format, locale) {
    var i = 5;

    function replaceLongDateFormatTokens(input) {
        return locale.longDateFormat(input) || input;
    }

    localFormattingTokens.lastIndex = 0;
    while (i >= 0 && localFormattingTokens.test(format)) {
        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        localFormattingTokens.lastIndex = 0;
        i -= 1;
    }

    return format;
}

var match1         = /\d/;            //       0 - 9
var match2         = /\d\d/;          //      00 - 99
var match3         = /\d{3}/;         //     000 - 999
var match4         = /\d{4}/;         //    0000 - 9999
var match6         = /[+-]?\d{6}/;    // -999999 - 999999
var match1to2      = /\d\d?/;         //       0 - 99
var match3to4      = /\d\d\d\d?/;     //     999 - 9999
var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
var match1to3      = /\d{1,3}/;       //       0 - 999
var match1to4      = /\d{1,4}/;       //       0 - 9999
var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

var matchUnsigned  = /\d+/;           //       0 - inf
var matchSigned    = /[+-]?\d+/;      //    -inf - inf

var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

// any word (or two) characters or numbers including two/three word month in arabic.
// includes scottish gaelic two word and hyphenated months
var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


var regexes = {};

function addRegexToken (token, regex, strictRegex) {
    regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
        return (isStrict && strictRegex) ? strictRegex : regex;
    };
}

function getParseRegexForToken (token, config) {
    if (!hasOwnProp(regexes, token)) {
        return new RegExp(unescapeFormat(token));
    }

    return regexes[token](config._strict, config._locale);
}

// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function unescapeFormat(s) {
    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
        return p1 || p2 || p3 || p4;
    }));
}

function regexEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var tokens = {};

function addParseToken (token, callback) {
    var i, func = callback;
    if (typeof token === 'string') {
        token = [token];
    }
    if (isNumber(callback)) {
        func = function (input, array) {
            array[callback] = toInt(input);
        };
    }
    for (i = 0; i < token.length; i++) {
        tokens[token[i]] = func;
    }
}

function addWeekParseToken (token, callback) {
    addParseToken(token, function (input, array, config, token) {
        config._w = config._w || {};
        callback(input, config._w, config, token);
    });
}

function addTimeToArrayFromToken(token, input, config) {
    if (input != null && hasOwnProp(tokens, token)) {
        tokens[token](input, config._a, config, token);
    }
}

var YEAR = 0;
var MONTH = 1;
var DATE = 2;
var HOUR = 3;
var MINUTE = 4;
var SECOND = 5;
var MILLISECOND = 6;
var WEEK = 7;
var WEEKDAY = 8;

var indexOf;

if (Array.prototype.indexOf) {
    indexOf = Array.prototype.indexOf;
} else {
    indexOf = function (o) {
        // I know
        var i;
        for (i = 0; i < this.length; ++i) {
            if (this[i] === o) {
                return i;
            }
        }
        return -1;
    };
}

var indexOf$1 = indexOf;

function daysInMonth(year, month) {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

// FORMATTING

addFormatToken('M', ['MM', 2], 'Mo', function () {
    return this.month() + 1;
});

addFormatToken('MMM', 0, 0, function (format) {
    return this.localeData().monthsShort(this, format);
});

addFormatToken('MMMM', 0, 0, function (format) {
    return this.localeData().months(this, format);
});

// ALIASES

addUnitAlias('month', 'M');

// PRIORITY

addUnitPriority('month', 8);

// PARSING

addRegexToken('M',    match1to2);
addRegexToken('MM',   match1to2, match2);
addRegexToken('MMM',  function (isStrict, locale) {
    return locale.monthsShortRegex(isStrict);
});
addRegexToken('MMMM', function (isStrict, locale) {
    return locale.monthsRegex(isStrict);
});

addParseToken(['M', 'MM'], function (input, array) {
    array[MONTH] = toInt(input) - 1;
});

addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
    var month = config._locale.monthsParse(input, token, config._strict);
    // if we didn't find a month name, mark the date as invalid.
    if (month != null) {
        array[MONTH] = month;
    } else {
        getParsingFlags(config).invalidMonth = input;
    }
});

// LOCALES

var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
function localeMonths (m, format) {
    if (!m) {
        return isArray(this._months) ? this._months :
            this._months['standalone'];
    }
    return isArray(this._months) ? this._months[m.month()] :
        this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
}

var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
function localeMonthsShort (m, format) {
    if (!m) {
        return isArray(this._monthsShort) ? this._monthsShort :
            this._monthsShort['standalone'];
    }
    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
}

function handleStrictParse(monthName, format, strict) {
    var i, ii, mom, llc = monthName.toLocaleLowerCase();
    if (!this._monthsParse) {
        // this is not used
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
        for (i = 0; i < 12; ++i) {
            mom = createUTC([2000, i]);
            this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeMonthsParse (monthName, format, strict) {
    var i, mom, regex;

    if (this._monthsParseExact) {
        return handleStrictParse.call(this, monthName, format, strict);
    }

    if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
    }

    // TODO: add sorting
    // Sorting makes sure if one month (or abbr) is a prefix of another
    // see sorting in computeMonthsParse
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
        }
        if (!strict && !this._monthsParse[i]) {
            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
            return i;
        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
            return i;
        } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
        }
    }
}

// MOMENTS

function setMonth (mom, value) {
    var dayOfMonth;

    if (!mom.isValid()) {
        // No op
        return mom;
    }

    if (typeof value === 'string') {
        if (/^\d+$/.test(value)) {
            value = toInt(value);
        } else {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (!isNumber(value)) {
                return mom;
            }
        }
    }

    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    return mom;
}

function getSetMonth (value) {
    if (value != null) {
        setMonth(this, value);
        hooks.updateOffset(this, true);
        return this;
    } else {
        return get(this, 'Month');
    }
}

function getDaysInMonth () {
    return daysInMonth(this.year(), this.month());
}

var defaultMonthsShortRegex = matchWord;
function monthsShortRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsShortStrictRegex;
        } else {
            return this._monthsShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsShortRegex')) {
            this._monthsShortRegex = defaultMonthsShortRegex;
        }
        return this._monthsShortStrictRegex && isStrict ?
            this._monthsShortStrictRegex : this._monthsShortRegex;
    }
}

var defaultMonthsRegex = matchWord;
function monthsRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsStrictRegex;
        } else {
            return this._monthsRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsRegex')) {
            this._monthsRegex = defaultMonthsRegex;
        }
        return this._monthsStrictRegex && isStrict ?
            this._monthsStrictRegex : this._monthsRegex;
    }
}

function computeMonthsParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom;
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        shortPieces.push(this.monthsShort(mom, ''));
        longPieces.push(this.months(mom, ''));
        mixedPieces.push(this.months(mom, ''));
        mixedPieces.push(this.monthsShort(mom, ''));
    }
    // Sorting makes sure if one month (or abbr) is a prefix of another it
    // will match the longer piece.
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 12; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
    }
    for (i = 0; i < 24; i++) {
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._monthsShortRegex = this._monthsRegex;
    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
}

// FORMATTING

addFormatToken('Y', 0, 0, function () {
    var y = this.year();
    return y <= 9999 ? '' + y : '+' + y;
});

addFormatToken(0, ['YY', 2], 0, function () {
    return this.year() % 100;
});

addFormatToken(0, ['YYYY',   4],       0, 'year');
addFormatToken(0, ['YYYYY',  5],       0, 'year');
addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

// ALIASES

addUnitAlias('year', 'y');

// PRIORITIES

addUnitPriority('year', 1);

// PARSING

addRegexToken('Y',      matchSigned);
addRegexToken('YY',     match1to2, match2);
addRegexToken('YYYY',   match1to4, match4);
addRegexToken('YYYYY',  match1to6, match6);
addRegexToken('YYYYYY', match1to6, match6);

addParseToken(['YYYYY', 'YYYYYY'], YEAR);
addParseToken('YYYY', function (input, array) {
    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
});
addParseToken('YY', function (input, array) {
    array[YEAR] = hooks.parseTwoDigitYear(input);
});
addParseToken('Y', function (input, array) {
    array[YEAR] = parseInt(input, 10);
});

// HELPERS

function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// HOOKS

hooks.parseTwoDigitYear = function (input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
};

// MOMENTS

var getSetYear = makeGetSet('FullYear', true);

function getIsLeapYear () {
    return isLeapYear(this.year());
}

function createDate (y, m, d, h, M, s, ms) {
    // can't just apply() to create a date:
    // https://stackoverflow.com/q/181348
    var date = new Date(y, m, d, h, M, s, ms);

    // the date constructor remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
        date.setFullYear(y);
    }
    return date;
}

function createUTCDate (y) {
    var date = new Date(Date.UTC.apply(null, arguments));

    // the Date.UTC function remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
    }
    return date;
}

// start-of-first-week - start-of-year
function firstWeekOffset(year, dow, doy) {
    var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
        fwd = 7 + dow - doy,
        // first-week day local weekday -- which local weekday is fwd
        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

    return -fwdlw + fwd - 1;
}

// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
    var localWeekday = (7 + weekday - dow) % 7,
        weekOffset = firstWeekOffset(year, dow, doy),
        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
        resYear, resDayOfYear;

    if (dayOfYear <= 0) {
        resYear = year - 1;
        resDayOfYear = daysInYear(resYear) + dayOfYear;
    } else if (dayOfYear > daysInYear(year)) {
        resYear = year + 1;
        resDayOfYear = dayOfYear - daysInYear(year);
    } else {
        resYear = year;
        resDayOfYear = dayOfYear;
    }

    return {
        year: resYear,
        dayOfYear: resDayOfYear
    };
}

function weekOfYear(mom, dow, doy) {
    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
        resWeek, resYear;

    if (week < 1) {
        resYear = mom.year() - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
        resWeek = week - weeksInYear(mom.year(), dow, doy);
        resYear = mom.year() + 1;
    } else {
        resYear = mom.year();
        resWeek = week;
    }

    return {
        week: resWeek,
        year: resYear
    };
}

function weeksInYear(year, dow, doy) {
    var weekOffset = firstWeekOffset(year, dow, doy),
        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
}

// FORMATTING

addFormatToken('w', ['ww', 2], 'wo', 'week');
addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

// ALIASES

addUnitAlias('week', 'w');
addUnitAlias('isoWeek', 'W');

// PRIORITIES

addUnitPriority('week', 5);
addUnitPriority('isoWeek', 5);

// PARSING

addRegexToken('w',  match1to2);
addRegexToken('ww', match1to2, match2);
addRegexToken('W',  match1to2);
addRegexToken('WW', match1to2, match2);

addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
    week[token.substr(0, 1)] = toInt(input);
});

// HELPERS

// LOCALES

function localeWeek (mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
}

var defaultLocaleWeek = {
    dow : 0, // Sunday is the first day of the week.
    doy : 6  // The week that contains Jan 1st is the first week of the year.
};

function localeFirstDayOfWeek () {
    return this._week.dow;
}

function localeFirstDayOfYear () {
    return this._week.doy;
}

// MOMENTS

function getSetWeek (input) {
    var week = this.localeData().week(this);
    return input == null ? week : this.add((input - week) * 7, 'd');
}

function getSetISOWeek (input) {
    var week = weekOfYear(this, 1, 4).week;
    return input == null ? week : this.add((input - week) * 7, 'd');
}

// FORMATTING

addFormatToken('d', 0, 'do', 'day');

addFormatToken('dd', 0, 0, function (format) {
    return this.localeData().weekdaysMin(this, format);
});

addFormatToken('ddd', 0, 0, function (format) {
    return this.localeData().weekdaysShort(this, format);
});

addFormatToken('dddd', 0, 0, function (format) {
    return this.localeData().weekdays(this, format);
});

addFormatToken('e', 0, 0, 'weekday');
addFormatToken('E', 0, 0, 'isoWeekday');

// ALIASES

addUnitAlias('day', 'd');
addUnitAlias('weekday', 'e');
addUnitAlias('isoWeekday', 'E');

// PRIORITY
addUnitPriority('day', 11);
addUnitPriority('weekday', 11);
addUnitPriority('isoWeekday', 11);

// PARSING

addRegexToken('d',    match1to2);
addRegexToken('e',    match1to2);
addRegexToken('E',    match1to2);
addRegexToken('dd',   function (isStrict, locale) {
    return locale.weekdaysMinRegex(isStrict);
});
addRegexToken('ddd',   function (isStrict, locale) {
    return locale.weekdaysShortRegex(isStrict);
});
addRegexToken('dddd',   function (isStrict, locale) {
    return locale.weekdaysRegex(isStrict);
});

addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
    var weekday = config._locale.weekdaysParse(input, token, config._strict);
    // if we didn't get a weekday name, mark the date as invalid
    if (weekday != null) {
        week.d = weekday;
    } else {
        getParsingFlags(config).invalidWeekday = input;
    }
});

addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
    week[token] = toInt(input);
});

// HELPERS

function parseWeekday(input, locale) {
    if (typeof input !== 'string') {
        return input;
    }

    if (!isNaN(input)) {
        return parseInt(input, 10);
    }

    input = locale.weekdaysParse(input);
    if (typeof input === 'number') {
        return input;
    }

    return null;
}

function parseIsoWeekday(input, locale) {
    if (typeof input === 'string') {
        return locale.weekdaysParse(input) % 7 || 7;
    }
    return isNaN(input) ? null : input;
}

// LOCALES

var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
function localeWeekdays (m, format) {
    if (!m) {
        return isArray(this._weekdays) ? this._weekdays :
            this._weekdays['standalone'];
    }
    return isArray(this._weekdays) ? this._weekdays[m.day()] :
        this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
}

var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
function localeWeekdaysShort (m) {
    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
}

var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
function localeWeekdaysMin (m) {
    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
}

function handleStrictParse$1(weekdayName, format, strict) {
    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._minWeekdaysParse = [];

        for (i = 0; i < 7; ++i) {
            mom = createUTC([2000, 1]).day(i);
            this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
            this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeWeekdaysParse (weekdayName, format, strict) {
    var i, mom, regex;

    if (this._weekdaysParseExact) {
        return handleStrictParse$1.call(this, weekdayName, format, strict);
    }

    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._minWeekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._fullWeekdaysParse = [];
    }

    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already

        mom = createUTC([2000, 1]).day(i);
        if (strict && !this._fullWeekdaysParse[i]) {
            this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
            this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
            this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
        }
        if (!this._weekdaysParse[i]) {
            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
            return i;
        }
    }
}

// MOMENTS

function getSetDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    if (input != null) {
        input = parseWeekday(input, this.localeData());
        return this.add(input - day, 'd');
    } else {
        return day;
    }
}

function getSetLocaleDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return input == null ? weekday : this.add(input - weekday, 'd');
}

function getSetISODayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }

    // behaves the same as moment#day except
    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    // as a setter, sunday should belong to the previous week.

    if (input != null) {
        var weekday = parseIsoWeekday(input, this.localeData());
        return this.day(this.day() % 7 ? weekday : weekday - 7);
    } else {
        return this.day() || 7;
    }
}

var defaultWeekdaysRegex = matchWord;
function weekdaysRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysStrictRegex;
        } else {
            return this._weekdaysRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            this._weekdaysRegex = defaultWeekdaysRegex;
        }
        return this._weekdaysStrictRegex && isStrict ?
            this._weekdaysStrictRegex : this._weekdaysRegex;
    }
}

var defaultWeekdaysShortRegex = matchWord;
function weekdaysShortRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysShortStrictRegex;
        } else {
            return this._weekdaysShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysShortRegex')) {
            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
        }
        return this._weekdaysShortStrictRegex && isStrict ?
            this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
    }
}

var defaultWeekdaysMinRegex = matchWord;
function weekdaysMinRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysMinStrictRegex;
        } else {
            return this._weekdaysMinRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysMinRegex')) {
            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
        }
        return this._weekdaysMinStrictRegex && isStrict ?
            this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
    }
}


function computeWeekdaysParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom, minp, shortp, longp;
    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, 1]).day(i);
        minp = this.weekdaysMin(mom, '');
        shortp = this.weekdaysShort(mom, '');
        longp = this.weekdays(mom, '');
        minPieces.push(minp);
        shortPieces.push(shortp);
        longPieces.push(longp);
        mixedPieces.push(minp);
        mixedPieces.push(shortp);
        mixedPieces.push(longp);
    }
    // Sorting makes sure if one weekday (or abbr) is a prefix of another it
    // will match the longer piece.
    minPieces.sort(cmpLenRev);
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 7; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._weekdaysShortRegex = this._weekdaysRegex;
    this._weekdaysMinRegex = this._weekdaysRegex;

    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
}

// FORMATTING

function hFormat() {
    return this.hours() % 12 || 12;
}

function kFormat() {
    return this.hours() || 24;
}

addFormatToken('H', ['HH', 2], 0, 'hour');
addFormatToken('h', ['hh', 2], 0, hFormat);
addFormatToken('k', ['kk', 2], 0, kFormat);

addFormatToken('hmm', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
});

addFormatToken('hmmss', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

addFormatToken('Hmm', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2);
});

addFormatToken('Hmmss', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

function meridiem (token, lowercase) {
    addFormatToken(token, 0, 0, function () {
        return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
    });
}

meridiem('a', true);
meridiem('A', false);

// ALIASES

addUnitAlias('hour', 'h');

// PRIORITY
addUnitPriority('hour', 13);

// PARSING

function matchMeridiem (isStrict, locale) {
    return locale._meridiemParse;
}

addRegexToken('a',  matchMeridiem);
addRegexToken('A',  matchMeridiem);
addRegexToken('H',  match1to2);
addRegexToken('h',  match1to2);
addRegexToken('k',  match1to2);
addRegexToken('HH', match1to2, match2);
addRegexToken('hh', match1to2, match2);
addRegexToken('kk', match1to2, match2);

addRegexToken('hmm', match3to4);
addRegexToken('hmmss', match5to6);
addRegexToken('Hmm', match3to4);
addRegexToken('Hmmss', match5to6);

addParseToken(['H', 'HH'], HOUR);
addParseToken(['k', 'kk'], function (input, array, config) {
    var kInput = toInt(input);
    array[HOUR] = kInput === 24 ? 0 : kInput;
});
addParseToken(['a', 'A'], function (input, array, config) {
    config._isPm = config._locale.isPM(input);
    config._meridiem = input;
});
addParseToken(['h', 'hh'], function (input, array, config) {
    array[HOUR] = toInt(input);
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
    getParsingFlags(config).bigHour = true;
});
addParseToken('Hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
});
addParseToken('Hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
});

// LOCALES

function localeIsPM (input) {
    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
    // Using charAt should be more compatible.
    return ((input + '').toLowerCase().charAt(0) === 'p');
}

var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
function localeMeridiem (hours, minutes, isLower) {
    if (hours > 11) {
        return isLower ? 'pm' : 'PM';
    } else {
        return isLower ? 'am' : 'AM';
    }
}


// MOMENTS

// Setting the hour should keep the time, because the user explicitly
// specified which hour he wants. So trying to maintain the same hour (in
// a new timezone) makes sense. Adding/subtracting hours does not follow
// this rule.
var getSetHour = makeGetSet('Hours', true);

// months
// week
// weekdays
// meridiem
var baseConfig = {
    calendar: defaultCalendar,
    longDateFormat: defaultLongDateFormat,
    invalidDate: defaultInvalidDate,
    ordinal: defaultOrdinal,
    dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
    relativeTime: defaultRelativeTime,

    months: defaultLocaleMonths,
    monthsShort: defaultLocaleMonthsShort,

    week: defaultLocaleWeek,

    weekdays: defaultLocaleWeekdays,
    weekdaysMin: defaultLocaleWeekdaysMin,
    weekdaysShort: defaultLocaleWeekdaysShort,

    meridiemParse: defaultLocaleMeridiemParse
};

// internal storage for locale config files
var locales = {};
var localeFamilies = {};
var globalLocale;

function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names) {
    var i = 0, j, next, locale, split;

    while (i < names.length) {
        split = normalizeLocale(names[i]).split('-');
        j = split.length;
        next = normalizeLocale(names[i + 1]);
        next = next ? next.split('-') : null;
        while (j > 0) {
            locale = loadLocale(split.slice(0, j).join('-'));
            if (locale) {
                return locale;
            }
            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                //the next array item is better than a shallower substring of this one
                break;
            }
            j--;
        }
        i++;
    }
    return null;
}

function loadLocale(name) {
    var oldLocale = null;
    // TODO: Find a better way to register and load all the locales in Node
    if (!locales[name] && (typeof module !== 'undefined') &&
            module && module.exports) {
        try {
            oldLocale = globalLocale._abbr;
            require('./locale/' + name);
            // because defineLocale currently also sets the global locale, we
            // want to undo that for lazy loaded locales
            getSetGlobalLocale(oldLocale);
        } catch (e) { }
    }
    return locales[name];
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale (key, values) {
    var data;
    if (key) {
        if (isUndefined(values)) {
            data = getLocale(key);
        }
        else {
            data = defineLocale(key, values);
        }

        if (data) {
            // moment.duration._locale = moment._locale = data;
            globalLocale = data;
        }
    }

    return globalLocale._abbr;
}

function defineLocale (name, config) {
    if (config !== null) {
        var parentConfig = baseConfig;
        config.abbr = name;
        if (locales[name] != null) {
            deprecateSimple('defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                    'an existing locale. moment.defineLocale(localeName, ' +
                    'config) should only be used for creating a new locale ' +
                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
            parentConfig = locales[name]._config;
        } else if (config.parentLocale != null) {
            if (locales[config.parentLocale] != null) {
                parentConfig = locales[config.parentLocale]._config;
            } else {
                if (!localeFamilies[config.parentLocale]) {
                    localeFamilies[config.parentLocale] = [];
                }
                localeFamilies[config.parentLocale].push({
                    name: name,
                    config: config
                });
                return null;
            }
        }
        locales[name] = new Locale(mergeConfigs(parentConfig, config));

        if (localeFamilies[name]) {
            localeFamilies[name].forEach(function (x) {
                defineLocale(x.name, x.config);
            });
        }

        // backwards compat for now: also set the locale
        // make sure we set the locale AFTER all child locales have been
        // created, so we won't end up with the child locale set.
        getSetGlobalLocale(name);


        return locales[name];
    } else {
        // useful for testing
        delete locales[name];
        return null;
    }
}

function updateLocale(name, config) {
    if (config != null) {
        var locale, parentConfig = baseConfig;
        // MERGE
        if (locales[name] != null) {
            parentConfig = locales[name]._config;
        }
        config = mergeConfigs(parentConfig, config);
        locale = new Locale(config);
        locale.parentLocale = locales[name];
        locales[name] = locale;

        // backwards compat for now: also set the locale
        getSetGlobalLocale(name);
    } else {
        // pass null for config to unupdate, useful for tests
        if (locales[name] != null) {
            if (locales[name].parentLocale != null) {
                locales[name] = locales[name].parentLocale;
            } else if (locales[name] != null) {
                delete locales[name];
            }
        }
    }
    return locales[name];
}

// returns locale data
function getLocale (key) {
    var locale;

    if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
    }

    if (!key) {
        return globalLocale;
    }

    if (!isArray(key)) {
        //short-circuit everything else
        locale = loadLocale(key);
        if (locale) {
            return locale;
        }
        key = [key];
    }

    return chooseLocale(key);
}

function listLocales() {
    return keys$1(locales);
}

function checkOverflow (m) {
    var overflow;
    var a = m._a;

    if (a && getParsingFlags(m).overflow === -2) {
        overflow =
            a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
            a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
            a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
            a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
            a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
            -1;

        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
            overflow = DATE;
        }
        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
            overflow = WEEK;
        }
        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
            overflow = WEEKDAY;
        }

        getParsingFlags(m).overflow = overflow;
    }

    return m;
}

// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

var isoDates = [
    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
    ['YYYY-DDD', /\d{4}-\d{3}/],
    ['YYYY-MM', /\d{4}-\d\d/, false],
    ['YYYYYYMMDD', /[+-]\d{10}/],
    ['YYYYMMDD', /\d{8}/],
    // YYYYMM is NOT allowed by the standard
    ['GGGG[W]WWE', /\d{4}W\d{3}/],
    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
    ['YYYYDDD', /\d{7}/]
];

// iso time formats and regexes
var isoTimes = [
    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
    ['HH:mm', /\d\d:\d\d/],
    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
    ['HHmmss', /\d\d\d\d\d\d/],
    ['HHmm', /\d\d\d\d/],
    ['HH', /\d\d/]
];

var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

// date from iso format
function configFromISO(config) {
    var i, l,
        string = config._i,
        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
        allowTime, dateFormat, timeFormat, tzFormat;

    if (match) {
        getParsingFlags(config).iso = true;

        for (i = 0, l = isoDates.length; i < l; i++) {
            if (isoDates[i][1].exec(match[1])) {
                dateFormat = isoDates[i][0];
                allowTime = isoDates[i][2] !== false;
                break;
            }
        }
        if (dateFormat == null) {
            config._isValid = false;
            return;
        }
        if (match[3]) {
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(match[3])) {
                    // match[2] should be 'T' or space
                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (timeFormat == null) {
                config._isValid = false;
                return;
            }
        }
        if (!allowTime && timeFormat != null) {
            config._isValid = false;
            return;
        }
        if (match[4]) {
            if (tzRegex.exec(match[4])) {
                tzFormat = 'Z';
            } else {
                config._isValid = false;
                return;
            }
        }
        config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
        configFromStringAndFormat(config);
    } else {
        config._isValid = false;
    }
}

// RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
var basicRfcRegex = /^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d?\d\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(?:\d\d)?\d\d\s)(\d\d:\d\d)(\:\d\d)?(\s(?:UT|GMT|[ECMP][SD]T|[A-IK-Za-ik-z]|[+-]\d{4}))$/;

// date and time from ref 2822 format
function configFromRFC2822(config) {
    var string, match, dayFormat,
        dateFormat, timeFormat, tzFormat;
    var timezones = {
        ' GMT': ' +0000',
        ' EDT': ' -0400',
        ' EST': ' -0500',
        ' CDT': ' -0500',
        ' CST': ' -0600',
        ' MDT': ' -0600',
        ' MST': ' -0700',
        ' PDT': ' -0700',
        ' PST': ' -0800'
    };
    var military = 'YXWVUTSRQPONZABCDEFGHIKLM';
    var timezone, timezoneIndex;

    string = config._i
        .replace(/\([^\)]*\)|[\n\t]/g, ' ') // Remove comments and folding whitespace
        .replace(/(\s\s+)/g, ' ') // Replace multiple-spaces with a single space
        .replace(/^\s|\s$/g, ''); // Remove leading and trailing spaces
    match = basicRfcRegex.exec(string);

    if (match) {
        dayFormat = match[1] ? 'ddd' + ((match[1].length === 5) ? ', ' : ' ') : '';
        dateFormat = 'D MMM ' + ((match[2].length > 10) ? 'YYYY ' : 'YY ');
        timeFormat = 'HH:mm' + (match[4] ? ':ss' : '');

        // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
        if (match[1]) { // day of week given
            var momentDate = new Date(match[2]);
            var momentDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][momentDate.getDay()];

            if (match[1].substr(0,3) !== momentDay) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return;
            }
        }

        switch (match[5].length) {
            case 2: // military
                if (timezoneIndex === 0) {
                    timezone = ' +0000';
                } else {
                    timezoneIndex = military.indexOf(match[5][1].toUpperCase()) - 12;
                    timezone = ((timezoneIndex < 0) ? ' -' : ' +') +
                        (('' + timezoneIndex).replace(/^-?/, '0')).match(/..$/)[0] + '00';
                }
                break;
            case 4: // Zone
                timezone = timezones[match[5]];
                break;
            default: // UT or +/-9999
                timezone = timezones[' GMT'];
        }
        match[5] = timezone;
        config._i = match.splice(1).join('');
        tzFormat = ' ZZ';
        config._f = dayFormat + dateFormat + timeFormat + tzFormat;
        configFromStringAndFormat(config);
        getParsingFlags(config).rfc2822 = true;
    } else {
        config._isValid = false;
    }
}

// date from iso format or fallback
function configFromString(config) {
    var matched = aspNetJsonRegex.exec(config._i);

    if (matched !== null) {
        config._d = new Date(+matched[1]);
        return;
    }

    configFromISO(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    configFromRFC2822(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    // Final attempt, use Input Fallback
    hooks.createFromInputFallback(config);
}

hooks.createFromInputFallback = deprecate(
    'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
    'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
    'discouraged and will be removed in an upcoming major release. Please refer to ' +
    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
    function (config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    }
);

// Pick the first defined of two or three arguments.
function defaults(a, b, c) {
    if (a != null) {
        return a;
    }
    if (b != null) {
        return b;
    }
    return c;
}

function currentDateArray(config) {
    // hooks is actually the exported moment object
    var nowValue = new Date(hooks.now());
    if (config._useUTC) {
        return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
    }
    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
}

// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
function configFromArray (config) {
    var i, date, input = [], currentDate, yearToUse;

    if (config._d) {
        return;
    }

    currentDate = currentDateArray(config);

    //compute day of the year from weeks and weekdays
    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
        dayOfYearFromWeekInfo(config);
    }

    //if the day of the year is set, figure out what it is
    if (config._dayOfYear != null) {
        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

        if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
            getParsingFlags(config)._overflowDayOfYear = true;
        }

        date = createUTCDate(yearToUse, 0, config._dayOfYear);
        config._a[MONTH] = date.getUTCMonth();
        config._a[DATE] = date.getUTCDate();
    }

    // Default to current date.
    // * if no year, month, day of month are given, default to today
    // * if day of month is given, default month and year
    // * if month is given, default only year
    // * if year is given, don't default anything
    for (i = 0; i < 3 && config._a[i] == null; ++i) {
        config._a[i] = input[i] = currentDate[i];
    }

    // Zero out whatever was not defaulted, including time
    for (; i < 7; i++) {
        config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
    }

    // Check for 24:00:00.000
    if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
        config._nextDay = true;
        config._a[HOUR] = 0;
    }

    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
    // Apply timezone offset from input. The actual utcOffset can be changed
    // with parseZone.
    if (config._tzm != null) {
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    }

    if (config._nextDay) {
        config._a[HOUR] = 24;
    }
}

function dayOfYearFromWeekInfo(config) {
    var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

    w = config._w;
    if (w.GG != null || w.W != null || w.E != null) {
        dow = 1;
        doy = 4;

        // TODO: We need to take the current isoWeekYear, but that depends on
        // how we interpret now (local, utc, fixed offset). So create
        // a now version of current config (take local/utc/offset flags, and
        // create now).
        weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
        week = defaults(w.W, 1);
        weekday = defaults(w.E, 1);
        if (weekday < 1 || weekday > 7) {
            weekdayOverflow = true;
        }
    } else {
        dow = config._locale._week.dow;
        doy = config._locale._week.doy;

        var curWeek = weekOfYear(createLocal(), dow, doy);

        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

        // Default to current week.
        week = defaults(w.w, curWeek.week);

        if (w.d != null) {
            // weekday -- low day numbers are considered next week
            weekday = w.d;
            if (weekday < 0 || weekday > 6) {
                weekdayOverflow = true;
            }
        } else if (w.e != null) {
            // local weekday -- counting starts from begining of week
            weekday = w.e + dow;
            if (w.e < 0 || w.e > 6) {
                weekdayOverflow = true;
            }
        } else {
            // default to begining of week
            weekday = dow;
        }
    }
    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
        getParsingFlags(config)._overflowWeeks = true;
    } else if (weekdayOverflow != null) {
        getParsingFlags(config)._overflowWeekday = true;
    } else {
        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }
}

// constant that refers to the ISO standard
hooks.ISO_8601 = function () {};

// constant that refers to the RFC 2822 form
hooks.RFC_2822 = function () {};

// date from string and format string
function configFromStringAndFormat(config) {
    // TODO: Move this to another part of the creation flow to prevent circular deps
    if (config._f === hooks.ISO_8601) {
        configFromISO(config);
        return;
    }
    if (config._f === hooks.RFC_2822) {
        configFromRFC2822(config);
        return;
    }
    config._a = [];
    getParsingFlags(config).empty = true;

    // This array is used to make a Date, either with \`new Date\` or \`Date.UTC\`
    var string = '' + config._i,
        i, parsedInput, tokens, token, skipped,
        stringLength = string.length,
        totalParsedInputLength = 0;

    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

    for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
        // console.log('token', token, 'parsedInput', parsedInput,
        //         'regex', getParseRegexForToken(token, config));
        if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
                getParsingFlags(config).unusedInput.push(skipped);
            }
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            totalParsedInputLength += parsedInput.length;
        }
        // don't parse if it's not a known token
        if (formatTokenFunctions[token]) {
            if (parsedInput) {
                getParsingFlags(config).empty = false;
            }
            else {
                getParsingFlags(config).unusedTokens.push(token);
            }
            addTimeToArrayFromToken(token, parsedInput, config);
        }
        else if (config._strict && !parsedInput) {
            getParsingFlags(config).unusedTokens.push(token);
        }
    }

    // add remaining unparsed input length to the string
    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
        getParsingFlags(config).unusedInput.push(string);
    }

    // clear _12h flag if hour is <= 12
    if (config._a[HOUR] <= 12 &&
        getParsingFlags(config).bigHour === true &&
        config._a[HOUR] > 0) {
        getParsingFlags(config).bigHour = undefined;
    }

    getParsingFlags(config).parsedDateParts = config._a.slice(0);
    getParsingFlags(config).meridiem = config._meridiem;
    // handle meridiem
    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

    configFromArray(config);
    checkOverflow(config);
}


function meridiemFixWrap (locale, hour, meridiem) {
    var isPm;

    if (meridiem == null) {
        // nothing to do
        return hour;
    }
    if (locale.meridiemHour != null) {
        return locale.meridiemHour(hour, meridiem);
    } else if (locale.isPM != null) {
        // Fallback
        isPm = locale.isPM(meridiem);
        if (isPm && hour < 12) {
            hour += 12;
        }
        if (!isPm && hour === 12) {
            hour = 0;
        }
        return hour;
    } else {
        // this is not supposed to happen
        return hour;
    }
}

// date from string and array of format strings
function configFromStringAndArray(config) {
    var tempConfig,
        bestMoment,

        scoreToBeat,
        i,
        currentScore;

    if (config._f.length === 0) {
        getParsingFlags(config).invalidFormat = true;
        config._d = new Date(NaN);
        return;
    }

    for (i = 0; i < config._f.length; i++) {
        currentScore = 0;
        tempConfig = copyConfig({}, config);
        if (config._useUTC != null) {
            tempConfig._useUTC = config._useUTC;
        }
        tempConfig._f = config._f[i];
        configFromStringAndFormat(tempConfig);

        if (!isValid(tempConfig)) {
            continue;
        }

        // if there is any input that was not parsed add a penalty for that format
        currentScore += getParsingFlags(tempConfig).charsLeftOver;

        //or tokens
        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

        getParsingFlags(tempConfig).score = currentScore;

        if (scoreToBeat == null || currentScore < scoreToBeat) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
        }
    }

    extend(config, bestMoment || tempConfig);
}

function configFromObject(config) {
    if (config._d) {
        return;
    }

    var i = normalizeObjectUnits(config._i);
    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
        return obj && parseInt(obj, 10);
    });

    configFromArray(config);
}

function createFromConfig (config) {
    var res = new Moment(checkOverflow(prepareConfig(config)));
    if (res._nextDay) {
        // Adding is smart enough around DST
        res.add(1, 'd');
        res._nextDay = undefined;
    }

    return res;
}

function prepareConfig (config) {
    var input = config._i,
        format = config._f;

    config._locale = config._locale || getLocale(config._l);

    if (input === null || (format === undefined && input === '')) {
        return createInvalid({nullInput: true});
    }

    if (typeof input === 'string') {
        config._i = input = config._locale.preparse(input);
    }

    if (isMoment(input)) {
        return new Moment(checkOverflow(input));
    } else if (isDate(input)) {
        config._d = input;
    } else if (isArray(format)) {
        configFromStringAndArray(config);
    } else if (format) {
        configFromStringAndFormat(config);
    }  else {
        configFromInput(config);
    }

    if (!isValid(config)) {
        config._d = null;
    }

    return config;
}

function configFromInput(config) {
    var input = config._i;
    if (isUndefined(input)) {
        config._d = new Date(hooks.now());
    } else if (isDate(input)) {
        config._d = new Date(input.valueOf());
    } else if (typeof input === 'string') {
        configFromString(config);
    } else if (isArray(input)) {
        config._a = map(input.slice(0), function (obj) {
            return parseInt(obj, 10);
        });
        configFromArray(config);
    } else if (isObject(input)) {
        configFromObject(config);
    } else if (isNumber(input)) {
        // from milliseconds
        config._d = new Date(input);
    } else {
        hooks.createFromInputFallback(config);
    }
}

function createLocalOrUTC (input, format, locale, strict, isUTC) {
    var c = {};

    if (locale === true || locale === false) {
        strict = locale;
        locale = undefined;
    }

    if ((isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)) {
        input = undefined;
    }
    // object construction must be done this way.
    // https://github.com/moment/moment/issues/1423
    c._isAMomentObject = true;
    c._useUTC = c._isUTC = isUTC;
    c._l = locale;
    c._i = input;
    c._f = format;
    c._strict = strict;

    return createFromConfig(c);
}

function createLocal (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, false);
}

var prototypeMin = deprecate(
    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

var prototypeMax = deprecate(
    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
function pickBy(fn, moments) {
    var res, i;
    if (moments.length === 1 && isArray(moments[0])) {
        moments = moments[0];
    }
    if (!moments.length) {
        return createLocal();
    }
    res = moments[0];
    for (i = 1; i < moments.length; ++i) {
        if (!moments[i].isValid() || moments[i][fn](res)) {
            res = moments[i];
        }
    }
    return res;
}

// TODO: Use [].sort instead?
function min () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isBefore', args);
}

function max () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isAfter', args);
}

var now = function () {
    return Date.now ? Date.now() : +(new Date());
};

var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

function isDurationValid(m) {
    for (var key in m) {
        if (!(ordering.indexOf(key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
            return false;
        }
    }

    var unitHasDecimal = false;
    for (var i = 0; i < ordering.length; ++i) {
        if (m[ordering[i]]) {
            if (unitHasDecimal) {
                return false; // only allow non-integers for smallest unit
            }
            if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                unitHasDecimal = true;
            }
        }
    }

    return true;
}

function isValid$1() {
    return this._isValid;
}

function createInvalid$1() {
    return createDuration(NaN);
}

function Duration (duration) {
    var normalizedInput = normalizeObjectUnits(duration),
        years = normalizedInput.year || 0,
        quarters = normalizedInput.quarter || 0,
        months = normalizedInput.month || 0,
        weeks = normalizedInput.week || 0,
        days = normalizedInput.day || 0,
        hours = normalizedInput.hour || 0,
        minutes = normalizedInput.minute || 0,
        seconds = normalizedInput.second || 0,
        milliseconds = normalizedInput.millisecond || 0;

    this._isValid = isDurationValid(normalizedInput);

    // representation for dateAddRemove
    this._milliseconds = +milliseconds +
        seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
    // Because of dateAddRemove treats 24 hours as different from a
    // day when working around DST, we need to store them separately
    this._days = +days +
        weeks * 7;
    // It is impossible translate months into days without knowing
    // which months you are are talking about, so we have to store
    // it separately.
    this._months = +months +
        quarters * 3 +
        years * 12;

    this._data = {};

    this._locale = getLocale();

    this._bubble();
}

function isDuration (obj) {
    return obj instanceof Duration;
}

function absRound (number) {
    if (number < 0) {
        return Math.round(-1 * number) * -1;
    } else {
        return Math.round(number);
    }
}

// FORMATTING

function offset (token, separator) {
    addFormatToken(token, 0, 0, function () {
        var offset = this.utcOffset();
        var sign = '+';
        if (offset < 0) {
            offset = -offset;
            sign = '-';
        }
        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
    });
}

offset('Z', ':');
offset('ZZ', '');

// PARSING

addRegexToken('Z',  matchShortOffset);
addRegexToken('ZZ', matchShortOffset);
addParseToken(['Z', 'ZZ'], function (input, array, config) {
    config._useUTC = true;
    config._tzm = offsetFromString(matchShortOffset, input);
});

// HELPERS

// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
var chunkOffset = /([\+\-]|\d\d)/gi;

function offsetFromString(matcher, string) {
    var matches = (string || '').match(matcher);

    if (matches === null) {
        return null;
    }

    var chunk   = matches[matches.length - 1] || [];
    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
    var minutes = +(parts[1] * 60) + toInt(parts[2]);

    return minutes === 0 ?
      0 :
      parts[0] === '+' ? minutes : -minutes;
}

// Return a moment from input, that is local/utc/zone equivalent to model.
function cloneWithOffset(input, model) {
    var res, diff;
    if (model._isUTC) {
        res = model.clone();
        diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
        // Use low-level api, because this fn is low-level api.
        res._d.setTime(res._d.valueOf() + diff);
        hooks.updateOffset(res, false);
        return res;
    } else {
        return createLocal(input).local();
    }
}

function getDateOffset (m) {
    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
    // https://github.com/moment/moment/pull/1871
    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
}

// HOOKS

// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
hooks.updateOffset = function () {};

// MOMENTS

// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
function getSetOffset (input, keepLocalTime, keepMinutes) {
    var offset = this._offset || 0,
        localAdjust;
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    if (input != null) {
        if (typeof input === 'string') {
            input = offsetFromString(matchShortOffset, input);
            if (input === null) {
                return this;
            }
        } else if (Math.abs(input) < 16 && !keepMinutes) {
            input = input * 60;
        }
        if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
        }
        this._offset = input;
        this._isUTC = true;
        if (localAdjust != null) {
            this.add(localAdjust, 'm');
        }
        if (offset !== input) {
            if (!keepLocalTime || this._changeInProgress) {
                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
            } else if (!this._changeInProgress) {
                this._changeInProgress = true;
                hooks.updateOffset(this, true);
                this._changeInProgress = null;
            }
        }
        return this;
    } else {
        return this._isUTC ? offset : getDateOffset(this);
    }
}

function getSetZone (input, keepLocalTime) {
    if (input != null) {
        if (typeof input !== 'string') {
            input = -input;
        }

        this.utcOffset(input, keepLocalTime);

        return this;
    } else {
        return -this.utcOffset();
    }
}

function setOffsetToUTC (keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
}

function setOffsetToLocal (keepLocalTime) {
    if (this._isUTC) {
        this.utcOffset(0, keepLocalTime);
        this._isUTC = false;

        if (keepLocalTime) {
            this.subtract(getDateOffset(this), 'm');
        }
    }
    return this;
}

function setOffsetToParsedOffset () {
    if (this._tzm != null) {
        this.utcOffset(this._tzm, false, true);
    } else if (typeof this._i === 'string') {
        var tZone = offsetFromString(matchOffset, this._i);
        if (tZone != null) {
            this.utcOffset(tZone);
        }
        else {
            this.utcOffset(0, true);
        }
    }
    return this;
}

function hasAlignedHourOffset (input) {
    if (!this.isValid()) {
        return false;
    }
    input = input ? createLocal(input).utcOffset() : 0;

    return (this.utcOffset() - input) % 60 === 0;
}

function isDaylightSavingTime () {
    return (
        this.utcOffset() > this.clone().month(0).utcOffset() ||
        this.utcOffset() > this.clone().month(5).utcOffset()
    );
}

function isDaylightSavingTimeShifted () {
    if (!isUndefined(this._isDSTShifted)) {
        return this._isDSTShifted;
    }

    var c = {};

    copyConfig(c, this);
    c = prepareConfig(c);

    if (c._a) {
        var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
        this._isDSTShifted = this.isValid() &&
            compareArrays(c._a, other.toArray()) > 0;
    } else {
        this._isDSTShifted = false;
    }

    return this._isDSTShifted;
}

function isLocal () {
    return this.isValid() ? !this._isUTC : false;
}

function isUtcOffset () {
    return this.isValid() ? this._isUTC : false;
}

function isUtc () {
    return this.isValid() ? this._isUTC && this._offset === 0 : false;
}

// ASP.NET json date format regex
var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
// and further modified to allow for strings containing both week and day
var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

function createDuration (input, key) {
    var duration = input,
        // matching against regexp is expensive, do it on demand
        match = null,
        sign,
        ret,
        diffRes;

    if (isDuration(input)) {
        duration = {
            ms : input._milliseconds,
            d  : input._days,
            M  : input._months
        };
    } else if (isNumber(input)) {
        duration = {};
        if (key) {
            duration[key] = input;
        } else {
            duration.milliseconds = input;
        }
    } else if (!!(match = aspNetRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y  : 0,
            d  : toInt(match[DATE])                         * sign,
            h  : toInt(match[HOUR])                         * sign,
            m  : toInt(match[MINUTE])                       * sign,
            s  : toInt(match[SECOND])                       * sign,
            ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
        };
    } else if (!!(match = isoRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y : parseIso(match[2], sign),
            M : parseIso(match[3], sign),
            w : parseIso(match[4], sign),
            d : parseIso(match[5], sign),
            h : parseIso(match[6], sign),
            m : parseIso(match[7], sign),
            s : parseIso(match[8], sign)
        };
    } else if (duration == null) {// checks for null or undefined
        duration = {};
    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
        diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

        duration = {};
        duration.ms = diffRes.milliseconds;
        duration.M = diffRes.months;
    }

    ret = new Duration(duration);

    if (isDuration(input) && hasOwnProp(input, '_locale')) {
        ret._locale = input._locale;
    }

    return ret;
}

createDuration.fn = Duration.prototype;
createDuration.invalid = createInvalid$1;

function parseIso (inp, sign) {
    // We'd normally use ~~inp for this, but unfortunately it also
    // converts floats to ints.
    // inp may be undefined, so careful calling replace on it.
    var res = inp && parseFloat(inp.replace(',', '.'));
    // apply sign while we're at it
    return (isNaN(res) ? 0 : res) * sign;
}

function positiveMomentsDifference(base, other) {
    var res = {milliseconds: 0, months: 0};

    res.months = other.month() - base.month() +
        (other.year() - base.year()) * 12;
    if (base.clone().add(res.months, 'M').isAfter(other)) {
        --res.months;
    }

    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

    return res;
}

function momentsDifference(base, other) {
    var res;
    if (!(base.isValid() && other.isValid())) {
        return {milliseconds: 0, months: 0};
    }

    other = cloneWithOffset(other, base);
    if (base.isBefore(other)) {
        res = positiveMomentsDifference(base, other);
    } else {
        res = positiveMomentsDifference(other, base);
        res.milliseconds = -res.milliseconds;
        res.months = -res.months;
    }

    return res;
}

// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction, name) {
    return function (val, period) {
        var dur, tmp;
        //invert the arguments, but complain about it
        if (period !== null && !isNaN(+period)) {
            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
            tmp = val; val = period; period = tmp;
        }

        val = typeof val === 'string' ? +val : val;
        dur = createDuration(val, period);
        addSubtract(this, dur, direction);
        return this;
    };
}

function addSubtract (mom, duration, isAdding, updateOffset) {
    var milliseconds = duration._milliseconds,
        days = absRound(duration._days),
        months = absRound(duration._months);

    if (!mom.isValid()) {
        // No op
        return;
    }

    updateOffset = updateOffset == null ? true : updateOffset;

    if (milliseconds) {
        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
    }
    if (days) {
        set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
    }
    if (months) {
        setMonth(mom, get(mom, 'Month') + months * isAdding);
    }
    if (updateOffset) {
        hooks.updateOffset(mom, days || months);
    }
}

var add      = createAdder(1, 'add');
var subtract = createAdder(-1, 'subtract');

function getCalendarFormat(myMoment, now) {
    var diff = myMoment.diff(now, 'days', true);
    return diff < -6 ? 'sameElse' :
            diff < -1 ? 'lastWeek' :
            diff < 0 ? 'lastDay' :
            diff < 1 ? 'sameDay' :
            diff < 2 ? 'nextDay' :
            diff < 7 ? 'nextWeek' : 'sameElse';
}

function calendar$1 (time, formats) {
    // We want to compare the start of today, vs this.
    // Getting start-of-today depends on whether we're local/utc/offset or not.
    var now = time || createLocal(),
        sod = cloneWithOffset(now, this).startOf('day'),
        format = hooks.calendarFormat(this, sod) || 'sameElse';

    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

    return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
}

function clone () {
    return new Moment(this);
}

function isAfter (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() > localInput.valueOf();
    } else {
        return localInput.valueOf() < this.clone().startOf(units).valueOf();
    }
}

function isBefore (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() < localInput.valueOf();
    } else {
        return this.clone().endOf(units).valueOf() < localInput.valueOf();
    }
}

function isBetween (from, to, units, inclusivity) {
    inclusivity = inclusivity || '()';
    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
        (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
}

function isSame (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input),
        inputMs;
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(units || 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() === localInput.valueOf();
    } else {
        inputMs = localInput.valueOf();
        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
    }
}

function isSameOrAfter (input, units) {
    return this.isSame(input, units) || this.isAfter(input,units);
}

function isSameOrBefore (input, units) {
    return this.isSame(input, units) || this.isBefore(input,units);
}

function diff (input, units, asFloat) {
    var that,
        zoneDelta,
        delta, output;

    if (!this.isValid()) {
        return NaN;
    }

    that = cloneWithOffset(input, this);

    if (!that.isValid()) {
        return NaN;
    }

    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

    units = normalizeUnits(units);

    if (units === 'year' || units === 'month' || units === 'quarter') {
        output = monthDiff(this, that);
        if (units === 'quarter') {
            output = output / 3;
        } else if (units === 'year') {
            output = output / 12;
        }
    } else {
        delta = this - that;
        output = units === 'second' ? delta / 1e3 : // 1000
            units === 'minute' ? delta / 6e4 : // 1000 * 60
            units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
            units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
            delta;
    }
    return asFloat ? output : absFloor(output);
}

function monthDiff (a, b) {
    // difference in months
    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
        // b is in (anchor - 1 month, anchor + 1 month)
        anchor = a.clone().add(wholeMonthDiff, 'months'),
        anchor2, adjust;

    if (b - anchor < 0) {
        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor - anchor2);
    } else {
        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor2 - anchor);
    }

    //check for negative zero, return zero if negative zero
    return -(wholeMonthDiff + adjust) || 0;
}

hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

function toString () {
    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
}

function toISOString() {
    if (!this.isValid()) {
        return null;
    }
    var m = this.clone().utc();
    if (m.year() < 0 || m.year() > 9999) {
        return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
    if (isFunction(Date.prototype.toISOString)) {
        // native implementation is ~50x faster, use it when we can
        return this.toDate().toISOString();
    }
    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
}

/**
 * Return a human readable representation of a moment that can
 * also be evaluated to get a new moment which is the same
 *
 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
 */
function inspect () {
    if (!this.isValid()) {
        return 'moment.invalid(/* ' + this._i + ' */)';
    }
    var func = 'moment';
    var zone = '';
    if (!this.isLocal()) {
        func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
        zone = 'Z';
    }
    var prefix = '[' + func + '("]';
    var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
    var datetime = '-MM-DD[T]HH:mm:ss.SSS';
    var suffix = zone + '[")]';

    return this.format(prefix + year + datetime + suffix);
}

function format (inputString) {
    if (!inputString) {
        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
    }
    var output = formatMoment(this, inputString);
    return this.localeData().postformat(output);
}

function from (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function fromNow (withoutSuffix) {
    return this.from(createLocal(), withoutSuffix);
}

function to (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function toNow (withoutSuffix) {
    return this.to(createLocal(), withoutSuffix);
}

// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function locale (key) {
    var newLocaleData;

    if (key === undefined) {
        return this._locale._abbr;
    } else {
        newLocaleData = getLocale(key);
        if (newLocaleData != null) {
            this._locale = newLocaleData;
        }
        return this;
    }
}

var lang = deprecate(
    'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
    function (key) {
        if (key === undefined) {
            return this.localeData();
        } else {
            return this.locale(key);
        }
    }
);

function localeData () {
    return this._locale;
}

function startOf (units) {
    units = normalizeUnits(units);
    // the following switch intentionally omits break keywords
    // to utilize falling through the cases.
    switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
        case 'date':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
    }

    // weeks are a special case
    if (units === 'week') {
        this.weekday(0);
    }
    if (units === 'isoWeek') {
        this.isoWeekday(1);
    }

    // quarters are also special
    if (units === 'quarter') {
        this.month(Math.floor(this.month() / 3) * 3);
    }

    return this;
}

function endOf (units) {
    units = normalizeUnits(units);
    if (units === undefined || units === 'millisecond') {
        return this;
    }

    // 'date' is an alias for 'day', so it should be considered as such.
    if (units === 'date') {
        units = 'day';
    }

    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
}

function valueOf () {
    return this._d.valueOf() - ((this._offset || 0) * 60000);
}

function unix () {
    return Math.floor(this.valueOf() / 1000);
}

function toDate () {
    return new Date(this.valueOf());
}

function toArray () {
    var m = this;
    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
}

function toObject () {
    var m = this;
    return {
        years: m.year(),
        months: m.month(),
        date: m.date(),
        hours: m.hours(),
        minutes: m.minutes(),
        seconds: m.seconds(),
        milliseconds: m.milliseconds()
    };
}

function toJSON () {
    // new Date(NaN).toJSON() === null
    return this.isValid() ? this.toISOString() : null;
}

function isValid$2 () {
    return isValid(this);
}

function parsingFlags () {
    return extend({}, getParsingFlags(this));
}

function invalidAt () {
    return getParsingFlags(this).overflow;
}

function creationData() {
    return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
    };
}

// FORMATTING

addFormatToken(0, ['gg', 2], 0, function () {
    return this.weekYear() % 100;
});

addFormatToken(0, ['GG', 2], 0, function () {
    return this.isoWeekYear() % 100;
});

function addWeekYearFormatToken (token, getter) {
    addFormatToken(0, [token, token.length], 0, getter);
}

addWeekYearFormatToken('gggg',     'weekYear');
addWeekYearFormatToken('ggggg',    'weekYear');
addWeekYearFormatToken('GGGG',  'isoWeekYear');
addWeekYearFormatToken('GGGGG', 'isoWeekYear');

// ALIASES

addUnitAlias('weekYear', 'gg');
addUnitAlias('isoWeekYear', 'GG');

// PRIORITY

addUnitPriority('weekYear', 1);
addUnitPriority('isoWeekYear', 1);


// PARSING

addRegexToken('G',      matchSigned);
addRegexToken('g',      matchSigned);
addRegexToken('GG',     match1to2, match2);
addRegexToken('gg',     match1to2, match2);
addRegexToken('GGGG',   match1to4, match4);
addRegexToken('gggg',   match1to4, match4);
addRegexToken('GGGGG',  match1to6, match6);
addRegexToken('ggggg',  match1to6, match6);

addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
    week[token.substr(0, 2)] = toInt(input);
});

addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
    week[token] = hooks.parseTwoDigitYear(input);
});

// MOMENTS

function getSetWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy);
}

function getSetISOWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input, this.isoWeek(), this.isoWeekday(), 1, 4);
}

function getISOWeeksInYear () {
    return weeksInYear(this.year(), 1, 4);
}

function getWeeksInYear () {
    var weekInfo = this.localeData()._week;
    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
}

function getSetWeekYearHelper(input, week, weekday, dow, doy) {
    var weeksTarget;
    if (input == null) {
        return weekOfYear(this, dow, doy).year;
    } else {
        weeksTarget = weeksInYear(input, dow, doy);
        if (week > weeksTarget) {
            week = weeksTarget;
        }
        return setWeekAll.call(this, input, week, weekday, dow, doy);
    }
}

function setWeekAll(weekYear, week, weekday, dow, doy) {
    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

    this.year(date.getUTCFullYear());
    this.month(date.getUTCMonth());
    this.date(date.getUTCDate());
    return this;
}

// FORMATTING

addFormatToken('Q', 0, 'Qo', 'quarter');

// ALIASES

addUnitAlias('quarter', 'Q');

// PRIORITY

addUnitPriority('quarter', 7);

// PARSING

addRegexToken('Q', match1);
addParseToken('Q', function (input, array) {
    array[MONTH] = (toInt(input) - 1) * 3;
});

// MOMENTS

function getSetQuarter (input) {
    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
}

// FORMATTING

addFormatToken('D', ['DD', 2], 'Do', 'date');

// ALIASES

addUnitAlias('date', 'D');

// PRIOROITY
addUnitPriority('date', 9);

// PARSING

addRegexToken('D',  match1to2);
addRegexToken('DD', match1to2, match2);
addRegexToken('Do', function (isStrict, locale) {
    // TODO: Remove "ordinalParse" fallback in next major release.
    return isStrict ?
      (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
      locale._dayOfMonthOrdinalParseLenient;
});

addParseToken(['D', 'DD'], DATE);
addParseToken('Do', function (input, array) {
    array[DATE] = toInt(input.match(match1to2)[0], 10);
});

// MOMENTS

var getSetDayOfMonth = makeGetSet('Date', true);

// FORMATTING

addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

// ALIASES

addUnitAlias('dayOfYear', 'DDD');

// PRIORITY
addUnitPriority('dayOfYear', 4);

// PARSING

addRegexToken('DDD',  match1to3);
addRegexToken('DDDD', match3);
addParseToken(['DDD', 'DDDD'], function (input, array, config) {
    config._dayOfYear = toInt(input);
});

// HELPERS

// MOMENTS

function getSetDayOfYear (input) {
    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
}

// FORMATTING

addFormatToken('m', ['mm', 2], 0, 'minute');

// ALIASES

addUnitAlias('minute', 'm');

// PRIORITY

addUnitPriority('minute', 14);

// PARSING

addRegexToken('m',  match1to2);
addRegexToken('mm', match1to2, match2);
addParseToken(['m', 'mm'], MINUTE);

// MOMENTS

var getSetMinute = makeGetSet('Minutes', false);

// FORMATTING

addFormatToken('s', ['ss', 2], 0, 'second');

// ALIASES

addUnitAlias('second', 's');

// PRIORITY

addUnitPriority('second', 15);

// PARSING

addRegexToken('s',  match1to2);
addRegexToken('ss', match1to2, match2);
addParseToken(['s', 'ss'], SECOND);

// MOMENTS

var getSetSecond = makeGetSet('Seconds', false);

// FORMATTING

addFormatToken('S', 0, 0, function () {
    return ~~(this.millisecond() / 100);
});

addFormatToken(0, ['SS', 2], 0, function () {
    return ~~(this.millisecond() / 10);
});

addFormatToken(0, ['SSS', 3], 0, 'millisecond');
addFormatToken(0, ['SSSS', 4], 0, function () {
    return this.millisecond() * 10;
});
addFormatToken(0, ['SSSSS', 5], 0, function () {
    return this.millisecond() * 100;
});
addFormatToken(0, ['SSSSSS', 6], 0, function () {
    return this.millisecond() * 1000;
});
addFormatToken(0, ['SSSSSSS', 7], 0, function () {
    return this.millisecond() * 10000;
});
addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
    return this.millisecond() * 100000;
});
addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
    return this.millisecond() * 1000000;
});


// ALIASES

addUnitAlias('millisecond', 'ms');

// PRIORITY

addUnitPriority('millisecond', 16);

// PARSING

addRegexToken('S',    match1to3, match1);
addRegexToken('SS',   match1to3, match2);
addRegexToken('SSS',  match1to3, match3);

var token;
for (token = 'SSSS'; token.length <= 9; token += 'S') {
    addRegexToken(token, matchUnsigned);
}

function parseMs(input, array) {
    array[MILLISECOND] = toInt(('0.' + input) * 1000);
}

for (token = 'S'; token.length <= 9; token += 'S') {
    addParseToken(token, parseMs);
}
// MOMENTS

var getSetMillisecond = makeGetSet('Milliseconds', false);

// FORMATTING

addFormatToken('z',  0, 0, 'zoneAbbr');
addFormatToken('zz', 0, 0, 'zoneName');

// MOMENTS

function getZoneAbbr () {
    return this._isUTC ? 'UTC' : '';
}

function getZoneName () {
    return this._isUTC ? 'Coordinated Universal Time' : '';
}

var proto = Moment.prototype;

proto.add               = add;
proto.calendar          = calendar$1;
proto.clone             = clone;
proto.diff              = diff;
proto.endOf             = endOf;
proto.format            = format;
proto.from              = from;
proto.fromNow           = fromNow;
proto.to                = to;
proto.toNow             = toNow;
proto.get               = stringGet;
proto.invalidAt         = invalidAt;
proto.isAfter           = isAfter;
proto.isBefore          = isBefore;
proto.isBetween         = isBetween;
proto.isSame            = isSame;
proto.isSameOrAfter     = isSameOrAfter;
proto.isSameOrBefore    = isSameOrBefore;
proto.isValid           = isValid$2;
proto.lang              = lang;
proto.locale            = locale;
proto.localeData        = localeData;
proto.max               = prototypeMax;
proto.min               = prototypeMin;
proto.parsingFlags      = parsingFlags;
proto.set               = stringSet;
proto.startOf           = startOf;
proto.subtract          = subtract;
proto.toArray           = toArray;
proto.toObject          = toObject;
proto.toDate            = toDate;
proto.toISOString       = toISOString;
proto.inspect           = inspect;
proto.toJSON            = toJSON;
proto.toString          = toString;
proto.unix              = unix;
proto.valueOf           = valueOf;
proto.creationData      = creationData;

// Year
proto.year       = getSetYear;
proto.isLeapYear = getIsLeapYear;

// Week Year
proto.weekYear    = getSetWeekYear;
proto.isoWeekYear = getSetISOWeekYear;

// Quarter
proto.quarter = proto.quarters = getSetQuarter;

// Month
proto.month       = getSetMonth;
proto.daysInMonth = getDaysInMonth;

// Week
proto.week           = proto.weeks        = getSetWeek;
proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
proto.weeksInYear    = getWeeksInYear;
proto.isoWeeksInYear = getISOWeeksInYear;

// Day
proto.date       = getSetDayOfMonth;
proto.day        = proto.days             = getSetDayOfWeek;
proto.weekday    = getSetLocaleDayOfWeek;
proto.isoWeekday = getSetISODayOfWeek;
proto.dayOfYear  = getSetDayOfYear;

// Hour
proto.hour = proto.hours = getSetHour;

// Minute
proto.minute = proto.minutes = getSetMinute;

// Second
proto.second = proto.seconds = getSetSecond;

// Millisecond
proto.millisecond = proto.milliseconds = getSetMillisecond;

// Offset
proto.utcOffset            = getSetOffset;
proto.utc                  = setOffsetToUTC;
proto.local                = setOffsetToLocal;
proto.parseZone            = setOffsetToParsedOffset;
proto.hasAlignedHourOffset = hasAlignedHourOffset;
proto.isDST                = isDaylightSavingTime;
proto.isLocal              = isLocal;
proto.isUtcOffset          = isUtcOffset;
proto.isUtc                = isUtc;
proto.isUTC                = isUtc;

// Timezone
proto.zoneAbbr = getZoneAbbr;
proto.zoneName = getZoneName;

// Deprecations
proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

function createUnix (input) {
    return createLocal(input * 1000);
}

function createInZone () {
    return createLocal.apply(null, arguments).parseZone();
}

function preParsePostFormat (string) {
    return string;
}

var proto$1 = Locale.prototype;

proto$1.calendar        = calendar;
proto$1.longDateFormat  = longDateFormat;
proto$1.invalidDate     = invalidDate;
proto$1.ordinal         = ordinal;
proto$1.preparse        = preParsePostFormat;
proto$1.postformat      = preParsePostFormat;
proto$1.relativeTime    = relativeTime;
proto$1.pastFuture      = pastFuture;
proto$1.set             = set;

// Month
proto$1.months            =        localeMonths;
proto$1.monthsShort       =        localeMonthsShort;
proto$1.monthsParse       =        localeMonthsParse;
proto$1.monthsRegex       = monthsRegex;
proto$1.monthsShortRegex  = monthsShortRegex;

// Week
proto$1.week = localeWeek;
proto$1.firstDayOfYear = localeFirstDayOfYear;
proto$1.firstDayOfWeek = localeFirstDayOfWeek;

// Day of Week
proto$1.weekdays       =        localeWeekdays;
proto$1.weekdaysMin    =        localeWeekdaysMin;
proto$1.weekdaysShort  =        localeWeekdaysShort;
proto$1.weekdaysParse  =        localeWeekdaysParse;

proto$1.weekdaysRegex       =        weekdaysRegex;
proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

// Hours
proto$1.isPM = localeIsPM;
proto$1.meridiem = localeMeridiem;

function get$1 (format, index, field, setter) {
    var locale = getLocale();
    var utc = createUTC().set(setter, index);
    return locale[field](utc, format);
}

function listMonthsImpl (format, index, field) {
    if (isNumber(format)) {
        index = format;
        format = undefined;
    }

    format = format || '';

    if (index != null) {
        return get$1(format, index, field, 'month');
    }

    var i;
    var out = [];
    for (i = 0; i < 12; i++) {
        out[i] = get$1(format, i, field, 'month');
    }
    return out;
}

// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
function listWeekdaysImpl (localeSorted, format, index, field) {
    if (typeof localeSorted === 'boolean') {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    } else {
        format = localeSorted;
        index = format;
        localeSorted = false;

        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    }

    var locale = getLocale(),
        shift = localeSorted ? locale._week.dow : 0;

    if (index != null) {
        return get$1(format, (index + shift) % 7, field, 'day');
    }

    var i;
    var out = [];
    for (i = 0; i < 7; i++) {
        out[i] = get$1(format, (i + shift) % 7, field, 'day');
    }
    return out;
}

function listMonths (format, index) {
    return listMonthsImpl(format, index, 'months');
}

function listMonthsShort (format, index) {
    return listMonthsImpl(format, index, 'monthsShort');
}

function listWeekdays (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
}

function listWeekdaysShort (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
}

function listWeekdaysMin (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
}

getSetGlobalLocale('en', {
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (toInt(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});

// Side effect imports
hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

var mathAbs = Math.abs;

function abs () {
    var data           = this._data;

    this._milliseconds = mathAbs(this._milliseconds);
    this._days         = mathAbs(this._days);
    this._months       = mathAbs(this._months);

    data.milliseconds  = mathAbs(data.milliseconds);
    data.seconds       = mathAbs(data.seconds);
    data.minutes       = mathAbs(data.minutes);
    data.hours         = mathAbs(data.hours);
    data.months        = mathAbs(data.months);
    data.years         = mathAbs(data.years);

    return this;
}

function addSubtract$1 (duration, input, value, direction) {
    var other = createDuration(input, value);

    duration._milliseconds += direction * other._milliseconds;
    duration._days         += direction * other._days;
    duration._months       += direction * other._months;

    return duration._bubble();
}

// supports only 2.0-style add(1, 's') or add(duration)
function add$1 (input, value) {
    return addSubtract$1(this, input, value, 1);
}

// supports only 2.0-style subtract(1, 's') or subtract(duration)
function subtract$1 (input, value) {
    return addSubtract$1(this, input, value, -1);
}

function absCeil (number) {
    if (number < 0) {
        return Math.floor(number);
    } else {
        return Math.ceil(number);
    }
}

function bubble () {
    var milliseconds = this._milliseconds;
    var days         = this._days;
    var months       = this._months;
    var data         = this._data;
    var seconds, minutes, hours, years, monthsFromDays;

    // if we have a mix of positive and negative values, bubble down first
    // check: https://github.com/moment/moment/issues/2166
    if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
            (milliseconds <= 0 && days <= 0 && months <= 0))) {
        milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
        days = 0;
        months = 0;
    }

    // The following code bubbles up values, see the tests for
    // examples of what that means.
    data.milliseconds = milliseconds % 1000;

    seconds           = absFloor(milliseconds / 1000);
    data.seconds      = seconds % 60;

    minutes           = absFloor(seconds / 60);
    data.minutes      = minutes % 60;

    hours             = absFloor(minutes / 60);
    data.hours        = hours % 24;

    days += absFloor(hours / 24);

    // convert days to months
    monthsFromDays = absFloor(daysToMonths(days));
    months += monthsFromDays;
    days -= absCeil(monthsToDays(monthsFromDays));

    // 12 months -> 1 year
    years = absFloor(months / 12);
    months %= 12;

    data.days   = days;
    data.months = months;
    data.years  = years;

    return this;
}

function daysToMonths (days) {
    // 400 years have 146097 days (taking into account leap year rules)
    // 400 years have 12 months === 4800
    return days * 4800 / 146097;
}

function monthsToDays (months) {
    // the reverse of daysToMonths
    return months * 146097 / 4800;
}

function as (units) {
    if (!this.isValid()) {
        return NaN;
    }
    var days;
    var months;
    var milliseconds = this._milliseconds;

    units = normalizeUnits(units);

    if (units === 'month' || units === 'year') {
        days   = this._days   + milliseconds / 864e5;
        months = this._months + daysToMonths(days);
        return units === 'month' ? months : months / 12;
    } else {
        // handle milliseconds separately because of floating point math errors (issue #1867)
        days = this._days + Math.round(monthsToDays(this._months));
        switch (units) {
            case 'week'   : return days / 7     + milliseconds / 6048e5;
            case 'day'    : return days         + milliseconds / 864e5;
            case 'hour'   : return days * 24    + milliseconds / 36e5;
            case 'minute' : return days * 1440  + milliseconds / 6e4;
            case 'second' : return days * 86400 + milliseconds / 1000;
            // Math.floor prevents floating point math errors here
            case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
            default: throw new Error('Unknown unit ' + units);
        }
    }
}

// TODO: Use this.as('ms')?
function valueOf$1 () {
    if (!this.isValid()) {
        return NaN;
    }
    return (
        this._milliseconds +
        this._days * 864e5 +
        (this._months % 12) * 2592e6 +
        toInt(this._months / 12) * 31536e6
    );
}

function makeAs (alias) {
    return function () {
        return this.as(alias);
    };
}

var asMilliseconds = makeAs('ms');
var asSeconds      = makeAs('s');
var asMinutes      = makeAs('m');
var asHours        = makeAs('h');
var asDays         = makeAs('d');
var asWeeks        = makeAs('w');
var asMonths       = makeAs('M');
var asYears        = makeAs('y');

function get$2 (units) {
    units = normalizeUnits(units);
    return this.isValid() ? this[units + 's']() : NaN;
}

function makeGetter(name) {
    return function () {
        return this.isValid() ? this._data[name] : NaN;
    };
}

var milliseconds = makeGetter('milliseconds');
var seconds      = makeGetter('seconds');
var minutes      = makeGetter('minutes');
var hours        = makeGetter('hours');
var days         = makeGetter('days');
var months       = makeGetter('months');
var years        = makeGetter('years');

function weeks () {
    return absFloor(this.days() / 7);
}

var round = Math.round;
var thresholds = {
    ss: 44,         // a few seconds to seconds
    s : 45,         // seconds to minute
    m : 45,         // minutes to hour
    h : 22,         // hours to day
    d : 26,         // days to month
    M : 11          // months to year
};

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
    var duration = createDuration(posNegDuration).abs();
    var seconds  = round(duration.as('s'));
    var minutes  = round(duration.as('m'));
    var hours    = round(duration.as('h'));
    var days     = round(duration.as('d'));
    var months   = round(duration.as('M'));
    var years    = round(duration.as('y'));

    var a = seconds <= thresholds.ss && ['s', seconds]  ||
            seconds < thresholds.s   && ['ss', seconds] ||
            minutes <= 1             && ['m']           ||
            minutes < thresholds.m   && ['mm', minutes] ||
            hours   <= 1             && ['h']           ||
            hours   < thresholds.h   && ['hh', hours]   ||
            days    <= 1             && ['d']           ||
            days    < thresholds.d   && ['dd', days]    ||
            months  <= 1             && ['M']           ||
            months  < thresholds.M   && ['MM', months]  ||
            years   <= 1             && ['y']           || ['yy', years];

    a[2] = withoutSuffix;
    a[3] = +posNegDuration > 0;
    a[4] = locale;
    return substituteTimeAgo.apply(null, a);
}

// This function allows you to set the rounding function for relative time strings
function getSetRelativeTimeRounding (roundingFunction) {
    if (roundingFunction === undefined) {
        return round;
    }
    if (typeof(roundingFunction) === 'function') {
        round = roundingFunction;
        return true;
    }
    return false;
}

// This function allows you to set a threshold for relative time strings
function getSetRelativeTimeThreshold (threshold, limit) {
    if (thresholds[threshold] === undefined) {
        return false;
    }
    if (limit === undefined) {
        return thresholds[threshold];
    }
    thresholds[threshold] = limit;
    if (threshold === 's') {
        thresholds.ss = limit - 1;
    }
    return true;
}

function humanize (withSuffix) {
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var locale = this.localeData();
    var output = relativeTime$1(this, !withSuffix, locale);

    if (withSuffix) {
        output = locale.pastFuture(+this, output);
    }

    return locale.postformat(output);
}

var abs$1 = Math.abs;

function toISOString$1() {
    // for ISO strings we do not use the normal bubbling rules:
    //  * milliseconds bubble up until they become hours
    //  * days do not bubble at all
    //  * months bubble up until they become years
    // This is because there is no context-free conversion between hours and days
    // (think of clock changes)
    // and also not between days and months (28-31 days per month)
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var seconds = abs$1(this._milliseconds) / 1000;
    var days         = abs$1(this._days);
    var months       = abs$1(this._months);
    var minutes, hours, years;

    // 3600 seconds -> 60 minutes -> 1 hour
    minutes           = absFloor(seconds / 60);
    hours             = absFloor(minutes / 60);
    seconds %= 60;
    minutes %= 60;

    // 12 months -> 1 year
    years  = absFloor(months / 12);
    months %= 12;


    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
    var Y = years;
    var M = months;
    var D = days;
    var h = hours;
    var m = minutes;
    var s = seconds;
    var total = this.asSeconds();

    if (!total) {
        // this is the same as C#'s (Noda) and python (isodate)...
        // but not other JS (goog.date)
        return 'P0D';
    }

    return (total < 0 ? '-' : '') +
        'P' +
        (Y ? Y + 'Y' : '') +
        (M ? M + 'M' : '') +
        (D ? D + 'D' : '') +
        ((h || m || s) ? 'T' : '') +
        (h ? h + 'H' : '') +
        (m ? m + 'M' : '') +
        (s ? s + 'S' : '');
}

var proto$2 = Duration.prototype;

proto$2.isValid        = isValid$1;
proto$2.abs            = abs;
proto$2.add            = add$1;
proto$2.subtract       = subtract$1;
proto$2.as             = as;
proto$2.asMilliseconds = asMilliseconds;
proto$2.asSeconds      = asSeconds;
proto$2.asMinutes      = asMinutes;
proto$2.asHours        = asHours;
proto$2.asDays         = asDays;
proto$2.asWeeks        = asWeeks;
proto$2.asMonths       = asMonths;
proto$2.asYears        = asYears;
proto$2.valueOf        = valueOf$1;
proto$2._bubble        = bubble;
proto$2.get            = get$2;
proto$2.milliseconds   = milliseconds;
proto$2.seconds        = seconds;
proto$2.minutes        = minutes;
proto$2.hours          = hours;
proto$2.days           = days;
proto$2.weeks          = weeks;
proto$2.months         = months;
proto$2.years          = years;
proto$2.humanize       = humanize;
proto$2.toISOString    = toISOString$1;
proto$2.toString       = toISOString$1;
proto$2.toJSON         = toISOString$1;
proto$2.locale         = locale;
proto$2.localeData     = localeData;

// Deprecations
proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
proto$2.lang = lang;

// Side effect imports

// FORMATTING

addFormatToken('X', 0, 0, 'unix');
addFormatToken('x', 0, 0, 'valueOf');

// PARSING

addRegexToken('x', matchSigned);
addRegexToken('X', matchTimestamp);
addParseToken('X', function (input, array, config) {
    config._d = new Date(parseFloat(input, 10) * 1000);
});
addParseToken('x', function (input, array, config) {
    config._d = new Date(toInt(input));
});

// Side effect imports


hooks.version = '2.18.1';

setHookCallback(createLocal);

hooks.fn                    = proto;
hooks.min                   = min;
hooks.max                   = max;
hooks.now                   = now;
hooks.utc                   = createUTC;
hooks.unix                  = createUnix;
hooks.months                = listMonths;
hooks.isDate                = isDate;
hooks.locale                = getSetGlobalLocale;
hooks.invalid               = createInvalid;
hooks.duration              = createDuration;
hooks.isMoment              = isMoment;
hooks.weekdays              = listWeekdays;
hooks.parseZone             = createInZone;
hooks.localeData            = getLocale;
hooks.isDuration            = isDuration;
hooks.monthsShort           = listMonthsShort;
hooks.weekdaysMin           = listWeekdaysMin;
hooks.defineLocale          = defineLocale;
hooks.updateLocale          = updateLocale;
hooks.locales               = listLocales;
hooks.weekdaysShort         = listWeekdaysShort;
hooks.normalizeUnits        = normalizeUnits;
hooks.relativeTimeRounding = getSetRelativeTimeRounding;
hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
hooks.calendarFormat        = getCalendarFormat;
hooks.prototype             = proto;

return hooks;

})));
`;