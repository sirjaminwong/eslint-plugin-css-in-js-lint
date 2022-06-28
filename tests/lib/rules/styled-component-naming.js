/**
 * @fileoverview  styled component 必须以 Styled 为前缀命名
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../lib/rules/styled-component-naming");
const  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ERROR_MSG =
  "styled component 必须以 Styled 为前缀命名";

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { ecmaVersion: 2018, sourceType: "module" },
});
ruleTester.run("styled-component-naming", rule, {
  valid: [
  {
    code: `const StyledFooter = styled.div`
  },
  {
    code: "const StyledFooter = styled.div<{name : string}>``"
  },
  {
    code : "interface A {}"
  }
],

  invalid: [
    {
      code: "const Footer = styled.div``" ,
      errors: [{ message: ERROR_MSG }],
    },
    {
      code: "const Footer = styled.div<{name : string}>``",
      errors: [{ message: ERROR_MSG }],
    },
    {
      code: "const Button = styled(Button)``",
      errors: [{ message: ERROR_MSG }],
    },
    {
      code: "const EditButton = styled(Button)<{name: string}>``",
      errors: [{ message: ERROR_MSG }],
    },
  ],
});
