import path from 'node:path';
import { spawn } from 'node:child_process';
import * as commands from '@cruise-cli/commands';

import Package from './package.js';

const SETTINGS = {
  init: '@cruise-cli/esm-get-path',
};

export default function exec(...args) {
  const [cmdObj, options] = [...args].reverse();
  let targetPath = options.targetPath || process.env.CR_TARGET_PATH;
  const homePath = process.env.CR_HOME_PATH;
  let storeDir = '';
  const cmdName = cmdObj.name();
  // if (!targetPath) {
  //   targetPath = path.resolve(homePath, 'dependencies');
  //   storeDir = path.resolve(targetPath, 'node_modules');
  //   const pkg = new Package({
  //     targetPath,
  //     storeDir,
  //     packageName: SETTINGS[cmdName],
  //     packageVersion: 'latest',
  //   });
  //   if (pkg.exists()) {
  //     pkg.update();
  //   } else {
  //     pkg.install();
  //   }
  // } else {
  //   // commands[cmdName].apply(null, args);
  // }
  spawn('node', ['-e', commands[cmdName].apply(null, args)])
}
