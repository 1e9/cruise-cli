'use strict';

import log from '@cruise-cli/log';
import { spawn } from 'node:child_process';

import Command from './command.js';

class InitCommand extends Command {
  // constructor(args) {
  //   super(args);
  // }

  init() {
    this.projectName = this._argv[1];
    this.force = !!this._argv[0].force;
    log.verbose('projectName', this.projectName);
    log.verbose('force', this.force);
  }

  exec() {
    console.log('ece object');
  }
}

export function init(...args) {
  return new InitCommand(args);
}