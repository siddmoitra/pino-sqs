const program = require('commander');

// main cli logic
const main = () => {
  program
    .option('-u, --queue-url <queueUrl>', 'SQS Queue URL')
    .action(async (options) => {
      console.log(options);
    });

  program.parse(process.argv);
};

main();
