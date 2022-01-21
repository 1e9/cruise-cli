'use strict';

import fs from 'node:fs';
import path from 'node:path';
import rootCheck from 'root-check';
import semver from 'semver';
import osHomedir from 'os-homedir';
import { Command } from 'commander';
import { pathExistsSync } from 'path-exists';
import { forEachObjIndexed, pipe, map, prop, join, isEmpty } from 'ramda';
import colors from 'colors';

import log from '@cruise-cli/log';
import { latestVersion } from '@cruise-cli/utils';
import { init } from '@cruise-cli/commands';
import exec from '@cruise-cli/exec';
import getPath from '@cruise-cli/esm-get-path';

const { version: currentVersion, bin } = JSON.parse(
  fs.readFileSync(getPath(import.meta.url, '../package.json'), 'utf-8')
);
const homeDir = osHomedir();
const program = new Command();
const initCheckMap = {
  pkgVersion: () => log.info(`current version ${currentVersion}`),
  initEnv: () => {
    process.env.CR_LOG_LEVEL = 'info';
    process.env.CR_TARGET_PATH = '';
    process.env.CR_HOME_PATH = `${homeDir}/cruise-cli`;
  },
  rootUsr: rootCheck,
  nodeVersion: () => {
    if (!semver.gte(process.version, '14.18.2')) {
      throw new Error(colors.red(`cruise-cli 需要 v${'14.18.2'} 及以上版本的 node.js`));
    }
  },
  homeDir: () => {
    if (!homeDir || !pathExistsSync(homeDir)) {
      throw new Error(colors.red('用户主目录不存在'));
    }
  },
  updateHint: () => {
    if (latestVersion && semver.gt(latestVersion, currentVersion)) {
      log.warn('', `当前版本：${currentVersion} 最新版本：${latestVersion} 安装命令 npm i -g @cruise-cli@latest `);
    }
  },
};

const registerCommand = () => {
  program
    .name(Object.keys(bin).join('|'))
    .usage('<command> [options]')
    .version(currentVersion)
    .option('-tp, --targetPath <path>', '指定本地调试路径')
    .option('-d, --debug', '是否开启debug模式', false);

  program
    .command('init [projectName]')
    .description('项目初始化')
    .option('-f, --force', '是否覆盖已有项目')
    .action(exec);

  const options = program.opts();

  program.on('option:targetPath', () => {
    process.env.CR_TARGET_PATH = options.targetPath;
  });

  program.on('option:debug', () => {
    if (options.debug) {
      process.env.CR_LOG_LEVEL = 'verbose';
    } else {
      process.env.CR_LOG_LEVEL = 'info';
    }
    log.level = process.env.CR_LOG_LEVEL;
  });

  program.on('command:*', (commands) => {
    console.log(`未知命令 ${commands[0]}`);
  });

  program.parse(process.argv);
  if (isEmpty(program.args)) {
    program.outputHelp();
  }
};

export default function core(argv) {
  try {
    forEachObjIndexed((checkFuc) => checkFuc(), initCheckMap);
    registerCommand();
  } catch (err) {
    log.error(err.message);
  }
}
