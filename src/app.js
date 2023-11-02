#!/usr/bin/env node
const prompt = require('prompt');

const cliProgress = require('cli-progress');

const { PROMPT_SCHEME, DEFAULT_FILES, COMMANDS_TO_EXEC, ERROR_TYPES } = require('./constants');

const {
  replaceVariableTextFragment,
  createDir,
  createFile,
  getParams,
  execCommand,
} = require('./utils');

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
  createDir(`${path}/src`);
  DEFAULT_FILES.map(({ name, content }) => {
    createFile({ path: `${path}/${name}`, content });
  });
}

function createProject(name) {
  const baseDir = `./${name}`;
  createDir(baseDir);
  createDefaultFiles(baseDir);
  execInitialCommands(name);
}

function runApp() {
  try {
    const [name] = getParams();

    if (name) {
      createProject(name);
    } else {
      prompt.start();

      prompt.get(PROMPT_SCHEME, (_, result) => {
        const { name } = result;
        prompt.stop();
        createProject(name);
      });
    }
  } catch (error) {
    if (error?.type === ERROR_TYPES.DIRNAME_ALREADY_EXISTS) {
      runApp();
    }
    console.error(error);
  }
}

module.exports = {
  runApp,
};
