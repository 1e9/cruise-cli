'use strict';

import nodePath from 'node:path';

export default function getPath(importMetaUrl, path = '') {
  return importMetaUrl ? new URL(path, importMetaUrl).pathname : nodePath.resolve(path);
}
