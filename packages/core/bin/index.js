#!/usr/bin/env node

'use strict';

import importLocal from 'import-local';
import log from 'npmlog';
import path from 'path';

import cli from '../lib/index.js';

if (importLocal(path.resolve())) {
  log.info('cli', 'using local version of lerna');
} else {
  cli(process.argv.slice(2));
}
