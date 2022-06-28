/**
 * @fileoverview styled component 必须以 Styled 为前缀命名
 */
("use strict");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGES = "styled component 必须以 Styled 为前缀命名";

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "styled component 必须以 Styled 为前缀命名，这样能方便的在使用的地方看出这里是一个 styled component（只负责样式包装，没有额外的逻辑）",
      category: "Best Practices",
      recommended: true,
    },
    fixable: 'code',
    messages: {
      avoidMethod: ERROR_MESSAGES,
    },
    schema: [],
  },

  create: function (context) {
    return {
      VariableDeclarator: (node) => {
        const tag = node.init.tag;
        const isStyledComponentDeclarator = (function () {
          if (!tag) return false;
          if (tag.type === "CallExpression") {
            return node.init.tag.callee.name === "styled";
          }
          if (tag.type === "MemberExpression") {
            return node.init.tag.object.name === "styled";
          }
        })();
        if (isStyledComponentDeclarator) {
          if (checkNamingValidated(node.id.name)) {
            context.report({
              node: node.id,
              messageId: "avoidMethod",
              data: {
                identifier: node.id.name,
              },
              fix: function (fixer) {
                return fixer.insertTextBefore(node.id, "Styled");
              },
            });
          }
        }
        return;
      },
    };
  },
};

function checkNamingValidated(name) {
  return name.slice(0, 6) !== "Styled";
}
