/**
 * @fileoverview 不允许直接在React代码 使用原生DOM API, 请使用ref代替
 * @author shaojiang.wang
 */
("use strict");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------


const ERROR_MESSAGES = "不允许直接在React代码中使用原生DOM API, 请使用ref代替"

const defaultDisabledIdentifiers = ["getElementsByClassName","getElementById"];

module.exports = {

  meta: {
    type: "problem",
    docs: {
      description: ERROR_MESSAGES,
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    messages: {
      avoidMethod: ERROR_MESSAGES,
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          disabledIdentifiers: {
            type: 'array',
            items: { type: 'string' },
            description: '声明可以使用的操作名称列表',
          },
        },
      },
    ],
  },

  create: function (context) {
    const { disabledIdentifiers = defaultDisabledIdentifiers} = context.options[0] || {}
    return {
      Identifier: (node) => {
        if (disabledIdentifiers.includes(node.name)) {
          context.report({
            node,
            messageId: "avoidMethod",
          });
        }
        return;
      },
    };
  },
};
