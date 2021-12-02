'use strict';

import log from 'npmlog';

log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';
log.heading = 'cli:';
log.headingStyle = { fg: 'cyan' };

export default log;
