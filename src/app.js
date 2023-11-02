#!/usr/bin/env node

const prompt = require('prompt');
const fs = require('fs');
const cliProgress = require('cli-progress');

const { exec } = require('child_process');

const { ERRORS, PROMPT_SCHEME, DEFAULT_FILES, COMMANDS_TO_EXEC } = require('./constants');
const { replaceVariableTextFragment } = require('./utils');

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

async function execInitialCommands(dirName) {
  try {
    let numberOfExecutedCommands = 0;

    const numberOfCommandsToExec = COMMANDS_TO_EXEC.length;
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    progressBar.start(100, 0);

    for (const command of COMMANDS_TO_EXEC) {
      const normalizedCommand = replaceVariableTextFragment(command, {
        dirName,
      });
      await execCommand(normalizedCommand);
      numberOfExecutedCommands++;
      progressBar.update((numberOfExecutedCommands / numberOfCommandsToExec) * 100);
    }
    progressBar.stop();
  } catch (error) {
    console.error(`Error running ${command}`, error);
  }
}

function createDir(dirName) {
  if (fs.existsSync(dirName)) {
    throw new Error({
      message: `directory with name ${dirname} already exists`,
      type: ERRORS.DIRNAME_ALREADY_EXISTS,
    });
  } else {
    fs.mkdirSync(dirName);
  }
  return dirName;
}

function createDefaultFiles(path) {
  createDir(`${path}/src`);
  DEFAULT_FILES.map(({ name, content }) => {
    fs.writeFileSync(`${path}/${name}`, content, { encoding: 'utf8' });
  });
}

function runApp() {
  prompt.start();

  prompt.get(PROMPT_SCHEME, (_, result) => {
    const { name } = result;

    try {
      const baseDir = `./${name}`;
      createDir(baseDir);
      prompt.stop();

      createDefaultFiles(baseDir);
      execInitialCommands(name);
    } catch ({ type }) {
      if (type === ERRORS.DIRNAME_ALREADY_EXISTS) {
        execPrompt();
      }
    }
  });
}

module.exports = {
  runApp,
};
