import globals from "globals";
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  { 
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
    },
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/indent': [
        'error',
        2
      ],
      '@stylistic/js/linebreak-style': [
        'error',
        'unix'
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      '@stylistic/js/semi': [
        'error',
        'never'
      ],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true },
      ],
      'no-console': 'off',
    },
  },
  {
    ignores: ["dist/**", "build/**"]
  },
]

// npm install eslint @eslint/js --save-dev
// npx eslint --init
// -> edit

// So far, our ESLint configuration file defines the files option with ["*/.js"],
// which tells ESLint to look at all JavaScript files in our project folder.
// The languageOptions property specifies options related to language features that ESLint should expect,
// in which we defined the sourceType option as "commonjs".
// This indicates that the JavaScript code in our project uses the CommonJS module system, allowing ESLint to parse the code accordingly.

// The globals property specifies global variables that are predefined.
// The spread operator applied here tells ESLint to include all global variables defined in the globals.node settings such as the process.
// In the case of browser code we would define here globals.browser to allow browser specific global variables like window, and document.

// Finally, the ecmaVersion property is set to "latest".
// This sets the ECMAScript version to the latest available version,
// meaning ESLint will understand and properly lint the latest JavaScript syntax and features.

// We've added the js.configs.recommended to the top of the configuration array,
// this ensures that ESLint's recommended settings are applied first before our own custom options.

// Let's continue building the configuration file. Install a plugin that defines a set of code style-related rules:
// npm install --save-dev @stylistic/eslint-plugin-js

// The plugins property provides a way to extend ESLint's functionality by adding custom rules, configurations,
// and other capabilities that are not available in the core ESLint library. We've installed and enabled the @stylistic/eslint-plugin-js,
// which adds JavaScript stylistic rules for ESLint. In addition, rules for indentation, line breaks, quotes,
// and semicolons have been added. These four rules are all defined in the Eslint styles plugin.

// Inspecting and validating a file like index.js can be done with the following command:
// npx eslint index.js

// Files in the dist directory also get checked when the command is run. We do not want this to happen,
// and we can accomplish this by adding an object with the ignores property that specifies an array of directories and files we want to ignore.

// This includes a rule that warns about console.log commands.
// Disabling a rule can be accomplished by defining its "value" as 0 or "off" in the configuration file.
// Let's do this for the no-console rule in the meantime.

// Disabling the no-console rule will allow us to use console.log statements without ESLint flagging them as issues.
// This can be particularly useful during development when you need to debug your code.