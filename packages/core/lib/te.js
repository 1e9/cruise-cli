// 'use strict';

import { pathExistsSync } from 'path-exists';
import osHomedir from 'os-homedir';

console.log(pathExistsSync(osHomedir() + 'd'));
