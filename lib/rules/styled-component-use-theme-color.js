/**
 * @fileoverview 使用 theme 替代 hard coded color
 * @author shaojiang.wang
 */
("use strict");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGES = "请使用 theme variables 替代 hard coding color string";
const colorByVariableName = {
  "--primary-color": "#f92d4f",
  "--secondary-color": "#4067cf",
};

const variableNameByColor = flipPlainObject(colorByVariableName);

module.exports = {
  meta: {
    docs: {
      description: ERROR_MESSAGES,
      category: "Suggestions",
      recommended: true,
    },
    fixable: "code",
    messages: {
      avoidMethod: ERROR_MESSAGES,
    },
    type: "problem",
    schema: [],
  },

  create: function (context) {
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

function flipPlainObject(plainObject) {
  const result = {};
  Object.keys(plainObject).forEach((key) => {
    result[plainObject[key]] = key;
  });
  return result;
}