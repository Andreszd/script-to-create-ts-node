const fs = require('fs');
const yargs = require('yargs/yargs');

const { exec } = require('child_process');
const { hideBin } = require('yargs/helpers');
const { ARGUMENTS_VALIDATION, ERROR_TYPES } = require('./constants');

function replaceVariableTextFragment(text, valuesToReplace) {
  try {
    if (typeof text !== 'string') return '';

    const regex = /:\w+/g;
    const vars = text.match(regex);
    if (!vars?.length) return text;

    let textToFormat = text;

    vars.forEach((variable) => {
      textToFormat = textToFormat.replace(
        variable,
        valuesToReplace[variable?.replace(/[^a-zA-Z0-9]/g, '')] ?? ''
      );
    });
    return textToFormat;
  } catch (error) {
    console.error(error);
    return text;
  }
}

function getParams() {
  const name = yargs(hideBin(process.argv)).argv._[0];

  if (name && !name?.match(ARGUMENTS_VALIDATION.name.pattern)) {
    throw new Error({
      message: 'Project name must be only letters with or without dashes',
      type: ERROR_TYPES.INVALID_DIRNAME,
    });
  }

  return [name];
}

function createDir(dirName) {
  if (fs.existsSync(dirName)) {
    throw new Error({
      message: `directory with name ${dirname} already exists`,
      type: ERROR_TYPES.DIRNAME_ALREADY_EXISTS,
    });
  } else {
    fs.mkdirSync(dirName);
  }
  return dirName;
}

function existsDir(dirName) {
  return fs.existsSync(dirName);
}

function createFile({ path, content, options = { encoding: 'utf8' } } = {}) {
  fs.writeFileSync(path, content, { ...options });
}

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  existsDir,
  createDir,
  createFile,
  getParams,
  execCommand,
  replaceVariableTextFragment,
};
