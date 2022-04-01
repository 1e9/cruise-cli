'use strict';
import fs from 'fs-extra';
import axios from 'axios';
import path from 'node:path';
import { spawn } from 'node:child_process';
import inquirer from 'inquirer';
import semver from 'semver';
import log from '@cruise-cli/log';
import { request, Package } from '@cruise-cli/utils';

import Command from './command.js';

class InitCommand extends Command {
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
      if (!this.checkProjectName(this.projectName)) {
        throw new Error(`项目名："${this.projectName}" 格式错误，可输入数字,字母,-, _`);
      }
      await this.getTemplates();
      const templateInfo = await this.getTemplateInfo();
      if (templateInfo.templateId) this.downloadTemplate(templateInfo);
    } catch (e) {
      log.error(e);
    }
  }
  checkProjectName(projectName) {
    return projectName && /^[\w-]+$/.test(projectName);
  }
  async getTemplateInfo() {
    let installPath = process.cwd();
    const { type } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        choices: ['project', 'component'],
        message: '请选择初始化模版类型',
      },
    ]);
    const title = type === 'project' ? '项目' : '组件';
    const checkCover = (answers) => !answers.hasOwnProperty('isConvert') || answers.isConvert;
    const info = await inquirer.prompt([
      ...(this.projectName
        ? []
        : [
            {
              type: 'input',
              name: 'name',
              message: `请输入${title}名`,
              validate: function (v) {
                const done = this.async();
                setTimeout(() => {
                  if (this.checkProjectName(v)) {
                    done(null, true);
                  } else {
                    done('可输入数字,字母,-, _');
                  }
                }, 0);
              },
            },
          ]),
      {
        type: 'confirm',
        name: 'isConvert',
        default: false,
        when: (answers) => {
          installPath = path.resolve(this.projectName || answers?.name || '');
          const isPath = fs.pathExistsSync(installPath);
          const fileList = isPath ? fs.readdirSync(installPath) : [];
          return fileList.length;
        },
        message: `已存在同名${title}，是否覆盖`,
      },
      {
        type: 'input',
        name: 'version',
        message: '请输入版本号',
        default: '1.0.1',
        when: (answers) => {
          const isContinue = checkCover(answers);
          if (isContinue) {
            // fs.emptyDirSync(installPath);
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
    return { type, ...info, installPath };
  }
  async getTemplates() {
    const { data } = await request.get('/api/template');
    this.templates = data || [{ id: '623d9a7e2815cef7d8818d5e', name: 'vue', description: 'vue3+ts模版' }];
  }
  async downloadTemplate({ templateId, installPath }) {
    const template = this.templates.find(({ id }) => id === templateId);
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
    log.info('开始下载安装模版...');
    await pkg.install();
    fs.copySync(pkg.fileCachePath, installPath);
    log.info('模版安装完成');
    // spawn('npm', ['i'], { cwd: installPath, stdio: 'inherit' });
    // await spawn('npm', ['run', 'dev'], { cwd: installPath, stdio: 'inherit' });
  }
}

export function init(...args) {
  return new InitCommand(args);
}
