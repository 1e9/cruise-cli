'use strict';

import fs from 'node:fs';
import path from 'node:path';
import rootCheck from 'root-check';
import semver from 'semver';
import osHomedir from 'os-homedir';
import minimist from 'minimist';
import dotenv from 'dotenv';
import { pathExistsSync } from 'path-exists';
import { forEachObjIndexed } from 'ramda';
import colors from 'colors';

import log from '@cruise-cli/log';
import { latestVersion } from '@cruise-cli/utils';

const { version: currentVersion } = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'package.json'), 'utf-8'));
console.log(currentVersion)
const homeDir = osHomedir();
const initCheckMap = {
  pkgVersion: () => log.info(`current version ${currentVersion}`),
  rootUsr: rootCheck,
  nodeVersion: () => {
    if (!semver.gte(process.version, '13.0.0')) {
      throw new Error(colors.red(`cruise-cli 需要 v${'13.0.0'} 及以上版本的 node.js`));
    }
  },
  homeDir: () => {
    if (!homeDir || !pathExistsSync(homeDir)) {
      throw new Error(colors.red('用户主目录不存在'));
    }
  },
  inputArgs: () => {
    const args = minimist(process.argv.slice(2));
    if (args.debug) {
      process.env.LOG_LEVEL = 'verbose';
    } else {
      process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
  },
  // env: () => {
  //   const dir = path.resolve(homeDir, '.env');
  //   console.log(path.join(homeDir, 'env'));
  //   const config = dotenv.config({ path: dir })
  //   log.verbose('环境变量', config);
  // },
  updateHint: () => {
    if (latestVersion && semver.gt(latestVersion, currentVersion)) {
      log.warn('', `当前版本：${currentVersion} 最新版本：${latestVersion} 安装命令 npm i -g @cruise-cli@latest `);
    }
  },
};

export default function core(argv) {
  try {
    forEachObjIndexed((checkFuc) => checkFuc(), initCheckMap);
  } catch (err) {
    log.error(err.message);
  }
}
