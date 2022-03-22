'use strict';
import fs from 'fs-extra';
import axios from 'axios';
import path from 'node:path';
import inquirer from 'inquirer';
import semver from 'semver';
import log from '@cruise-cli/log';
import { fetch } from '@cruise-cli/utils';

import Command from './command.js';

class InitCommand extends Command {
  // constructor(args) {
  //   super(args);
  // }

  init() {
    this.projectName = this._argv[1];
    this.force = !!this._argv[0].force;
    if (!this.projectName) log.warn('projectName 不能为空');
    log.verbose('projectName', this.projectName);
    log.verbose('force', this.force);
  }

  async exec() {
    try {
      // 检查目录中
      await this.checkDirIsEmpty();
      this.getProjectInfo();
    } catch (e) {
      console.log(e);
    }
  }

  async checkDirIsEmpty() {
    const localPath = path.resolve(this.projectName || '');

    console.log('first', process.env);
    // 指定目录是否存在
    const isPath = fs.pathExistsSync(localPath);
    const fileList = isPath ? fs.readdirSync(localPath) : [];

    const convertProject = () =>
      inquirer
        .prompt([
          {
            type: 'confirm',
            name: 'isConvert',
            default: false,
            message: `是否覆盖项目: ${this.projectName}`,
          },
        ])
        .then(({ isConvert }) => isConvert && fs.emptyDirSync(localPath));

    if (this.force) {
      convertProject();
    } else if (fileList?.length) {
      // 当前目录线存在项目，且项目文件夹不为空
      await inquirer
        .prompt([
          {
            type: 'confirm',
            name: 'isInitial',
            default: false,
            message: '项目已存在，是否继续初始化项目',
          },
        ])
        .then(({ isInitial }) => isInitial && convertProject());
    }
  }

  async getProjectInfo() {
    const { type } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        choices: ['Project', 'Component'],
        message: '请选择初始化项目类型',
      },
    ]);
    if (type === 'Project') {
      const info = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: '请输入项目名',
          validate: function (v) {
            const done = this.async();
            setTimeout(() => {
              if (!/^[\w-]+$/.test(v)) {
                done('可输入数字,字母,-, _');
              } else {
                done(null, true);
              }
            }, 0);
          },
        },
        {
          type: 'input',
          name: 'version',
          message: '请输入版本号',
          default: '1.0.0',
          validate: function (v) {
            const done = this.async();
            setTimeout(() => {
              if (!semver.valid(v)) {
                done('请输入正确的版本号');
              } else {
                done(null, true);
              }
            }, 0);
          },
        },
      ]);
      return { type, ...info };
    }
    if (type === 'Component') {
      await fetch.get('/api/template', { email: '123@qq.com' });
    }
  }

  downloadTemplate() {}
}

export function init(...args) {
  return new InitCommand(args);
}
