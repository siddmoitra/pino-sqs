const program = require('commander');
const pump = require('./pump');

const validate = (config) => {
  // Validate config
  if (!config.sqsQueueUrl || config.sqsQueueUrl.trim().length === 0) {
    throw new Error('queueUrl is mandatory. Use --queue-url flag or env PS_QUEUE_URL');
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

// main cli logic
const main = () => {
  program
    .option('--queue-url <queueUrl>', 'SQS Queue URL')
    .option('--aws-access-key <awsAccessKey>', 'AWS Access Key')
    .option('--aws-secret-key <awsSecretKey>', 'AWS Secret Key')
    .option('--ecs-enabled', 'If this runs on AWS ECS', false)
    .action(async (options) => {
      try {
        const config = {
          sqsQueueUrl: options.queueUrl || process.env.PS_QUEUE_URL,
          ecsEnabled: options.ecsEnabled,
          awsAccesskey: options.awsAccessKey || process.env.PS_AWS_ACCESS_KEY,
          awsSecretKey: options.awsSecretKey || process.env.PS_AWS_SECRET_KEY,
        };
        // Validate config
        validate();

        const writeStream = await pump.createWriteStream(config);
        process.stdin.pipe(writeStream);
        process.stdin.pipe(process.stdout);
      } catch (err) {
        console.warn(err);
        process.exit(1);
      }
    });

  program.parse(process.argv);
};

main();
