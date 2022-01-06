#!/usr/bin/env node

'use strict';

import importLocal from 'import-local';
import log from 'npmlog';
import getPath from '@cruise-cli/esm-get-path';

import cli from '../lib/index.js';

if (importLocal(getPath(import.meta.url, ''))) {
  log.info('cli', 'using local version of cruise-cli');
} else {
  cli(process.argv.slice(2));
}
