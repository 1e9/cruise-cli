import * as commands from '@cruise-cli/commands';

import { spawn } from 'node:child_process';

export default function exec(...args) {
  // 一些命令执行前置逻辑...
  const cmdObj = args[args.length - 1];
  spawn('node', ['-e', commands[cmdObj.name()].apply(null, args)])
}
