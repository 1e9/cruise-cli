'use strict';
import fs from 'fs-extra';
import axios from 'axios';
import path from 'node:path';
import inquirer from 'inquirer';
import semver, { re } from 'semver';
import log from '@cruise-cli/log';
import { request, Package } from '@cruise-cli/utils';

import Command from './command.js';

class InitCommand extends Command {
  // constructor(args) {
  //   super(args);
  // }
  params = [];
  init() {
    this.projectName = this._argv[1];
    this.force = !!this._argv[0].force;
    if (!this.projectName) log.warn('projectName 不能为空');
    log.verbose('projectName', this.projectName);
    log.verbose('force', this.force);
  }

  async exec() {
    try {
      await this.getTemplates();
      const templateInfo = await this.getTemplateInfo();
      if (templateInfo.templateId) this.downloadTemplate(templateInfo);
    } catch (e) {
      console.log(e);
    }
  }

  async getTemplateInfo() {
    let localPath = process.cwd();
    const checkCover = (answers) => !answers.hasOwnProperty('isConvert') || answers.isConvert;
    const { type } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        choices: ['project', 'component'],
        message: '请选择初始化模板类型',
      },
    ]);
    const info = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '请输入模版名',
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
        type: 'confirm',
        name: 'isConvert',
        default: false,
        when: (answers) => {
          localPath = path.resolve(answers.name || '');
          const isPath = fs.pathExistsSync(localPath);
          const fileList = isPath ? fs.readdirSync(localPath) : [];
          return fileList.length;
        },
        message: '模版同名文件已存在，是否覆盖',
      },
      {
        type: 'input',
        name: 'version',
        message: '请输入版本号',
        default: '1.0.1',
        when: (answers) => {
          const isContinue = checkCover(answers);
          console.log(answers.isConvert, isContinue);
          if (isContinue) {
            // fs.emptyDirSync(localPath);
          }
          return isContinue;
        },
        validate: function (v) {
          const done = this.async();
          setTimeout(() => {
            if (semver.valid(v) || v === 'latest') {
              done(null, true);
            } else {
              done('请输入正确的版本号');
            }
          }, 0);
        },
      },
      {
        type: 'list',
        name: 'templateId',
        when: checkCover,
        choices: this.templates
          .filter((template) => template.type === type)
          .map(({ description, id }) => ({ name: description, value: id })),
        message: '请选择模版',
      },
    ]);
    return { type, ...info };
  }
  async getTemplates() {
    const { data } = await request.get('/api/template');
    this.templates = data || [{ id: '623d9a7e2815cef7d8818d5e', name: 'vue', description: 'vue3+ts模版' }];
  }
  async downloadTemplate(templateInfo) {
    const template = this.templates.find(({ id }) => id === templateInfo?.templateId);
    if (!template.id) {
      return log.error('模版未找到');
    }
    const homePath = process.env.CR_HOME_PATH;
    let targetPath = path.resolve(homePath, '.cruise-cli');
    const pkg = new Package({
      targetPath,
      packageName: `@cruise-cli-templates/${template.name}`,
      packageVersion: template.version,
      storeDir: path.resolve(homePath, '.cruise-cli', 'templates'),
    });
    console.log(pkg, '=', pkg.fileCachePath);
    log.info('开始下载模版...');
    await pkg.install();
    fs.copySync(pkg.fileCachePath, path.resolve(process.cwd(), templateInfo.name));
    log.info('模版下载成功');
  }
}

export function init(...args) {
  return new InitCommand(args);
}
