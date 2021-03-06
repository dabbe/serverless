'use strict';

const boxen = require('boxen');
const chalk = require('chalk');
const isPathDependent =
  require('../lib/utils/isStandaloneExecutable') && process.platform !== 'win32';

const truthyStr = val => val && !['0', 'false', 'f', 'n', 'no'].includes(val.toLowerCase());
const { CI, ADBLOCK, SILENT } = process.env;
if (!truthyStr(CI) && !truthyStr(ADBLOCK) && !truthyStr(SILENT)) {
  const messageTokens = ['Serverless Framework successfully installed!'];
  if (isPathDependent) {
    messageTokens.push(
      'To start your first project, please open another terminal and run “serverless”.',
      'You can uninstall at anytime by running “serverless uninstall”.'
    );
  } else {
    messageTokens.push('To start your first project run “serverless”.');
  }
  process.stdout.write(
    `${boxen(chalk.yellow(messageTokens.join('\n\n')), {
      padding: 1,
      margin: 1,
      borderColor: 'yellow',
    })}\n`
  );
}

try {
  const Serverless = require('../lib/Serverless');
  const serverless = new Serverless();

  serverless
    .init()
    .then(() => serverless.utils.logStat(serverless, 'install'))
    .catch(() => {});
} catch (error) {
  // Ignore any eventual errors.
  // Package when installed globally may be installed in uncommon user contexts,
  // that may lead to fs access related crashes
  // when e.g. trying to access user's .serverlessrc config
}
