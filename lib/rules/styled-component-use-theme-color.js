/**
 * @fileoverview 使用 theme variables 替代 hard coding color string
 */
("use strict");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGES = "请使用 theme variables 替代 hard coding color string";

const fs = require("fs");
const path = require("path");
const resultOf = require("../../utils/result-of");
const flipPlainObject= require("../../utils/flip-plain-object");

const joinRootPath = (p) => path.join(process.cwd(), p);

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: ERROR_MESSAGES,
      category: "Suggestions",
      recommended: true,
    },
    fixable: "code",
    messages: {
      avoidMethod: ERROR_MESSAGES,
    },
    schema: [
      {
        type: "object",
        additionalProperties: false,
        properties: {
          rootCssFilePath: {
            type: "string",
            description: "theme variables样式文件路径",
          },
        },
      },
    ],
  },

  create: function (context) {
    const { options } = context;
    const ruleOptions = options[0];

    const variableNameByColor = resultOf(() => {
      const regexCssVariable = /--[^;]+/g;

      const globalsStyles = fs
        .readFileSync(joinRootPath(ruleOptions.rootCssFilePath))
        .toString();

      const entries = globalsStyles
        .match(regexCssVariable)
        .map((item) => item.split(":").map((item) => item.trim()));

      const colorByVariableName = Object.fromEntries(entries);

      return flipPlainObject(colorByVariableName);
    });

    return {
      TemplateElement: (node) => {
        const allThemeColor = Object.keys(variableNameByColor);
        const matchThemeColor = allThemeColor.some((color) =>
          node.value.raw.includes(color)
        );
        if (matchThemeColor) {
          const text = context.getSourceCode().getText(node);
          context.report({
            node: node,
            messageId: "avoidMethod",
            fix: (fixer) => {
              let result = text;
              allThemeColor.forEach((color) => {
                const replaceColor = variableNameByColor[color];
                result = result.replace(color, `var(${replaceColor})`);
              });
              return fixer.replaceText(node, result);
            },
          });
        }
        return;
      },
    };
  },
};


