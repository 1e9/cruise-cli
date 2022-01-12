import path from 'node:path';
import Package from './package.js';

const SETTINGS = {
  init: '@cruise-cli/commands',
};

export default function exec(...args) {
  let targetPath = process.env.CR_TARGET_PATH;
  const homePath = process.env.CR_HOME_PATH;
  let storeDir = '';
  const cmdObj = args[args.length - 1];
  const cmdName = cmdObj.name();
  console.log('12233', !targetPath);
  if (!targetPath) {
    targetPath = path.resolve(homePath, 'dependencies')
    storeDir = path.resolve(targetPath, 'node_modules')
    console.log('====', targetPath, storeDir);
  }
  const pkg = new Package({
    targetPath,
    storeDir,
    packageName: SETTINGS[cmdName],
    packageVersion: 'latest',
  });
  pkg.getRootPath();
}
