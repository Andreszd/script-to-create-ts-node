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

function createDefaultFiles(path) {
  DEFAULT_FILES.map(({ name, content }) => {
    fs.writeFileSync(`${path}/${name}`, content, { encoding: 'utf8' });
  });
}

function createDir(dirName) {
  const directoryPath = `./${dirName}`;

  if (fs.existsSync(directoryPath)) {
    throw new Error({
      message: `directory with name ${dirname} already exists`,
      type: ERRORS.DIRNAME_ALREADY_EXISTS,
    });
  } else {
    fs.mkdirSync(directoryPath);
  }
  return directoryPath;
}

function execPrompt() {
  prompt.start();

  prompt.get(PROMPT_SCHEME, (_, result) => {
    const { name } = result;

    try {
      const dirPath = createDir(name);
      prompt.stop();
      createDefaultFiles(dirPath);
      execInitialCommands(name);
    } catch ({ type }) {
      if (type === ERRORS.DIRNAME_ALREADY_EXISTS) {
        execPrompt();
      }
    }
  });
}

function main() {
  execPrompt();
}

main();
