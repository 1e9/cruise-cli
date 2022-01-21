'use strict';

import semver from 'semver';
import colors from 'colors';
import log from '@cruise-cli/log';

export default class Command {
  constructor(args) {
    let runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve();
      chain = chain.then(this.checkNodeVersion);
      chain = chain.then(() => this.initArgs(args));
      chain = chain.then(() => this.init());
      chain = chain.then(() => this.exec());
      chain.catch((err) => log.error(err.message));
    });
  }

  initArgs(args) {
    const [commandObj, ...argv] = [...args].reverse();
    this._cmd = commandObj;
    this._argv = argv;
  }
  checkNodeVersion() {
    const nodeVersion = '14.0.0';
    if (!semver.gte(process.version, nodeVersion)) {
      throw new Error(colors.red(`cruise-cli 需要 v${nodeVersion} 及以上版本的 node.js`));
    }
  }

  init() {
    throw new Error('init 必须实现');
  }

  exec() {
    throw new Error('exec 必须实现');
  }
}
