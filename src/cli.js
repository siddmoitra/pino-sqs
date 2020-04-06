#!/usr/bin/env node

const program = require('commander');
const pump = require('./pump');

const validate = (config) => {
  // Validate config
  if (!config.sqsQueueUrl || config.sqsQueueUrl.trim().length === 0) {
    throw new Error('queueUrl is mandatory. Use --queue-url flag or env PS_QUEUE_URL');
  }
  if (!config.awsRegion || config.awsRegion.trim().length === 0) {
    throw new Error('awsRegion is mandatory. Use --aws-region flag or env PS_AWS_REGION');
  }
  if (!config.ecsEnabled) {
    if (!config.awsAccessKey || config.awsAccessKey.trim().length === 0) {
      throw new Error('awsAccessKey is mandatory when ECS flag is not enabled. Use --aws-access-key flag or env PS_AWS_ACCESS_KEY');
    }
    if (!config.awsSecretKey || config.awsSecretKey.trim().length === 0) {
      throw new Error('awsSecretKey is mandatory when ECS flag is not enabled. Use --aws-secret-key flag or env PS_AWS_SECRET_KEY');
    }
  }
};

const getRegionFromSQSUrl = (sqsUrl) => {
  const tokens = sqsUrl.split('.');
  if (tokens.length > 2) {
    return tokens[1];
  }
  return undefined;
};

// main cli logic
const main = () => {
  program
    .name('pino-sqs')
    .usage('[options]');

  program
    .option('--queue-url <queueUrl>', 'SQS Queue URL')
    .option('--aws-access-key <awsAccessKey>', 'AWS Access Key')
    .option('--aws-secret-key <awsSecretKey>', 'AWS Secret Key')
    .option('--aws-region <awsRegion>', 'AWS Region')
    .option('--stdout-enabled', 'If the stdout is enabled', false)
    .action(async (options) => {
      try {
        const config = {
          sqsQueueUrl: options.queueUrl || process.env.PS_QUEUE_URL,
          awsAccessKey: options.awsAccessKey || process.env.PS_AWS_ACCESS_KEY,
          awsSecretKey: options.awsSecretKey || process.env.PS_AWS_SECRET_KEY,
          awsRegion: options.awsRegion || process.env.PS_AWS_REGION,
          stdoutEnabled: options.stdoutEnabled,
        };

        // If AWS region is not supplied, then try to grab it from SQS url
        if (!config.awsRegion) {
          config.awsRegion = getRegionFromSQSUrl(config.sqsQueueUrl);
        }
        // Validate config
        validate(config);

        const writeStream = await pump.createWriteStream(config);
        process.stdin.pipe(writeStream);
        if (config.stdoutEnabled) {
          process.stdin.pipe(process.stdout);
        }
      } catch (err) {
        console.warn(err);
        process.exit(1);
      }
    });

  program.parse(process.argv);
};

main();
