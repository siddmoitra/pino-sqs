const pumpify = require('pumpify');
const batch2 = require('batch2');
const split2 = require('split2');
const { SQSClient } = require('./sqs');

const batchStream = (size) => batch2.obj({ size });

const parseJsonStream = () => split2((str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    console.warn(`Could not parse JSON: ${str}`);
    return undefined;
  }
});

const createWriteStreamSync = (options = {}) => {
  const { size = 1 } = options;
  return pumpify(parseJsonStream(), batchStream(size), new SQSClient(options).writeStream());
};

const createWriteStream = async (options = {}) => createWriteStreamSync(options);

module.exports = {
  createWriteStream,
  createWriteStreamSync,
};
