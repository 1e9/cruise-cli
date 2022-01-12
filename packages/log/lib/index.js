'use strict';

import log from 'npmlog';

log.level = process.env.CR_LOG_LEVEL ? process.env.CR_LOG_LEVEL : 'info';
log.heading = 'cli:';
log.headingStyle = { fg: 'cyan' };

export default log;
