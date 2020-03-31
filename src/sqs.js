/* eslint-disable no-underscore-dangle */
const AWS = require('aws-sdk');
const stream = require('stream');
const { AccessCredentials } = require('./access');

class SQSClient {
  constructor(options = {}) {
    this._sqsQueueUrl = options.sqsQueueUrl;
    this._accessCredentials = new AccessCredentials(options);
  }

  async sendMessage(items = []) {
    const data = Array.isArray(items) ? items : [items];
    if (data.length <= 0) {
      return;
    }
    const accessCreds = await this._accessCredentials.getAccess();
    const sqs = new AWS.SQS({
      apiVersion: '2012-11-05',
      accessKeyId: accessCreds.AccessKeyId,
      secretAccessKey: accessCreds.SecretAccessKey,
      sessionToken: accessCreds.Token,
    });
    try {
      const params = {
        MessageBody: JSON.stringify(data),
        QueueUrl: this._sqsQueueUrl,
      };
      await sqs.sendMessage(params).promise();
    } catch (err) {
      console.warn('The previous log(s) have not been sent');
      console.warn(`${err.message}\n${err.stack}`);
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
        .catch(callback);
    };
    return writeStreamObj;
  }
}


module.exports = { SQSClient };
