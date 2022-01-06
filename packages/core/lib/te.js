// 'use strict';

import { pathExistsSync } from 'path-exists';
import osHomedir from 'os-homedir';
import path from 'node:path';

// console.log(pathExistsSync(osHomedir() + 'd'));
export default function esmGetPath(paths = '', importMetaUrl = import.meta.url) {
  return path.resolve() || new URL(paths, importMetaUrl).pathname;
}
