'use strict';
import fs from 'node:fs';
import inquirer from 'inquirer';
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
    try {
      this.prepare();
    } catch (e) {}
  }

  prepare() {
    const cwd = process.cwd();
    const fileList = fs.readdirSync(cwd);
    inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: 'input name',
    }])
  }
}

export function init(...args) {
  return new InitCommand(args);
}
