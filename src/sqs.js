/* eslint-disable no-underscore-dangle */
const AWS = require('aws-sdk');
const stream = require('stream');

class SQSClient {
  constructor(options = {}) {
    this._options = options;
  }

  async sendMessage(items = []) {
    const data = Array.isArray(items) ? items : [items];
    if (data.length <= 0) {
      return;
    }
    const sqs = new AWS.SQS({
      apiVersion: '2012-11-05',
      region: this._options.awsRegion,
      accessKeyId: this._options.awsAccessKey,
      secretAccessKey: this._options.awsSecretKey,
    });
    try {
      const params = {
        MessageBody: JSON.stringify(data),
        QueueUrl: this._options.sqsQueueUrl,
      };
      await sqs.sendMessage(params).promise();
    } catch (err) {
      console.error(JSON.stringify({
        logLevel: 'warn',
        message: `The previous log(s) have not been sent. Reason: ${err.message}\n${err.stack}`,
      }));
      throw err;
    }
  }

  writeStream() {
    const self = this;
    const writeStreamObj = new stream.Writable({
      objectMode: true,
      highWaterMark: 1,
    });
    writeStreamObj._write = (chunk, encoding, callback) => {
      self
        .sendMessage(chunk)
        .then(() => callback(null))
        .catch((err) => callback(err));
    };
    return writeStreamObj;
  }
}


module.exports = { SQSClient };
