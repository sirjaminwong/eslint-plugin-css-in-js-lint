/**
 * @fileoverview 使用 theme variables 替代 hard coding color string
 */
("use strict");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGES = "请使用 theme variables 替代 hard coding color string";


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
        type: 'object',
        additionalProperties: false,
        properties: {
          rootPath: {
            type: 'string',
            description: 'theme variables样式文件路径',
          },
          variableMap: {
            type: 'object',
            description: 'variableMap',
          },
        },
      },
    ],
  },

  create: function (context) {
    const { options } = context;

    const ruleOptions = options[0];

    const colorByVariableName = ruleOptions.variableMap;

    const variableNameByColor = flipPlainObject(colorByVariableName);

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
