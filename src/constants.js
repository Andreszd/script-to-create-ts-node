const ERRORS = {
  DIRNAME_ALREADY_EXISTS: 'DIRNAME_ALREADY_EXISTS',
};

const PROMPT_SCHEME = {
  properties: {
    name: {
      description: 'Project name',
      pattern: /^[a-zA-Z\-]+$/,
      message: 'Name must be only letters with or without dashes',
      required: true,
    },
  },
};

const DEFAULT_FILES = [
  {
    name: 'nodemon.json',
    content: `
    {
      "watch": ["src"],
      "ext": ".ts,.js",
      "ignore": [],
      "exec": "npx ts-node ./src/app.ts"
    }`,
  },
  {
    name: 'src/app.ts',
    content: `
    //Enjoy using ts with node :D
    `,
  },
];

const COMMANDS_TO_EXEC = [
  'cd :dirName && npm init --y',
  'cd :dirName && npm i -D typescript @types/node ts-node nodemon rimraf',
  'cd :dirName && npx tsc --init --outDir dist/ --rootDir src',
  "cd :dirName && npm pkg set 'scripts.dev'='nodemon' && npm pkg set 'scripts.build'='rimraf ./dist && tsc' && npm pkg set 'scripts.start'='npm run build && node dist/app.js'",
];

module.exports = {
  ERRORS,
  PROMPT_SCHEME,
  DEFAULT_FILES,
  COMMANDS_TO_EXEC,
};
