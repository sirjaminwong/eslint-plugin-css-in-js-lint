/**
 * @fileoverview   不允许直接在React代码 使用原生DOM API, 请使用ref代替
 * @author shaojiang.wang
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/react-no-native-dom-api"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ERROR_MESSAGES = "不允许直接在react代码 使用原生DOM API, 请使用ref代替"


const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { ecmaVersion: 2018, sourceType: "module", ecmaFeatures: {
    jsx: true
  } },
});
ruleTester.run("react-no-native-dom-api", rule, {
  valid: [],

  invalid: [
    {
      code: `const element = document.getElementById;`,
      errors: [{ message: ERROR_MESSAGES }],
    },
    {
      code: `<Popover getPopupContainer={() => document.getElementById('header')}/>`,
      errors: [{ message: ERROR_MESSAGES }],
    },
  ],
});
